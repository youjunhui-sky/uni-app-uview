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
import { SwlImagingExamService } from '../service/swl-imaging-exam.service';
import { FindBySwlNoDto } from '../dto/swl-common.dto';

/**
 * SWL 影像检查接口（移动端）
 * 路由前缀：/app/swl/imaging
 */
@Controller('app/swl/imaging')
@UseGuards(JwtAuthGuard)
export class SwlImagingExamController {
  constructor(private readonly service: SwlImagingExamService) {}

  /**
   * POST /app/swl/imaging/findBySwlNo
   */
  @Post('findBySwlNo')
  async findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.service.findBySwlNo({
      swlNo: dto.swlNo,
      serialNumber: dto.serialNumber,
    });
  }

  /**
   * GET /app/swl/imaging/:id
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
