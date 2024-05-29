import { Controller, Get, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthGuard, AdminRouteGuard } from 'src/auth';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('export-data/sql')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminRouteGuard)
  public async exportDatabaseSQL(): Promise<StreamableFile> {
    const fileName = await this.adminService.exportDatabaseSQL();
    const file = createReadStream(join(process.cwd(), fileName));
    return new StreamableFile(file);
  }
}
