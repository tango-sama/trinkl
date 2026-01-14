---
description: Deploy Firebase Storage Rules and Hosting
---

## Prerequisites
1. Ensure the installation of firebase-tools finishes (it is running in the background).

## Deployment Steps

1. **Login to Firebase**
   Run the following command and follow the instructions in the browser to log in.
   ```powershell
   firebase login
   ```

2. **Deploy Storage Rules**
   This will upload the `storage.rules` file to your Firebase project, ensuring your app can read/write images.
   ```powershell
   firebase deploy --only storage
   ```

3. **(Optional) Deploy Website**
   If you want to host your website on Firebase Hosting:
   ```powershell
   firebase deploy --only hosting
   ```
