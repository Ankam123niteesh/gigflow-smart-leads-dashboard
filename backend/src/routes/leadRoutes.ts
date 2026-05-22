import { Router } from 'express';
import { createLead, deleteLead, getLeadById, getLeads, updateLead } from '../controllers/leadController.js';
import { authorizeRoles, protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { leadCreateSchema, leadUpdateSchema } from '../validators/leadSchemas.js';

export const leadRoutes = Router();

leadRoutes.use(protect);

leadRoutes.get('/', getLeads);
leadRoutes.post('/', validateRequest(leadCreateSchema), createLead);
leadRoutes.get('/:id', getLeadById);
leadRoutes.put('/:id', validateRequest(leadUpdateSchema), updateLead);
leadRoutes.delete('/:id', authorizeRoles('Admin', 'Sales User'), deleteLead);
