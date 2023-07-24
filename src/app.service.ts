import { Injectable } from '@nestjs/common';
import { promises, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import * as dayjs from 'dayjs';

const fileExt = '.txt';
const savePath = join(__dirname, '..', 'errorLog');
const pageSize = 10000;

@Injectable()
export class AppService {
  // 暂不使用
  async getErrorLog({ systemName, page = 1 }) {
    try {
      const content = await promises.readFile(
        join(savePath, `${systemName}${fileExt}`),
        'utf8',
      );

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageContent = content.slice(start, end);

      return {
        code: 0,
        data: pageContent.split('\n\n').filter(Boolean),
      };
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
      };
    }
  }

  checkAndCreateDirectory(path: string) {
    try {
      !existsSync(path) && mkdirSync(path, { recursive: true });
      return false;
    } catch (error) {
      return error;
    }
  }

  async saveErrorLog(body) {
    try {
      const { systemName, ...content } = body;

      if (!systemName) {
        return {
          code: 0,
          msg: '系统出错',
        };
      }

      const targetDir = join(
        savePath,
        systemName,
        dayjs().format('YYYY-MM-DD'),
      );

      const err = this.checkAndCreateDirectory(targetDir);
      if (err) {
        return {
          code: 500,
          msg: err.message,
        };
      }
      await promises.writeFile(
        join(targetDir, `${dayjs().format('YYYY-MM-DD-HH')}${fileExt}`),
        `${JSON.stringify(content)}\n\n`,
        {
          flag: 'a',
        },
      );
      return { code: 0, data: null, msg: '成功' };
    } catch (error) {
      return {
        code: 500,
        msg: error.message,
      };
    }
  }
}
