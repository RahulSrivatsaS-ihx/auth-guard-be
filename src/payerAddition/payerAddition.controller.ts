import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { PayerAdditionService } from "./payerAddition.service";
import { validate } from "class-validator";
import { PayerDTO } from "./payerAddition.dto";

@Controller('payerAddition')
export class PayerAdditionController {
  constructor(private readonly payerAdditionService: PayerAdditionService) {}

  @Post()
  async payerAddition(@Body() body: PayerDTO): Promise<{ messages: string[] }> {
    // Validate the body
    const validationErrors = await validate(body);
    if (validationErrors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    try {
      // Call the service to process the payer addition
      const messages = await this.payerAdditionService.updatePayers(body);
      return { messages };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
