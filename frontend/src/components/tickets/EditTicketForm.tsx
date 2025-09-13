import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useTicket, useUpdateTicket } from '../../hooks';
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
  Skeleton,
} from '../ui';
import { Priority, Status, type UpdateTicketRequest } from '../../types';

const updateTicketSchema = z.object({
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
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(Status),
});

type UpdateTicketForm = z.infer<typeof updateTicketSchema>;

interface EditTicketFormProps {
  ticketId?: string;
  onCancel?: () => void;
  onSuccess?: (ticketId: string) => void;
}

export function EditTicketForm({ ticketId, onCancel, onSuccess }: EditTicketFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const actualTicketId = ticketId || id!;
  const { data: ticket, isLoading, error } = useTicket(actualTicketId);
  const updateTicketMutation = useUpdateTicket();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = useForm<UpdateTicketForm>({
    resolver: zodResolver(updateTicketSchema),
    values: ticket ? {
      title: ticket.title,
      description: ticket.description,
      user: ticket.user,
      priority: ticket.priority,
      status: ticket.status,
    } : undefined,
  });

  const watchedFields = watch();

  const onSubmit = async (data: UpdateTicketForm) => {
    try {
      const ticketData: UpdateTicketRequest = {
        title: data.title.trim(),
        description: data.description.trim(),
        user: data.user.trim(),
        priority: data.priority,
        status: data.status,
      };

      const updatedTicket = await updateTicketMutation.mutateAsync({
        id: actualTicketId,
        data: ticketData,
      });

      addToast({
        title: 'Ticket updated successfully',
        description: `Ticket ${updatedTicket.ticketNumber} has been updated.`,
        variant: 'success',
      });

      // Reset form to new values
      reset();

      // Handle success
      if (onSuccess) {
        onSuccess(updatedTicket.id);
      } else {
        navigate(`/tickets/${updatedTicket.id}`);
      }
    } catch (error: any) {
      addToast({
        title: 'Failed to update ticket',
        description: error?.message || 'An error occurred while updating the ticket.',
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
      navigate(`/tickets/${actualTicketId}`);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/tickets')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tickets
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Failed to load ticket
            </h2>
            <p className="text-muted-foreground mb-4">
              {error.message}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/tickets')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to tickets
            </Button>
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Back to ticket
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Ticket</h1>
            <p className="text-muted-foreground">
              Editing {ticket.ticketNumber}
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
                User Email Address
              </Label>
              <Input
                id="user"
                type="email"
                placeholder="user.email@company.com"
                error={errors.user?.message}
                {...register('user')}
              />
              <p className="text-xs text-muted-foreground">
                Email address of the person who submitted this ticket
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" required>
                Status
              </Label>
              <Select
                id="status"
                error={errors.status?.message}
                {...register('status')}
              >
                <option value={Status.OPEN}>Open - New ticket, needs attention</option>
                <option value={Status.IN_PROGRESS}>In Progress - Currently being worked on</option>
                <option value={Status.RESOLVED}>Resolved - Issue has been fixed</option>
                <option value={Status.CLOSED}>Closed - Ticket is complete</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                Update the current status of this ticket
              </p>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" required>
                Priority Level
              </Label>
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
                Adjust priority based on current urgency
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" required>
                Detailed Description
              </Label>
              <Textarea
                id="description"
                placeholder="Please provide as much detail as possible about the issue. Include steps to reproduce, error messages, and any relevant context..."
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
            loading={isSubmitting || updateTicketMutation.isPending}
            disabled={!isDirty}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Update Ticket
          </Button>
        </div>
      </form>
    </div>
  );
}