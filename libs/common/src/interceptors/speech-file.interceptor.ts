/*
 * @Author: hsycc
 * @Date: 2023-05-24 20:44:06
 * @LastEditTime: 2023-05-24 22:06:22
 * @Description:
 *
 */

import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

export const SpeechFileInterceptor = (filename = 'file') => {
  return FileInterceptor(filename, {
    // storage save
    // storage: diskStorage({
    //   destination: './uploads', // save dir
    //   filename: (req, file, callback) => {
    //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //     callback(null, file.fieldname + '-' + uniqueSuffix);
    //   },
    // }),
    fileFilter: (req, file, callback) => {
      // 定义允许上传的文件类型
      const allowedFileTypes = [
        '.mp3',
        '.mp4',
        '.mpeg',
        '.mpga',
        '.m4a',
        '.wav',
        '.webm',
      ];

      // check allow
      if (
        allowedFileTypes.some(
          (ext) => extname(file.originalname).toLowerCase() === ext,
        )
      ) {
        callback(null, true); // resolve
      } else {
        callback(
          new BadRequestException(
            'the following input file types are supported: mp3, mp4, mpeg, mpga, m4a, wav, and webm.',
          ),
          false,
        ); // reject
      }
    },
    limits: {
      fileSize: 25 * 1024 * 1024, // limit file size 25MB
    },
  });
};
