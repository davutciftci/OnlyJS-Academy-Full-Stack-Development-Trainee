import multer from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        let dest = "uploads/";
        
        if (file.fieldname === 'photo' || file.fieldname === 'photos') {
             dest = "uploads/products/";
        } else if (file.fieldname === 'avatar') {
             dest = "uploads/users/";
        } else {
             dest = "uploads/products/"; 
        }

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        cb(null, dest);
    },

    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);


        const sanitizedName = nameWithoutExt
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '')
            .toLowerCase();

        const filename = `${sanitizedName}-${uniqueSuffix}${ext}`;
        cb(null, filename);
    },

});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Sadece resim dosyaları yüklenebilir (jpg, jpeg, png, gif, webp)"));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});