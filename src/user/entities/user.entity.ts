import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('one_nigeria_users')
export class OneNigeriaUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  onboarded: boolean;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiry: Date;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date;

  // Onboarding fields
  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  phone1: string;

  @Column({ nullable: true })
  phone2: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ nullable: true })
  ward: string;

  @Column({ nullable: true })
  pollingUnit: string;

  @Column({ nullable: true })
  neighborhood: string;

  @Column('simple-array', { nullable: true })
  nationIssueMaterials: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
