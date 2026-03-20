import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface TaskFilterQuery extends PaginationQuery {
  status?: string;
  priority?: string;
  search?: string;
}
