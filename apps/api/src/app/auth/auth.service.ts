import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDTO, Role } from '@ngtestwrk/data';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // Create a user in DB using UserDTO
  async createUser(dto: UserDTO): Promise<UserEntity> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new Error('User already exists');
    const newUser = this.userRepo.create(dto);
    return this.userRepo.save(newUser);
  }

  // Validate user by email in DB
  async validateUser(email: string): Promise<UserDTO> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  // Login returns JWT
  async login(email: string) {
    const user = await this.validateUser(email);
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      orgId: user.orgId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
