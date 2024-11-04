const mega = require('megajs');
const fs = require('fs');
const path = require('path');

const email = 'Email';
const password = 'Password of account';

const storage = new mega.Storage({ email, password });

const command = process.argv[2];
const itemPath = process.argv[3];
const fileLink = process.argv[4];

storage.on('ready', () => {
  switch (command) {
    case 'upload':
      uploadFile(itemPath);
      break;
    case 'download':
      downloadFile(fileLink, itemPath);
      break;
    case 'list':
      listItems();
      break;
    case 'delete':
      deleteItem(itemPath);
      break;
    case 'share':
      shareItemWithExternalRetry(itemPath);
      break;
    default:
      console.log('Available commands:');
      console.log('  upload <filePath> - Upload a file to Mega.nz');
      console.log('  download <fileLink> <savePath> - Download a file from Mega.nz');
      console.log('  list - List all files and folders in Mega.nz');
      console.log('  delete <itemName> - Delete a file or folder from Mega.nz by name');
      console.log('  share <itemName> - Generate a public link for a file or folder');
      break;
  }
});

storage.on('error', (error) => {
  console.error("Error logging in:", error);
});

function uploadFile(filePath) {
  if (!filePath) {
    console.error("Please provide a file path to upload.");
    return;
  }

  const fileName = path.basename(filePath);
  const fileStream = fs.createReadStream(filePath);
  const fileSize = fs.statSync(filePath).size;  // Get file size

  const upload = storage.upload({ name: fileName, size: fileSize, allowUploadBuffering: true });  // Set file size and enable buffering
  fileStream.pipe(upload);

  upload.on('complete', (file) => {
    console.log("File uploaded successfully:", file.name);
    console.log("File link:", file.link);
  });
}

function downloadFile(fileLink, savePath) {
  if (!fileLink || !savePath) {
    console.error("Please provide a file link and a save path.");
    return;
  }

  const download = storage.file(fileLink).download();
  const writeStream = fs.createWriteStream(savePath);

  download.pipe(writeStream);

  download.on('end', () => {
    console.log("File downloaded successfully to:", savePath);
  });
}

function listItems() {
  console.log("Listing files and folders in storage:");
  storage.root.children.forEach(item => {
    const itemType = item.directory ? 'Folder' : 'File';
    console.log(item.name, '-', itemType, '-', item.size || 'N/A', 'bytes');
  });
}

function deleteItem(itemName) {
  if (!itemName) {
    console.error("Please provide a file or folder name to delete.");
    return;
  }

  const item = storage.root.children.find(f => f.name === itemName);
  if (item) {
    item.delete((err) => {
      if (err) console.error("Error deleting item:", err);
      else console.log("Item deleted successfully:", itemName);
    });
  } else {
    console.log("Item not found:", itemName);
  }
}

// Custom Retry Mechanism for Sharing Folder with Graceful Error Handling
function shareItemWithExternalRetry(itemName, retries = 15, initialDelay = 1000) {
  const item = storage.root.children.find(f => f.name === itemName);
  
  if (!item) {
    console.log("Item not found:", itemName);
    return;
  }

  if (item.directory) {
    console.log("Detected as a folder. Attempting to share it as a folder.");

    const attemptFolderSharing = (retryCount, delay) => {
      item.shareFolder((err, folderLink) => {
        if (err) {
          if (err.message.includes("EAGAIN") && retryCount > 0) {
            console.log(`Retrying folder share due to server congestion... (Attempt ${retries - retryCount + 1} of ${retries})`);
            setTimeout(() => attemptFolderSharing(retryCount - 1, delay * 1.5), delay);
          } else {
            console.error("Error sharing folder after multiple attempts:", err);
          }
        } else {
          console.log("Public link for folder", itemName, ":", folderLink);
        }
      });
    };

    attemptFolderSharing(retries, initialDelay);

  } else {
    // For files, we use the standard link creation method
    shareFileDirectly(item, retries, initialDelay);
  }
}

function shareFileDirectly(item, retries, initialDelay) {
  const attemptLinkCreation = (retryCount) => {
    item.link((err, link) => {
      if (err) {
        if (err.message.includes("EAGAIN") && retryCount > 0) {
          console.log(`Retrying file share due to server congestion... (Attempt ${retries - retryCount + 1} of ${retries})`);
          setTimeout(() => attemptLinkCreation(retryCount - 1), initialDelay);
          initialDelay *= 1.5; // Exponential backoff
        } else {
          console.error("Error creating link after multiple attempts:", err);
        }
      } else {
        console.log("Public link for", item.name, ":", link);
      }
    });
  };

  attemptLinkCreation(retries);
}
