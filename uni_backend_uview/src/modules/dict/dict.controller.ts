import { Controller, Post, Body } from '@nestjs/common';
import { DictService } from './dict.service';

@Controller('app/dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  /**
   * 获取字典类型列表
   * POST /app/dict/info/types
   */
  @Post('info/types')
  async getTypes() {
    return this.dictService.getTypes();
  }

  /**
   * 获取字典数据
   * POST /app/dict/info/data
   */
  @Post('info/data')
  async getData(@Body() body: { types: string[] }) {
    return this.dictService.getData(body.types);
  }
}
