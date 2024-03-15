import { S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const readJsonFile = () => {
  const pathToAwsCredential = path.join(
    __dirname,
    '../secret/aws-credential.json'
  );
  const jsonFile = fs.readFileSync(pathToAwsCredential, 'utf8');
  const jsonData = JSON.parse(jsonFile) as {
    accessKey: string;
    secretKey: string;
    region: string;
  };
  return jsonData;
};

const credential = readJsonFile();

export const s3Client = new S3Client({
  region: credential.region,
  credentials: {
    accessKeyId: credential.accessKey,
    secretAccessKey: credential.secretKey,
  },
});
