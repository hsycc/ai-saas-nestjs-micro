/*
 * @Author: hsycc
 * @Date: 2023-05-24 17:48:48
 * @LastEditTime: 2023-05-30 06:06:10
 * @Description:
 *
 */

import { Readable, Stream, Writable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import { path } from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(path);

export class FfmpegUtils {
  public static reduceBitrate(
    inputStream: Stream,
    audioBitrate = 64,
    audioType = 'mp3',
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const outputChunks = [];

      ffmpeg(inputStream)
        .audioBitrate(audioBitrate) // low quality. You can update that
        .on('error', reject)
        .on('end', () => resolve(Buffer.concat(outputChunks)))
        .format(audioType)
        .pipe(
          new Writable({
            write(chunk, encoding, callback) {
              outputChunks.push(chunk);
              callback();
            },
          }),
        );
    });
  }

  public static bufferToReadableStream(
    buffer: Buffer,
    filename = 'audio.mp3',
  ): Stream {
    const readable = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    readable.path = filename;
    return readable;
  }

  public static arrayBufferToStream(buffer: ArrayBuffer): Stream {
    const readable = new Readable({
      read() {
        this.push(Buffer.from(buffer));
        this.push(null);
      },
    });
    return readable;
  }
}
