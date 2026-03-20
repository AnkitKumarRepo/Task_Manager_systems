import { Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
import { prisma } from '../utils/prisma';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';
import { AppError } from '../middlewares/error.middleware';
import { AuthenticatedRequest, TaskFilterQuery } from '../types';

export async function getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '10', status, priority, search } = req.query as TaskFilterQuery;
    const userId = req.userId!;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.TaskWhereInput = { userId };

    if (status && VALID_STATUSES.includes(status)) {
      where.status = status;
    }
    if (priority && VALID_PRIORITIES.includes(priority)) {
      where.priority = priority;
    }
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasMore: skip + tasks.length < total,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!task) throw new AppError('Task not found', 404);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: req.userId!,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) throw new AppError('Task not found', 404);

    const data = updateTaskSchema.parse(req.body);
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...data,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
      },
    });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) throw new AppError('Task not found', 404);

    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function toggleTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) throw new AppError('Task not found', 404);

    const nextStatus =
      existing.status === 'COMPLETED'
        ? 'PENDING'
        : existing.status === 'PENDING'
          ? 'IN_PROGRESS'
          : 'COMPLETED';

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status: nextStatus },
    });
    res.json(task);
  } catch (err) {
    next(err);
  }
}
