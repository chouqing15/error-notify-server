import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/pageLog')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getErrLog')
  async getPageErrorLog(@Query() params) {
    return {
      code: 0,
      data: params,
      msg: '暂时不做查询功能',
    };
    // 暂时不实现获取错误日志功能
    // return await this.appService.getErrorLog(params);
  }

  @Post('/saveErrLog')
  async insetPageErrorLogToFile(@Body() body) {
    return await this.appService.saveErrorLog(body);
  }
}
