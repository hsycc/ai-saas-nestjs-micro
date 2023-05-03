import BaseEntity from '@app/common/entities/baseEntity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as crypto from 'crypto';
import { getAesInstance } from '@app/common/utils';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public email!: string;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @Column({
    length: 50,
    unique: true,
  })
  username: string;

  @Column({
    comment: '头像',
    default: '',
  })
  avatar: string;

  @Column({
    comment: '状态, 1: enable, 0: disable',
    default: 1,
    type: 'int',
  })
  status: number;

  @Column({
    length: 250,
    select: false,
    name: '_password',
  })
  @ApiHideProperty()
  @Exclude()
  password_hash: string;

  set _password(password: string) {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    this.password_hash = passHash;
  }

  @Column({
    length: 256,
    name: 'public_key',
    comment: '公钥地址',
    default: '',
  })
  public public_key: string;

  @Column({
    length: 256,
    name: 'private_key',
    comment: '私钥地址',
  })
  public encryptedPrivateKey: string;

  set private_key(key: string) {
    this.encryptedPrivateKey = getAesInstance(2).encrypt(key);
  }
}
