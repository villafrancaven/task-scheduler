import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      recurrenceCron: dto.recurrenceCron,
    });

    if (dto.parentId) {
      const parent = await this.taskRepo.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) throw new BadRequestException('Parent task not found');

      if (
        dto.dueDate &&
        parent.dueDate &&
        new Date(dto.dueDate) > parent.dueDate
      ) {
        throw new BadRequestException(
          "Child's due date cannot be after parent's due date",
        );
      }

      task.parent = parent;
    }

    return this.taskRepo.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepo.find({ relations: ['parent', 'children'] });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (dto.status === 'completed') {
      const children = await this.taskRepo.find({
        where: { parent: { id } },
      });
      const hasPendingChildren = children.some((c) => c.status !== 'completed');
      if (hasPendingChildren) {
        throw new BadRequestException(
          "Parent can't be completed until all children are done",
        );
      }
    }

    if (
      dto.dueDate &&
      task.parent?.dueDate &&
      new Date(dto.dueDate) > task.parent.dueDate
    ) {
      throw new BadRequestException(
        "Child's due date cannot be after parent's due date",
      );
    }

    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
  }
}
