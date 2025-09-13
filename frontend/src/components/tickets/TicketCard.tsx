import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { User, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent, Badge } from '../ui';
import { cn } from '../../utils/cn';
import type { Ticket } from '../../types';

interface TicketCardProps {
  ticket: Ticket;
  className?: string;
}

export function TicketCard({ ticket, className }: TicketCardProps) {
  const commentCount = ticket.comments?.length || 0;
  
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Header with ticket number and badges */}
          <div className="flex items-center justify-between">
            <Link
              to={`/tickets/${ticket.id}`}
              className="text-sm font-mono text-muted-foreground hover:text-primary"
            >
              {ticket.ticketNumber}
            </Link>
            <div className="flex gap-2">
              <Badge variant="status" status={ticket.status} />
              <Badge variant="priority" priority={ticket.priority} />
            </div>
          </div>

          {/* Title */}
          <div>
            <Link
              to={`/tickets/${ticket.id}`}
              className="text-lg font-semibold text-foreground hover:text-primary line-clamp-2"
            >
              {ticket.title}
            </Link>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {ticket.description}
          </p>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{ticket.user}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            {commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}