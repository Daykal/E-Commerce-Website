import {S3Client} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();


const s3Client = new S3Client({
  region: "eu-north", // MinIO requires some region name; arbitrary is fine
  endpoint: `http${process.env.MINIO_USE_SSL === "true" ? "s" : ""}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY
  },
  forcePathStyle: true // required for MinIO
});

export default s3Client;