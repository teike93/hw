import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  User, 
  Clock, 
  MessageSquare,
  MoreVertical 
} from 'lucide-react';
import { useTicket, useDeleteTicket } from '../../hooks';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Skeleton,
  useToast 
} from '../ui';
import { Status, Priority } from '../../types';

interface TicketDetailProps {
  ticketId?: string;
  onEdit?: () => void;
}

export function TicketDetail({ ticketId, onEdit }: TicketDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const actualTicketId = ticketId || id;
  const { data: ticket, isLoading, error } = useTicket(actualTicketId!);
  const deleteTicketMutation = useDeleteTicket();

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      // Navigate to edit page (we'll implement this later)
      navigate(`/tickets/${actualTicketId}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!actualTicketId) return;

    try {
      await deleteTicketMutation.mutateAsync(actualTicketId);
      addToast({
        title: 'Ticket deleted',
        description: 'The ticket has been successfully deleted.',
        variant: 'success',
      });
      navigate('/tickets');
    } catch (error) {
      addToast({
        title: 'Failed to delete ticket',
        description: 'An error occurred while deleting the ticket.',
        variant: 'error',
      });
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.OPEN:
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case Status.IN_PROGRESS:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case Status.RESOLVED:
        return 'text-green-600 bg-green-50 border-green-200';
      case Status.CLOSED:
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return 'text-green-600 bg-green-50 border-green-200';
      case Priority.MEDIUM:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case Priority.HIGH:
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case Priority.CRITICAL:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  if (isLoading) {
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
          <CardHeader>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticket) {
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
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">
              Ticket not found
            </h2>
            <p className="text-muted-foreground">
              The ticket you're looking for doesn't exist or has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
          
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                loading={deleteTicketMutation.isPending}
              >
                Confirm Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            {/* Ticket Number */}
            <div className="text-sm text-muted-foreground font-mono">
              {ticket.ticketNumber}
            </div>

            {/* Title */}
            <CardTitle className="text-2xl">{ticket.title}</CardTitle>

            {/* Status and Priority Badges */}
            <div className="flex gap-3">
              <Badge variant="status" status={ticket.status} />
              <Badge variant="priority" priority={ticket.priority} />
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{ticket.user}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
              </div>
              {ticket.updatedAt !== ticket.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
                </div>
              )}
              {ticket.comments && ticket.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* Timeline Information */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{format(new Date(ticket.createdAt), 'PPp')}</span>
                </div>
                {ticket.updatedAt !== ticket.createdAt && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>{format(new Date(ticket.updatedAt), 'PPp')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}