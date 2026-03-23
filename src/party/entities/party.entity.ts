import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('parties')
export class Party {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Party - PDP

  @Column({ unique: true })
  acronym: string; // People Democratic Party

  @Column()
  slogan: string;

  @Column({ type: 'date', nullable: true })
  founded: Date;

  @Column()
  founder: string;

  @Column()
  currentChair: string;

  @Column('simple-array')
  chairContacts: string[];

  @Column({ default: true })
  isActive: boolean;
}
