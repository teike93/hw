import { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Status, Priority } from '../../types';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'status' | 'priority';
  status?: Status;
  priority?: Priority;
}

export function Badge({ 
  className, 
  variant = 'default', 
  status, 
  priority, 
  children,
  ...props 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground border border-input',
    status: getStatusStyles(status),
    priority: getPriorityStyles(priority),
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children || status || priority}
    </div>
  );
}

function getStatusStyles(status?: Status): string {
  switch (status) {
    case Status.OPEN:
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case Status.IN_PROGRESS:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case Status.RESOLVED:
      return 'bg-green-100 text-green-800 border border-green-200';
    case Status.CLOSED:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
}

function getPriorityStyles(priority?: Priority): string {
  switch (priority) {
    case Priority.LOW:
      return 'bg-green-100 text-green-700 border border-green-200';
    case Priority.MEDIUM:
      return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case Priority.HIGH:
      return 'bg-orange-100 text-orange-700 border border-orange-200';
    case Priority.CRITICAL:
      return 'bg-red-100 text-red-700 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
}