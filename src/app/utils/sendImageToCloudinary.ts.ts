import { v2 as cloudinary } from "cloudinary";
import config from "../config/config";
import multer from "multer";
import fs from "fs";

export const sendImageToCloudinary = async (path: string, name: string) => {
  cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.cloud_api_key,
    api_secret: config.cloud_api_secret,
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: name,
      },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
            return;
          }
          console.log("File deleted successfully!");
        });
      }
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("malter", console.log(file));
    cb(null, process.cwd() + "/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
