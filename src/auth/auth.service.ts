import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import {Response} from 'express';

@Injectable()
export class AuthService {
  public readonly EXPIRE_DAY_REFRESH_TOKEN = 7;
  public readonly REFRESH_TOKEN_NAME = 'refreshToken';
  constructor(private jwt: JwtService, private userService: UserService) {
  }

  async login(dto: AuthDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...user} = await this.validateUser(dto)
    const tokens = this.issueToken(user.id)

    return {
      user,
      ...tokens
    }
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email)

    if (oldUser) throw new BadRequestException('User already exists')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...user} = await this.userService.create(dto)

    const tokens = this.issueToken(user.id)

    return {
      user,
      ...tokens
    }
  }

  private issueToken(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    }
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken)

    if (!result) throw new UnauthorizedException('Invalid refresh token')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...user} = await this.userService.getById(result.id)

    const tokens = this.issueToken(user.id)

    return{
      user,
      ...tokens
    }
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email)

    if (!user) throw new NotFoundException('User not found')

    const isValid = await verify(user.password, dto.password)

    if (!isValid) throw new UnauthorizedException('Invalid password')

    return user
  }

  addRefreshTokenToResponse(res:Response, refreshToken:string){
    const expiresIn = new Date()
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      expires: expiresIn,
      domain: 'localhost',
      secure: true,
      sameSite: 'lax',
    })
  }
  removeRefreshTokenToResponse(res:Response){
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      expires: new Date(0),
      domain: 'localhost',
      secure: true,
      sameSite: 'lax',
    })
  }


}
