import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeviceService } from './devices.service';

@ApiTags('device')
@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Post()
  async createDevice(@Body() { animalId }: { animalId: number }) {
    const res = await this.deviceService.createDevice(animalId);
    return res;
  }

  @Put(':id')
  @ApiBearerAuth()
  async editDevice(
    @Param('id', ParseIntPipe) id: number,
    @Body() { animalId }: { animalId: number },
  ) {
    return await this.deviceService.editDevice(id, animalId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async deleteDevice(@Param('id', ParseIntPipe) id: number) {
    return await this.deviceService.deleteDevice(id);
  }
}
