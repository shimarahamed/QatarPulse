import type { FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export async function uploadBusinessImage(
  app: FirebaseApp,
  businessId: string,
  file: File
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded.');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Images must be smaller than 5MB.');
  }
  const storage = getStorage(app);
  const path = `businesses/${businessId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteBusinessImage(app: FirebaseApp, url: string): Promise<void> {
  const storage = getStorage(app);
  const fileRef = ref(storage, url);
  await deleteObject(fileRef);
}
