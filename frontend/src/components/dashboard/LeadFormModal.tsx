import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import type { Lead, LeadFormValues } from '../../types/api';

const schema = z.object({
  name: z.string().min(2, 'Lead name is required'),
  email: z.string().email('Enter a valid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type FormValues = z.infer<typeof schema>;

interface LeadFormModalProps {
  lead?: Lead | null;
  onClose: () => void;
  onSave: (values: LeadFormValues) => Promise<void>;
}

export const LeadFormModal = ({ lead, onClose, onSave }: LeadFormModalProps): ReactElement => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      status: lead?.status ?? 'New',
      source: lead?.source ?? 'Website',
    },
  });

  useEffect(() => {
    reset({
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      status: lead?.status ?? 'New',
      source: lead?.source ?? 'Website',
    });
  }, [lead, reset]);

  const submit = async (values: FormValues): Promise<void> => {
    await onSave(values);
  };

  return (
    <Modal title={lead ? 'Update lead' : 'Create lead'} description="Capture and keep the sales pipeline moving." onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
        <Input label="Lead name" placeholder="Northstar Labs" {...register('name')} error={errors.name?.message} />
        <Input label="Email" placeholder="lead@company.com" {...register('email')} error={errors.email?.message} />
        <Select label="Status" {...register('status')} error={errors.status?.message}>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </Select>
        <Select label="Source" {...register('source')} error={errors.source?.message}>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </Select>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
