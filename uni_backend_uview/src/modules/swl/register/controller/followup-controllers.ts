import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { FindBySwlNoDto } from '../dto/swl-common.dto';
import { SwlNearFollowupService, SwlFutureFollowupService, SwlCurativeService } from '../service/followup-services';

@Controller('app/swl/nearFollowup')
@UseGuards(JwtAuthGuard)
export class SwlNearFollowupController {
  constructor(private readonly svc: SwlNearFollowupService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/futureFollowup')
@UseGuards(JwtAuthGuard)
export class SwlFutureFollowupController {
  constructor(private readonly svc: SwlFutureFollowupService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/curative')
@UseGuards(JwtAuthGuard)
export class SwlCurativeController {
  constructor(private readonly svc: SwlCurativeService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}
