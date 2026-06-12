import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { FindBySwlNoDto } from '../dto/swl-common.dto';
import { SwlStoneComponentService } from '../service/composition-services';

@Controller('app/swl/stoneComponent')
@UseGuards(JwtAuthGuard)
export class SwlStoneComponentController {
  constructor(private readonly svc: SwlStoneComponentService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}
