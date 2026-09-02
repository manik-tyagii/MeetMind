declare module 'multer-storage-cloudinary' {
  import { Request } from 'express';
  import { File, StorageEngine } from 'multer';

  export class CloudinaryStorage implements StorageEngine {
    constructor(options?: any);
    _handleFile(req: Request, file: File, cb: (error?: any, info?: any) => void): void;
    _removeFile(req: Request, file: File, cb: (error: Error | null) => void): void;
  }
  export interface CloudinaryStorageOptions {
    cloudinary?: any;
    params?: any;
  }
  export default CloudinaryStorage;
}
