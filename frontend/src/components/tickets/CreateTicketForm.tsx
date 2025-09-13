import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useCreateTicket } from '../../hooks';
import {
  Button,
  Input,
  Textarea,
  Select,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useToast,
} from '../ui';
import { Priority, type CreateTicketRequest } from '../../types';

// Validation schema
const createTicketSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  user: z
    .string()
    .min(1, 'User email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  priority: z.nativeEnum(Priority).optional(),
});

type CreateTicketForm = z.infer<typeof createTicketSchema>;

interface CreateTicketFormProps {
  onCancel?: () => void;
  onSuccess?: (ticketId: string) => void;
}

export function CreateTicketForm({ onCancel, onSuccess }: CreateTicketFormProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const createTicketMutation = useCreateTicket();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      user: '',
      priority: Priority.MEDIUM,
    },
  });

  const watchedFields = watch();

  const onSubmit = async (data: CreateTicketForm) => {
    try {
      const ticketData: CreateTicketRequest = {
        title: data.title.trim(),
        description: data.description.trim(),
        user: data.user.trim(),
        priority: data.priority || Priority.MEDIUM,
      };

      const newTicket = await createTicketMutation.mutateAsync(ticketData);

      addToast({
        title: 'Ticket created successfully',
        description: `Ticket ${newTicket.ticketNumber} has been created.`,
        variant: 'success',
      });

      // Reset form
      reset();

      // Handle success
      if (onSuccess) {
        onSuccess(newTicket.id);
      } else {
        navigate(`/tickets/${newTicket.id}`);
      }
    } catch (error: any) {
      addToast({
        title: 'Failed to create ticket',
        description: error?.message || 'An error occurred while creating the ticket.',
        variant: 'error',
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) return;
    }

    if (onCancel) {
      onCancel();
    } else {
      navigate('/tickets');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tickets
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Ticket</h1>
            <p className="text-muted-foreground">
              Submit a new support request
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" required>
                Title
              </Label>
              <Input
                id="title"
                placeholder="Brief description of your issue"
                error={errors.title?.message}
                {...register('title')}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Be specific and descriptive</span>
                <span>{watchedFields.title?.length || 0}/200</span>
              </div>
            </div>

            {/* User Email */}
            <div className="space-y-2">
              <Label htmlFor="user" required>
                Your Email Address
              </Label>
              <Input
                id="user"
                type="email"
                placeholder="your.email@company.com"
                error={errors.user?.message}
                {...register('user')}
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to contact you about your ticket
              </p>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                id="priority"
                error={errors.priority?.message}
                {...register('priority')}
              >
                <option value={Priority.LOW}>Low - General questions or minor issues</option>
                <option value={Priority.MEDIUM}>Medium - Standard support requests</option>
                <option value={Priority.HIGH}>High - Urgent issues affecting work</option>
                <option value={Priority.CRITICAL}>Critical - System down or security issues</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the priority that best matches your situation
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" required>
                Detailed Description
              </Label>
              <Textarea
                id="description"
                placeholder="Please provide as much detail as possible about your issue. Include steps to reproduce, error messages, and any relevant context..."
                rows={8}
                error={errors.description?.message}
                {...register('description')}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Include steps to reproduce, error messages, and screenshots if applicable</span>
                <span>{watchedFields.description?.length || 0}/2000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isSubmitting || createTicketMutation.isPending}
            disabled={!isDirty}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </form>

      {/* Help Text */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Tips for a good support ticket:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Use a clear, specific title that summarizes the issue</li>
            <li>Include steps to reproduce the problem</li>
            <li>Mention any error messages you've seen</li>
            <li>Describe what you expected to happen vs. what actually happened</li>
            <li>Include relevant screenshots or files if helpful</li>
            <li>Set the appropriate priority level for your issue</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}