import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { SwlTreatmentService } from '../service/swl-treatment.service';
import { FindBySwlNoDto } from '../dto/swl-common.dto';

/**
 * SWL 治疗记录接口（移动端）
 * 路由前缀：/app/swl/treatment
 */
@Controller('app/swl/treatment')
@UseGuards(JwtAuthGuard)
export class SwlTreatmentController {
  constructor(private readonly service: SwlTreatmentService) {}

  /**
   * 根据碎石号查询治疗记录列表
   * POST /app/swl/treatment/findBySwlNo
   */
  @Post('findBySwlNo')
  async findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.service.findBySwlNo({
      swlNo: dto.swlNo,
      serialNumber: dto.serialNumber,
      episode: dto.episode ? Number(dto.episode) : undefined,
    });
  }

  /**
   * 根据主键查询治疗记录详情
   * GET /app/swl/treatment/:id
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
