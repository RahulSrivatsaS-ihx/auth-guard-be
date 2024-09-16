import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { PayerAdditionService } from "./payerAddition.service";

@Controller('payerAddition')
export class PayerAdditionController {
  constructor(private readonly payerAdditionService: PayerAdditionService) {}

  @Post()
  async payerAddition(@Body() body: {
    isBulkUpload: boolean;
    supremeId: string;
    isPayerAddition: boolean;
    selectedPayers: Record<string, string>;
  }): Promise<{ messages: string[] }> {
    if (!body.supremeId || !body.selectedPayers) {
      throw new BadRequestException('supremeId and selectedPayers are required');
    }

    try {
      const messages = await this.payerAdditionService.updatePayers(body);
      return { messages };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
