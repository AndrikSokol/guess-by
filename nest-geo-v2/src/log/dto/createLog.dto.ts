export enum levelLog {
  Error = 'error',
  Log = 'log',
}

export class CreateLogDto {
  message: string;
  context: string;
  level: levelLog;
}
