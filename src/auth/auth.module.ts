import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard'; // Ensure correct import

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with JWT strategy
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret', // Use a secure secret
      signOptions: { expiresIn: '1000s' }, // Token expiration
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard], // Include JwtStrategy and JwtAuthGuard in providers
  controllers: [AuthController],
  exports: [JwtAuthGuard, PassportModule], // Export JwtAuthGuard if used in other modules
})
export class AuthModule {}