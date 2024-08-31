import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from 'src/db/entities/user-entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private manager: EntityManager;
  private readonly saltRounds = 10;
  constructor(
    @Inject('DataSource')
    private dataSource: DataSource,
    private jwtService: JwtService
  ) {
    this.manager = this.dataSource.manager;
  }

  //validateUser
  async validateUser(
    email: string,
    password: string
  ): Promise<UserEntity | null> {
    try {
      const user = await this.manager.findOneBy(UserEntity, { email });

      if (!user) {
        throw new Error(`User not found`);
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error(`Invalid user credentials`);
      }

      return user;
    } catch (error) {
      throw new NotFoundException(`${error.message}`);
    }
  }

  //create user
  async createUser(data: CreateUserDto) {
    try {
      const user = await this.manager.findOneBy(UserEntity, {
        email: data.email
      });

      if (user) {
        throw new Error(`User already exists, go to login`);
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

      const createUser = this.manager.create(UserEntity, {
        email: data.email,
        password: hashedPassword, // Save the hashed password
        name: data.name,
        mobile: data.mobile,
        gender: data.gender,
        date_of_birth: data.date_of_birth
      });
      await this.manager.save(UserEntity, createUser);

      return { message: 'User created successfully', createUser };
    } catch (error) {
      throw new NotFoundException(`${error.message}`);
    }
  }

  //login
  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      console.log(user);
      // Generate a JWT token (or any other token) for the user
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);

      return { message: 'Login successful', token };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  //updateuser
  async updateUser() {
    try {
    } catch (error) {
      throw new NotFoundException(`${error.message}`);
    }
  }

  //delete user
  async deleteUser(id: string) {
    try {
      const user = await this.manager.findOneBy(UserEntity, {
        id: id
      });

      if (!user) {
        throw new Error(`User is not found`);
      }

      await this.manager.delete(UserEntity, id);

      return { message: 'User delete Successfully' };
    } catch (error) {
      throw new NotFoundException(`${error.message}`);
    }
  }

  //get user
  async getUser() {
    try {
      const users = await this.manager.find(UserEntity);

      if (users.length === 0) {
        throw new Error(`data not found`);
      }

      return { message: 'Data fetch Successfully', data: users };
    } catch (error) {
      throw new NotFoundException(`${error.message}`);
    }
  }

  //get user by id
  async getUserById(id: string) {
    try {
      const user = await this.manager.findOneBy(UserEntity, { id });

      if (!user) {
        throw new Error(`User not found`);
      }

      return { message: 'User found', data: user };
    } catch (error) {
      throw new NotFoundException(`${error.message}`);
    }
  }
}
