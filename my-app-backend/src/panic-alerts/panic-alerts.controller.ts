import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { PanicAlertsService } from './panic-alerts.service';
import { AlertStatus } from '@prisma/client'; // Import Prisma's enum/union for typing
// Assuming you have other imports like CreatePanicAlertDto, etc.

// Define/update the DTO for updating status
export class UpdateAlertStatusDto {
  status: AlertStatus; // Enforces 'active' | 'resolved' | 'false-alarm' at compile time
}

// ... other DTOs like CreatePanicAlertDto ...

@Controller('panic-alerts')
export class PanicAlertsController {
  constructor(private readonly panicAlertsService: PanicAlertsService) {}

  // ... other methods like @Post(), @Get(), etc. ...

  // The method with the error (around line 51)
  @Put(':id/status')
  async updateAlertStatus(
    @Param('id') id: string,
    @Body() data: UpdateAlertStatusDto, // Now uses typed DTO
  ) {
    // Optional: Manual check if needed, but typing handles most cases
    return this.panicAlertsService.updateAlertStatus(id, data.status); // Types now match: string -> AlertStatus
  }

  // ... rest of your controller methods ...
}