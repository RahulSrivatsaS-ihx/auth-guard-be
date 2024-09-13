import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly authUrl = 'http://stg-auth.ihx.in/SignIn/Password';
  private readonly headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json-patch+json',
  };

  constructor(private jwtService: JwtService) {}

  private async authenticateWithExternalService(userName: string, password: string): Promise<any> {
    try {
      const response = await axios.post(this.authUrl, { userName, password, applicationId: '5385' }, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Failed to authenticate with external service');
    }
  }

  private async validateUser(userName: string, password: string): Promise<any> {
    const userData = await this.authenticateWithExternalService(userName, password);
    const { roles } = userData;

    if (!roles) {
      throw new UnauthorizedException('User does not have the required role');
    }

    return { userName };
  }

  async login(loginDto: LoginDto) {
    await this.validateUser(loginDto.userName, loginDto.password);
    const payload = { username: loginDto.userName };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
