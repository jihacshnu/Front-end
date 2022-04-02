/* eslint-disable no-await-in-loop */
import { Storage } from 'aws-amplify';
import { v4 as uuid } from 'uuid';
import config from '../aws-exports';

const { aws_user_files_s3_bucket_region: region, aws_user_files_s3_bucket: bucket } = config;

export const fileUpload = async (files: any, path = '/common', compressedFile?: any) => {
  try {
    const urls = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const { type: mimeType } = file;
      const type = mimeType.split('/').shift();
      const extension = mimeType.split('/').pop();
      const key = `media${path}/${type}-${uuid()}${+new Date()}.${extension}`;
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
      if (compressedFile) {
        file = await compressedFile(file);
      }
      await Storage.put(key, file, {
        contentType: mimeType,
      });
      urls.push(url);
    }
    return urls;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('file upload error', error.message);
    throw error;
  }
};
