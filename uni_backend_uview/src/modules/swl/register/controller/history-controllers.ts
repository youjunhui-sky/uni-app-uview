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
import { FindBySwlNoDto } from '../dto/swl-common.dto';
import {
  SwlCurrentHistoryService,
  SwlPastMedicalHistoryService,
  SwlFamilyHistoryService,
  SwlPastStoneHistoryService,
  SwlPersonalHistoryService,
  SwlMenstrualMarriageHistoryService,
  SwlVitalSignsService,
  SwlLabResultDetailService,
  SwlDiagnosisService,
} from '../service/history-services';

/** 通用 CRUD 控制器工厂 */
function makeController(
  prefix: string,
  service: any,
) {
  @Controller(`app/swl/${prefix}`)
  @UseGuards(JwtAuthGuard)
  class GenericController {
    constructor() {}
    private get svc() { return service; }
    @Post('findBySwlNo')
    async findBySwlNo(@Body() dto: FindBySwlNoDto) {
      return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
    }
    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
      return this.svc.findById(id);
    }
  }
  return GenericController;
}

// 由于 NestJS 需要具体类，我们手写每个 controller（保持简洁）
@Controller('app/swl/currentHistory')
@UseGuards(JwtAuthGuard)
export class SwlCurrentHistoryController {
  constructor(private readonly svc: SwlCurrentHistoryService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/pastMedicalHistory')
@UseGuards(JwtAuthGuard)
export class SwlPastMedicalHistoryController {
  constructor(private readonly svc: SwlPastMedicalHistoryService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/familyHistory')
@UseGuards(JwtAuthGuard)
export class SwlFamilyHistoryController {
  constructor(private readonly svc: SwlFamilyHistoryService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/pastStoneHistory')
@UseGuards(JwtAuthGuard)
export class SwlPastStoneHistoryController {
  constructor(private readonly svc: SwlPastStoneHistoryService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/personalHistory')
@UseGuards(JwtAuthGuard)
export class SwlPersonalHistoryController {
  constructor(private readonly svc: SwlPersonalHistoryService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/menstrualMarriageHistory')
@UseGuards(JwtAuthGuard)
export class SwlMenstrualMarriageHistoryController {
  constructor(private readonly svc: SwlMenstrualMarriageHistoryService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/vitalSigns')
@UseGuards(JwtAuthGuard)
export class SwlVitalSignsController {
  constructor(private readonly svc: SwlVitalSignsService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/labResult')
@UseGuards(JwtAuthGuard)
export class SwlLabResultDetailController {
  constructor(private readonly svc: SwlLabResultDetailService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}

@Controller('app/swl/diagnosis')
@UseGuards(JwtAuthGuard)
export class SwlDiagnosisController {
  constructor(private readonly svc: SwlDiagnosisService) {}
  @Post('findBySwlNo') findBySwlNo(@Body() dto: FindBySwlNoDto) {
    return this.svc.findBySwlNo(dto.swlNo, dto.serialNumber);
  }
  @Get(':id') findById(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }
}
