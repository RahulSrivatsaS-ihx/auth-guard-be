import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TblApplicationUserEntity } from 'src/info/tblApplicationUser.entity';
import { TblUserMapRoleEntity } from './TblUserMap_Role.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { CreateUserDto, CreateUserDataDto } from './create-user.dto';

@Injectable()
export class UserCreationService {
  private readonly logger = new Logger(UserCreationService.name);

  constructor(
    @InjectRepository(TblApplicationUserEntity, 'MediAuthConnection')
    private readonly userCreationRepository: Repository<TblApplicationUserEntity>,
    @InjectRepository(TblUserMapRoleEntity, 'MediAuthConnection')
    private readonly roleAssignRepository: Repository<TblUserMapRoleEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<string> {
    const { userData, roles } = createUserDto;
    const { firstName, lastName, username, email, phoneNumber, entityId } = userData;

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

    // Save user to the database
    const savedUser = await this.userCreationRepository.save(newUser);

    // Assign roles if provided
    if (roles) {
      await this.assignRoles(savedUser.TAU_Id, roles);
    }

    // Send the email with the generated password
    await this.sendEmail(email, password);

    this.logger.log(`User with email ${email} created successfully.`);
    return `User created successfully. Password sent to email: ${email}`;
  }

  private async assignRoles(userId: number, roles: Record<string, string>): Promise<void> {
    const roleEntries = Object.entries(roles).map(([roleId, roleName]) => ({
      TUMR_TAU_Id: userId,
      TUMR_Role: roleName,
      TUMR_CreatedBy: 'Admin',
      TUMR_CreatedOn: new Date(),
    }));
    
    await this.roleAssignRepository.save(roleEntries);
    this.logger.log(`Roles assigned to userId ${userId}: ${JSON.stringify(roleEntries)}`);
  }

  private generateStrongPassword(): string {
    return randomBytes(8).toString('hex'); // 16-character hex string
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async sendEmail(email: string, password: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service here
      auth: {
        user: 'rahul.srivatsa@ihx.in',
        pass: '', // Add your email password
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
