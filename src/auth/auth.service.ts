import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosError } from 'axios';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly authUrl = 'http://stg-auth.ihx.in/SignIn/Password';
  private readonly headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json-patch+json',
  };

  constructor(private readonly jwtService: JwtService) {}

  // Authenticate with the external service
  private async authenticateWithExternalService(userName: string, password: string): Promise<any> {
    try {
      const response = await axios.post(this.authUrl, { userName, password, applicationId: '5385' },
        {
          headers: this.headers,
          timeout: 30000, // Set timeout to 30 seconds (30000 milliseconds)
        }
      );
      return response.data;
    } catch (error) {
      this.handleAuthenticationError(error);
    }
  }

  // Handle errors from external service authentication
  private handleAuthenticationError(error: AxiosError): void {
    console.error('Authentication error:', error.message); // Consider using a logging service
    if (error.response?.status === 401) {
      throw new UnauthorizedException('Invalid credentials');
    }
    throw new InternalServerErrorException('Failed to authenticate with external service');
  }

  // Validate the user's roles and authentication status
  private async validateUser(userName: string, password: string): Promise<{ userName: string }> {
    const userData = await this.authenticateWithExternalService(userName, password);
    if (!userData.roles) {
      throw new UnauthorizedException('User does not have the required role');
    }
    return { userName };
  }

  // Perform login and return JWT token
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    await this.validateUser(loginDto.userName, loginDto.password);
    const payload = { username: loginDto.userName };
    const accessToken = this.jwtService.sign(payload);
    return { access_token: accessToken };
  }
}
