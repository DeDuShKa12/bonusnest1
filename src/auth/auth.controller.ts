import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { MailTemplate } from '../core/mail/mail.interface';
import { MailService } from '../core/mail/mail.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  @Post('login')
  async login(@Res() res: any, @Body() body: LoginDto) {
    if (!body.password && !body.email) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Error.Check_request_params' });
    }
    const user = await this.usersService.getUserByEmail(body.email);
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Email or password is incorrect' });
    }
    if (await this.authService.compareHash(body.password, user.password)) {
      const token = await this.authService.singIn(user.id.toString());
      return res.status(HttpStatus.OK).json({ token });
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Email or password is incorrect' });
  }
  @Post('register')
  async register(@Res() res: any, @Body() body: RegisterDto) {
    let user;
    try {
      user = await this.usersService.getUserByEmail(body.email.trim());
    } catch (err) {
      console.log(err);
    }
    if (user) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'User with this email is already exist' });
    }
    const createdUser = await this.usersService.createUser({
      name: body.name ? body.name : 'User', // body.name || body.email,
      email: body.email,
      password: body.password,
    });
    if (createdUser) {
      const subject = 'Welcome on board!';
      this.mailService.send(createdUser.email, subject, MailTemplate.WELCOME, {
        userName: createdUser.name,
      });
      const token = await this.authService.singIn(createdUser.id.toString());
      return res.status(HttpStatus.OK).json({ token });
    }
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Error.Register_user_failed' });
  }
}
