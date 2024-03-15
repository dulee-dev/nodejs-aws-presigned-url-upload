import { createPresignedUrlWithClient, upload } from './libs';
import { s3Client } from './s3-client';

export const main = async () => {
  const BUCKET = 'playground12';
  const KEY = `example-${new Date().toISOString()}.txt`;

  try {
    const clientUrl = await createPresignedUrlWithClient({
      s3Client,
      bucket: BUCKET,
      key: KEY,
      expiresIn: 3600,
    });

    console.log('Calling PUT using presigned URL with client');
    await upload(clientUrl, 'Hello World');

    console.log('\nDone. Check your S3 console.');
  } catch (err) {
    console.error(err);
  }
};

main();
