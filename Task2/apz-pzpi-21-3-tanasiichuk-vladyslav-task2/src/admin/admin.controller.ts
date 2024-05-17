import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthGuard, AdminRouteGuard } from 'src/auth';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('export-data/sql')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminRouteGuard)
  public async exportDatabaseSQL() {
    return this.adminService.exportDatabaseSQL();
  }
}
