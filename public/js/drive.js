const GOOGLE_CLIENT_ID = "712077553599-a4h1h9egeimrg2i47sn5usps7n3ek3es.apps.googleusercontent.com";
const GOOGLE_API_SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

export async function initGoogleDriveClient(googleAccessToken) {
    if (!googleAccessToken) {
        console.error("Google Access Token is not available. Cannot initialize gapi.client.");
        return;
    }

    await gapi.load('client', async () => {
        await gapi.client.init({
            clientId: GOOGLE_CLIENT_ID,
            scope: GOOGLE_API_SCOPES.join(' '),
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        });

        gapi.client.setToken({
            access_token: googleAccessToken
        });

        console.log("Google API client initialized and authenticated with Drive API.");
    });
}

export async function uploadFileToDrive(file, fileName, mimeType) {
    if (!gapi.client.drive) {
        throw new Error("Google Drive API not initialized.");
    }

    const fileMetadata = {
        'name': fileName,
        'mimeType': mimeType
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    form.append('file', file);

    try {
        const response = await gapi.client.request({
            path: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            method: 'POST',
            body: form,
            headers: {
                'Content-Type': 'multipart/related'
            }
        });
        return response.result;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

export async function getDriveFileLink(fileId) {
    if (!gapi.client.drive) {
        throw new Error("Google Drive API not initialized.");
    }
    try {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        });
        return response.result;
    } catch (error) {
        console.error("Error getting file link:", error);
        throw error;
    }
}

export async function downloadFileFromDrive(fileId) {
    if (!gapi.client.drive) {
        throw new Error("Google Drive API not initialized.");
    }
    try {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });
        return response.body;
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
}