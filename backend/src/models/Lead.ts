import { Schema, model, type HydratedDocument, Types } from 'mongoose';
import type { LeadSource, LeadStatus } from '../types/index.js';

export interface LeadDocument {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: Types.ObjectId;
}

const leadSchema = new Schema<LeadDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
      required: true,
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      default: 'Website',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Lead = model<LeadDocument>('Lead', leadSchema);
export type LeadHydratedDocument = HydratedDocument<LeadDocument>;
