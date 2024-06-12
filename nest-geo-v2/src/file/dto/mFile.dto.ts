export class MFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: MFile | Express.Multer.File) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
