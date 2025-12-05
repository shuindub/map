// services/driveService.ts

// IMPORTANT: YOU MUST REPLACE THIS WITH YOUR OWN CLIENT ID FROM GOOGLE CLOUD CONSOLE
// SCOPES REQUIRED: 'https://www.googleapis.com/auth/drive.file'
export const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com'; 
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

declare const google: any;

let tokenClient: any;
let accessToken: string | null = null;

// Initialize the Google Identity Services Client
export const initTokenClient = (callback: (response: any) => void) => {
  if (typeof google !== 'undefined' && google.accounts) {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse: any) => {
        accessToken = tokenResponse.access_token;
        callback(tokenResponse);
      },
    });
  }
};

export const requestAccessToken = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken();
  } else {
    console.error("Token client not initialized");
  }
};

export const isAuthorized = () => !!accessToken;

// --- Drive API Helpers ---

const getHeaders = () => {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

// Find a folder by name within a parent folder (or root)
export const findFolder = async (name: string, parentId: string = 'root'): Promise<string | null> => {
  if (!accessToken) return null;
  
  const q = `mimeType='application/vnd.google-apps.folder' and name='${name}' and '${parentId}' in parents and trashed=false`;
  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)`, {
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (e) {
    console.error("Error finding folder:", e);
    return null;
  }
};

// Create a new folder
export const createFolder = async (name: string, parentId: string = 'root'): Promise<string | null> => {
  if (!accessToken) return null;

  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId]
  };

  try {
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(metadata)
    });
    const data = await response.json();
    return data.id;
  } catch (e) {
    console.error("Error creating folder:", e);
    return null;
  }
};

// Create (Upload) a JSON file
export const createJsonFile = async (name: string, parentId: string, content: object): Promise<string | null> => {
  if (!accessToken) return null;

  const metadata = {
    name,
    mimeType: 'application/json',
    parents: [parentId]
  };

  const fileContent = JSON.stringify(content, null, 2);
  
  // Multipart upload is cleaner for Drive, but for small JSON simple upload is okay if we do it right.
  // However, the v3 API for creating file with content requires multipart/related.
  
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileContent], { type: 'application/json' }));

  try {
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: form
    });
    const data = await response.json();
    return data.id;
  } catch (e) {
    console.error("Error creating file:", e);
    return null;
  }
};

// List files in a folder (sorted by name to get sequence)
export const listFiles = async (folderId: string): Promise<any[]> => {
  if (!accessToken) return [];
  
  const q = `'${folderId}' in parents and trashed=false`;
  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&orderBy=name desc&fields=files(id,name,createdTime)`, {
      headers: getHeaders()
    });
    const data = await response.json();
    return data.files || [];
  } catch (e) {
    console.error("Error listing files:", e);
    return [];
  }
};

// Get file content
export const getFileContent = async (fileId: string): Promise<any> => {
  if (!accessToken) return null;

  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: getHeaders()
    });
    return await response.json();
  } catch (e) {
    console.error("Error reading file:", e);
    return null;
  }
};