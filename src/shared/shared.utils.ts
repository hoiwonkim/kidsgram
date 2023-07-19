// ./src/shared/shared.utils.ts
import AWS from "aws-sdk";
import { ReadStream } from "fs";
import { AvatarFile } from "./shared.interfaces";

const s3: AWS.S3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const handleUploadFileToS3 = async (uploadedFile: any, foldername: string, username: string): Promise<string> => {
  try {
    const { filename, createReadStream }: AvatarFile = uploadedFile.file;
    const newFilename: string = `${Date.now()}-${filename}`;
    const readStream: ReadStream = createReadStream();
    const { Location }: AWS.S3.ManagedUpload.SendData = await s3
      .upload({
        Bucket: "kidsgram",
        Key: `${foldername}/${username}/${newFilename}`,
        Body: readStream,
        // ACL: "public-read",
      })
      .promise();
    return Location;
  } catch (error) {
    console.log("handleUploadFileToS3 error", error);
    return "";
  }
};

export const handleDeleteFileFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    const decodedFileUrl: string = decodeURI(fileUrl);
    const fileKey: string = decodedFileUrl.split("s3.amazonaws.com/")[1];
    await s3
      .deleteObject({
        Bucket: "kidsgram",
        Key: fileKey,
      })
      .promise();
  } catch (error) {
    console.log("handleDeleteFileFromS3 error");
  }
};




// ./src/shared/shared.utils.ts
// import { ReadStream } from "fs";
// import { AvatarFile } from "./shared.interfaces";
// import * as admin from "firebase-admin";

// // Firebase Admin SDK 초기화
// const firebaseApp = admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY,
//   }),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// });

// // Firebase Storage 인스턴스 생성
// const storage = firebaseApp.storage();

// export const handleUploadFileToS3 = async (
//   uploadedFile: any,
//   foldername: string,
//   username: string
// ): Promise<string> => {
//   try {
//     const { filename, createReadStream }: AvatarFile = uploadedFile.file;
//     const newFilename: string = `${Date.now()}-${filename}`;
//     const readStream: ReadStream = createReadStream();

//     const bucket = storage.bucket();
//     const file = bucket.file(`${foldername}/${username}/${newFilename}`);
//     const writeStream = file.createWriteStream({
//       contentType: "application/octet-stream",
//       public: true, // 파일을 공개로 설정하려면 true로 설정합니다.
//     });

//     readStream.pipe(writeStream);

//     return new Promise<string>((resolve, reject) => {
//       writeStream.on("finish", () => {
//         const fileUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
//         resolve(fileUrl);
//       });

//       writeStream.on("error", (error) => {
//         console.log("handleUploadFileToS3 error", error);
//         reject(error);
//       });
//     });
//   } catch (error) {
//     console.log("handleUploadFileToS3 error", error);
//     return "";
//   }
// };

// export const handleDeleteFileFromS3 = async (fileUrl: string): Promise<void> => {
//   try {
//     const bucket = storage.bucket();
//     const fileName = fileUrl.split(`${bucket.name}/`)[1];

//     await bucket.file(fileName).delete();
//   } catch (error) {
//     console.log("handleDeleteFileFromS3 error", error);
//   }
// };


