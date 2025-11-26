
import { DriveFile } from '../types';

// Mock Data for the "Demo" Folder
const DEMO_IMAGES: DriveFile[] = [
    { id: '1', name: 'Wedding_Couple_Portrait.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9820?auto=format&fit=crop&w=600&q=80', webViewLink: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9820?auto=format&fit=crop&w=1920&q=80' },
    { id: '2', name: 'Bride_Preparation.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80', webViewLink: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=80' },
    { id: '3', name: 'Ring_Detail_Shot.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80', webViewLink: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1920&q=80' },
    { id: '4', name: 'Ceremony_Decor.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=600&q=80', webViewLink: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=1920&q=80' },
    { id: '5', name: 'Wedding_Party_Fun.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', webViewLink: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80' },
    { id: '6', name: 'Reception_Cake.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=600&q=80', webViewLink: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=1920&q=80' },
    { id: '7', name: 'Groom_Getting_Ready.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', webViewLink: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1920&q=80' },
    { id: '8', name: 'Dance_Floor.jpg', mimeType: 'image/jpeg', thumbnailLink: 'https://images.unsplash.com/photo-1545167622-3a6ac156f422?auto=format&fit=crop&w=600&q=80', webViewLink: 'https://images.unsplash.com/photo-1545167622-3a6ac156f422?auto=format&fit=crop&w=1920&q=80' },
];

export const connectToGoogleDrive = async (): Promise<boolean> => {
    // SIMULATION: Authenticate with Google
    console.log("Connecting to Google Drive API...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
};

export const getDemoFolderImages = async (): Promise<DriveFile[]> => {
    console.log("Searching for folder: 'Demo'...");
    
    // SIMULATION: API Call to list files in specific folder
    // Query: "mimeType = 'image/jpeg' and name contains 'Demo'"
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Folder 'Demo' found. Retrieving files...");
    
    return DEMO_IMAGES;
};

/**
 * REAL IMPLEMENTATION SNIPPET (For reference):
 * 
 * async function listFiles() {
 *   // 1. Find the 'Demo' folder ID
 *   const folderResponse = await gapi.client.drive.files.list({
 *     q: "mimeType = 'application/vnd.google-apps.folder' and name = 'Demo' and trashed = false",
 *     fields: 'files(id, name)'
 *   });
 *   
 *   const folderId = folderResponse.result.files[0]?.id;
 *   if (!folderId) return [];
 * 
 *   // 2. List images inside that folder
 *   const response = await gapi.client.drive.files.list({
 *     q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
 *     fields: 'files(id, name, thumbnailLink, webViewLink, mimeType)'
 *   });
 *   
 *   return response.result.files;
 * }
 */
