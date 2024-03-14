import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

const createPresignedUrlWithClient = ({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) => {
  const credential = readJsonFile();

  const client = new S3Client({
    region: credential.region,
    credentials: {
      accessKeyId: credential.accessKey,
      secretAccessKey: credential.secretKey,
    },
  });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

const upload = async (url: string, data: any) => {
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Length': new Blob([data]).size + '' },
    body: data,
  });
};

export const main = async () => {
  const isoString = new Date().toISOString();

  const BUCKET = 'playground12';

  const KEY = `example-${isoString}.txt`;

  try {
    const clientUrl = await createPresignedUrlWithClient({
      bucket: BUCKET,
      key: KEY,
    });

    console.log('Calling PUT using presigned URL with client');
    await upload(clientUrl, 'Hello World');

    console.log('\nDone. Check your S3 console.');
  } catch (err) {
    console.error(err);
  }
};

main();
