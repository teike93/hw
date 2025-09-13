import { useNavigate } from 'react-router-dom';
import { Plus, Ticket } from 'lucide-react';
import { useTickets, useUrlFilters } from '../../hooks';
import { TicketCard } from './TicketCard';
import { TicketFilters } from './TicketFilters';
import { 
  Button, 
  SkeletonCard, 
  EmptyState, 
  Pagination,
  Select 
} from '../ui';

export function TicketList() {
  const navigate = useNavigate();
  const { filters, updateFilters } = useUrlFilters();
  const { data, isLoading, error, refetch } = useTickets(filters);

  const handlePageChange = (page: number) => {
    updateFilters({ ...filters, page });
  };

  const handleLimitChange = (limit: string) => {
    updateFilters({ ...filters, limit: parseInt(limit, 10), page: 1 });
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

  const hasFiltersApplied = !!(
    filters.search || 
    filters.status || 
    filters.priority ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc'
  );

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
              value={filters.limit?.toString() || '12'}
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

      {/* Filters */}
      <TicketFilters 
        filters={filters}
        onFiltersChange={updateFilters}
      />

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
          title={hasFiltersApplied ? "No tickets found" : "No tickets yet"}
          description={
            hasFiltersApplied
              ? "No tickets match your current filters. Try adjusting your search criteria."
              : "No support tickets have been created yet. Create your first ticket to get started."
          }
          action={{
            label: hasFiltersApplied ? "Clear Filters" : "Create First Ticket",
            onClick: hasFiltersApplied 
              ? () => updateFilters({ page: 1, limit: filters.limit, sortBy: 'createdAt', sortOrder: 'desc' })
              : () => navigate('/tickets/new'),
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