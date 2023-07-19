import { Injectable } from '@nestjs/common';
import { promises, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

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
        data: error.message,
      };
    }
  }

  checkAndCreateDirectory() {
    !existsSync(savePath) && mkdirSync(savePath);
  }

  async saveErrorLog(body) {
    try {
      const { systemName, ...content } = body;
      this.checkAndCreateDirectory();
      await promises.writeFile(
        join(savePath, `${systemName}${fileExt}`),
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
