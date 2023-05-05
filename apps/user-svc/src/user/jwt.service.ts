/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-06 00:02:26
 * @Description:
 *
 */
import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { UserEntity } from './entity/user.entity';
import bcrypt from 'bcrypt';
@Injectable()
export class JwtService {
  constructor(private readonly jwt: Jwt) {}

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async verify(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (err) {}
  }

  // Generate JWT Token
  public generateToken(user: UserEntity): string {
    return this.jwt.sign({
      id: user.id,
      // email: user.email
    });
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<UserEntity | any> {
    // return this.repository.findOne({
    //   where: {
    //     id: decoded.id,
    //   },
    // });
  }
}
