
// ============================================
// 2. trusted-contacts.controller.ts (FIXED)
// ============================================
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TrustedContactsService } from './trusted-contacts.service';
import { CreateTrustedContactDto } from './dto/create-trusted-contact.dto';
import { UpdateTrustedContactDto } from './dto/update-trusted-contact.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trusted-contacts')
// @UseGuards(JwtAuthGuard)
export class TrustedContactsController {
  constructor(private service: TrustedContactsService) {}

  @Get()
  async getAll(@Request() req) {
    const userId = req.user?.id || 'temp-user-id';
    return this.service.findAll(userId);
  }

  @Post()
  async create(
    @Request() req,
    @Body() body: CreateTrustedContactDto,
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.service.create(userId, body);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      phone?: string;
      email?: string;
      priority?: number;
      isActive?: boolean;
    },
  ) {
    const userId = req.user?.id || 'temp-user-id';
    return this.service.update(id, userId, body);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 'temp-user-id';
    return this.service.delete(id, userId);
  }
}
