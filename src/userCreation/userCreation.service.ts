import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TblApplicationUserEntity } from 'src/info/tblApplicationUser.entity';
import { Entity, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { CreateUserDataDto } from './create-user.dto';

@Injectable()
export class UserCreationService {
  private readonly logger = new Logger(UserCreationService.name);

  constructor(
    @InjectRepository(TblApplicationUserEntity, 'MediAuthConnection')
    private readonly userCreationRepository: Repository<TblApplicationUserEntity>,
  ) {}

  // Accept CreateUserDataDto as params
  async createUser(params: CreateUserDataDto): Promise<string> {
    const { firstName, lastName, username, email, phoneNumber, gender, entityId } = params;

    // Check if email already exists
    const existingUser = await this.userCreationRepository.findOne({ where: { TAU_EmailId: email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Generate random strong password
    const password = this.generateStrongPassword();
    const hashedPassword = await this.hashPassword(password);

    // Create new user entity
    const newUser = this.userCreationRepository.create({
      TAU_FirstName: firstName,
      TAU_LastName: lastName,
      TAU_LoginName: username,
      TAU_EmailId: email,
      TAU_PhoneNumber: phoneNumber,
      TAU_IsActive: true,
      TAU_IsLocked: false,
      TAU_Createdby: 'Admin',
      TAU_CreatedOn: new Date(),
      TAU_Password: hashedPassword,
      TAU_ProviderMasterEntityId: entityId,
      TAU_HasLoggedIn: false,
    });
    this.logger.log(`Creating user with data: ${JSON.stringify(newUser)}`);

    // Save user to the databas
    await this.userCreationRepository.save(newUser);

    // Send the email with the generated password
    await this.sendEmail(email, password);

    this.logger.log(`User with email ${email} created successfully.`);
    return `User created successfully. Password sent to email: ${email}`;
  }

  // Generate a random strong password
  private generateStrongPassword(): string {
    return randomBytes(8).toString('hex'); // 16-character hex string
  }

  // Hash the password using bcrypt
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // Send email with the generated password
  private async sendEmail(email: string, password: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service here
      auth: {
        user: 'rahul.srivatsa@ihx.in',
        pass: '',
      },
    });

    const mailOptions = {
      from: 'rahul.srivatsa@ihx.in',
      to: email,
      subject: 'Your Account Password',
      text: `Your account has been created. Your password is: ${password}`,
    };

    await transporter.sendMail(mailOptions);
    this.logger.log(`Password sent to ${email}`);
  }
}
