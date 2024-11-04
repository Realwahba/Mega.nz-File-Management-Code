__📂 MEGA-CLI: Command-Line File Manager for MEGA.nz__ 
Welcome to MEGA-CLI! This powerful and intuitive command-line tool lets you effortlessly manage your MEGA.nz cloud storage without leaving your terminal. Upload, download, list, delete, and share files like a pro – all with simple commands! 🚀

🌟 Features
- Instant Uploads: Upload any file from your system directly to MEGA with just one command.
- Effortless Downloads: Quickly retrieve files from your MEGA storage to any specified local path.
- Detailed Listing: Get a complete list of your stored files and folders with details on size and type.
- One-Command Deletion: Remove unwanted files or folders from MEGA securely.
- Share Links with Retry Support: Generate public links for files and folders with robust retry mechanisms to handle MEGA server congestion.

__📜 Prerequisites__
Before you dive in, make sure you have:

Node.js (>= 12.x) – [Download here.](https://nodejs.org/en)
A MEGA.nz Account – [Sign up here.](https://mega.nz/)

__🚀 Installation__
1. Clone this repository:
```git clone https://github.com/yourusername/mega-cli.git cd mega-cli ```
2. Install dependencies:
```npm install```
3Add your MEGA account credentials:
Open the script and replace email and password placeholders with your MEGA account email and password.
__🧩 Usage__
The following commands are available to perform various MEGA storage operations:
| Command                       | Description                                          |
|-------------------------------|------------------------------------------------------|
| `upload <filePath>`           | Uploads a file to MEGA                               |
| `download <fileLink> <savePath>` | Downloads a file from MEGA                        |
| `list`                        | Lists all files and folders                          |
| `delete <itemName>`           | Deletes a file or folder from MEGA by name           |
| `share <itemName>`            | Generates a public link for a file or folder         |
__🎬 Examples__
1. Uploading a File
```node index.js upload /path/to/yourfile.jpg```
Uploads yourfile.jpg to MEGA and returns a link upon success.

2. Downloading a File
```node index.js download https://mega.nz/filelink /path/to/save/location```
Downloads the specified MEGA file to your local path.

3. Listing Files and Folders
```node index.js list```
Displays a complete list of all items in your MEGA account storage.

4. Deleting a File or Folder
```node index.js delete filename.jpg```
Deletes filename.jpg from your MEGA storage.

5. Sharing a Folder or File
```node index.js share myFolder```
Generates a shareable link for myFolder.

__🛠️ Advanced Sharing: Retry Mechanism__
Encountering server congestion when trying to share files or folders? MEGA-CLI uses a built-in retry mechanism with exponential backoff to overcome temporary issues.

- Custom Retry Parameters:
  - Retries: The number of times to attempt the share command.
  - Initial Delay: The starting delay in milliseconds before retrying, which doubles on each subsequent attempt.
This mechanism ensures robust and resilient link creation under heavy load conditions.
__📝 Error Handling__
MEGA-CLI provides meaningful error messages and guides you through issues like missing files, network errors, and MEGA-specific errors. If an error occurs, the tool lets you know exactly what went wrong and suggests a fix.
