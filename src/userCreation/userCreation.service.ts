import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TblApplicationUserEntity } from 'src/info/tblApplicationUser.entity';
import { TblUserMapRoleEntity } from './TblUserMap_Role.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './create-user.dto';

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

    const existingUser = await this.userCreationRepository.findOneBy({ TAU_EmailId: email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const password = this.generateStrongPassword();
    const hashedPassword = await this.hashPassword(password);

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
    try {
      const savedUser = await this.userCreationRepository.save(newUser);
      this.logger.log('User saved:', savedUser);
      if (roles) {
        await this.assignRoles(savedUser.TAU_Id, roles);
      }
    } catch (e) {
      this.logger.error('Error saving user:', e);
      throw new Error('Error saving user');
    }

    // Send the email with the generated password
    await this.sendEmail(email, password);

    this.logger.log(`User with email ${email} created successfully.`);
    return `User created successfully. Password sent to email: ${email}`;
  }

  private async assignRoles(userId: number, roles: Record<string, string>): Promise<void> {
    const roleEntries = Object.entries(roles).map(([roleId, roleName]) => ({
      TUMR_TAU_Id: userId,
      TUMR_Role: roleId,
      TUMR_CreatedBy: '9214',
      // TUMR_CreatedOn: new Date(),
    }));

    await this.roleAssignRepository.save(roleEntries);
    this.logger.log(`Roles assigned to userId ${userId}: ${JSON.stringify(roleEntries)}`);
  }

  private generateStrongPassword(): string {
    return randomBytes(8).toString('hex'); // 16-character hex string
  }

  private async hashPassword(password: string): Promise<Buffer> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return Buffer.from(hashedPassword); // Store as Buffer
  }

  private async sendEmail(email: string, password: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rahul.srivatsa@ihx.in',
        pass: 'Rahul@277', // Add your email password
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
