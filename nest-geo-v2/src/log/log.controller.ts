import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Roles } from '@/decorators/role.decorator';
import { UserRole } from '@/enum/userRole.enum';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryLogDto } from './dto/queryLog.dto';

@ApiTags('log')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiOperation({ summary: 'get all logs' })
  @ApiCookieAuth('access_token')
  @UseGuards(RolesGuard)
  @Roles([UserRole.Admin])
  @UseGuards(JwtAuthGuard)
  @Get()
  async getLogs(@Query() queryLogDto: QueryLogDto) {
    return await this.logService.getLogs(queryLogDto);
  }
}
