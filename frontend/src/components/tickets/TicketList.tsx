import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Ticket } from 'lucide-react';
import { useTickets } from '../../hooks';
import { TicketCard } from './TicketCard';
import { 
  Button, 
  SkeletonCard, 
  EmptyState, 
  Pagination,
  Select 
} from '../ui';
import type { TicketFilters } from '../../types';

interface TicketListProps {
  filters?: TicketFilters;
  onFiltersChange?: (filters: TicketFilters) => void;
}

export function TicketList({ filters = {}, onFiltersChange }: TicketListProps) {
  const navigate = useNavigate();
  const [currentFilters, setCurrentFilters] = useState<TicketFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...filters,
  });

  const { data, isLoading, error, refetch } = useTickets(currentFilters);

  const handleFilterChange = (newFilters: Partial<TicketFilters>) => {
    const updatedFilters = { 
      ...currentFilters, 
      ...newFilters,
      // Reset to page 1 when filters change (except for page changes)
      page: newFilters.page !== undefined ? newFilters.page : 1
    };
    setCurrentFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
  };

  const handleLimitChange = (limit: string) => {
    handleFilterChange({ limit: parseInt(limit, 10) });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="space-y-4">
            <p className="text-destructive">Failed to load tickets</p>
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with create button and controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track all support requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Results per page selector */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Show:</span>
            <Select
              value={currentFilters.limit?.toString() || '12'}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="w-20"
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </Select>
          </div>
          
          <Button 
            onClick={() => navigate('/tickets/new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && data && data.tickets.length === 0 && (
        <EmptyState
          icon={<Ticket className="h-16 w-16" />}
          title="No tickets found"
          description={
            Object.keys(filters).length > 0
              ? "No tickets match your current filters. Try adjusting your search criteria."
              : "No support tickets have been created yet. Create your first ticket to get started."
          }
          action={{
            label: "Create First Ticket",
            onClick: () => navigate('/tickets/new'),
          }}
        />
      )}

      {/* Tickets grid */}
      {!isLoading && data && data.tickets.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.pages > 1 && (
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.pages}
              totalItems={data.pagination.total}
              itemsPerPage={data.pagination.limit}
              onPageChange={handlePageChange}
              className="pt-6"
            />
          )}
        </>
      )}
    </div>
  );
}