import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createUser')
  async createUser(@Body() data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  @Delete('deleteUser/:id')
  async deleteUser(@Param() param){
    return await this.userService.deleteUser(param.id)
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return await this.userService.login(email, password);
  }

  @Get('getusers')
  async getusers() {
    return await this.userService.getUser();
  }

  @Get('getUserById/:id')
  async getUserById(@Param() param){
    return await this.userService.getUserById(param.id)
  }

  @Put('updateUser/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<CreateUserDto>
  ) {
    return await this.userService.updateUser(id, data);
  }


}
