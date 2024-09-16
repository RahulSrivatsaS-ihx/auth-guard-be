import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserCreationService } from './userCreation.service';
import { CreateUserDto } from './create-user.dto';

@Controller('userCreation')
export class UserCreationController {
  constructor(private readonly userCreationService: UserCreationService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      const message = await this.userCreationService.createUser(createUserDto);
      return { message };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
