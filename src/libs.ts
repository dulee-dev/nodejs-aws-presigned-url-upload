import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const createPresignedUrlWithClient = ({
  s3Client,
  bucket,
  key,
  expiresIn,
}: {
  s3Client: S3Client;
  bucket: string;
  key: string;
  expiresIn: number;
}) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn });
};

export const upload = async (url: string, data: any) => {
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Length': new Blob([data]).size + '' },
    body: data,
  });
};
