import { path as appPath } from 'app-root-path';
import { pathExists } from 'fs-extra';
import * as path from 'path';

export const isExistsFile = async (filename: string): Promise<boolean> => {
  if (filename === undefined || filename === null) {
    return true;
  }

  const filePath = path.join(appPath, 'uploads', filename);

  return await pathExists(filePath);
};
