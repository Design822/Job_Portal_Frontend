import multer from "multer";
import path from "path";

const maxSize = 20 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req: any, res: any, cd: any) => {
    cd(null, "public");
  },
  filename: (req: any, file: any, cd: any) => {
    const ext = path.extname(file.originalname.toLowerCase());
    cd(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});

export default upload;
