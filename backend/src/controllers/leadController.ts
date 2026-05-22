import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Lead } from '../models/Lead.js';
import { ApiError } from '../utils/apiError.js';
import { buildPagination, buildTotalPages } from '../utils/pagination.js';

const leadProjection = {
  name: 1,
  email: 1,
  status: 1,
  source: 1,
  createdAt: 1,
  updatedAt: 1,
  owner: 1,
} as const;

const isAdmin = (role?: string): boolean => role === 'Admin';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }

  const { name, email, status, source } = req.body as {
    name: string;
    email: string;
    status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    source?: 'Website' | 'Instagram' | 'Referral';
  };

  const lead = await Lead.create({
    name,
    email,
    status,
    source,
    owner: new Types.ObjectId(req.user.id),
  });

  res.status(201).json({ lead });
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }

  const paginationInput = typeof req.query.page === 'string' ? { page: req.query.page, limit: 10 } : { limit: 10 };
  const { page, limit, skip } = buildPagination(paginationInput);
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const source = typeof req.query.source === 'string' ? req.query.source : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const sort = req.query.sort === 'oldest' ? 1 : -1;

  const query: Record<string, unknown> = {};

  if (!isAdmin(req.user.role)) {
    query.owner = new Types.ObjectId(req.user.id);
  }

  if (status) {
    query.status = status;
  }

  if (source) {
    query.source = source;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [leads, totalLeads] = await Promise.all([
    Lead.find(query).sort({ createdAt: sort }).skip(skip).limit(limit).select(leadProjection),
    Lead.countDocuments(query),
  ]);

  res.status(200).json({
    leads,
    totalLeads,
    totalPages: buildTotalPages(totalLeads, limit),
    currentPage: page,
  });
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }

  const lead = await Lead.findById(req.params.id).select(leadProjection);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  if (!isAdmin(req.user.role) && lead.owner.toString() !== req.user.id) {
    throw new ApiError(403, 'Forbidden');
  }

  res.status(200).json({ lead });
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  if (!isAdmin(req.user.role) && lead.owner.toString() !== req.user.id) {
    throw new ApiError(403, 'Forbidden');
  }

  const { name, email, status, source } = req.body as {
    name?: string;
    email?: string;
    status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    source?: 'Website' | 'Instagram' | 'Referral';
  };

  if (name !== undefined) lead.name = name;
  if (email !== undefined) lead.email = email;
  if (status !== undefined) lead.status = status;
  if (source !== undefined) lead.source = source;

  await lead.save();
  res.status(200).json({ lead });
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  if (!isAdmin(req.user.role) && lead.owner.toString() !== req.user.id) {
    throw new ApiError(403, 'Forbidden');
  }

  await lead.deleteOne();
  res.status(200).json({ message: 'Lead deleted successfully' });
};
