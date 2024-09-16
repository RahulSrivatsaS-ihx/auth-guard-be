import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserCreationService } from './userCreation.service';
import { CreateUserDto } from './create-user.dto';

@Controller('userCreation')
export class UserCreationController {
  constructor(private readonly userCreationService: UserCreationService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      const { userData } = createUserDto;
      const message = await this.userCreationService.createUser(userData);
      return { message };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
