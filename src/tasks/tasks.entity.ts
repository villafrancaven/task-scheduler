import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date | null;

  @Column({ default: 'pending' })
  status: 'pending' | 'completed' | 'skipped';

  @ManyToOne(() => Task, (task) => task.children, { nullable: true, onDelete: 'CASCADE' })
  parent?: Task;

  @OneToMany(() => Task, (task) => task.parent)
  children?: Task[];

  @Column({ nullable: true })
  recurrenceCron?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
