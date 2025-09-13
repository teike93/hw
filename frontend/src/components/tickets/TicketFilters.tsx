import { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  CardContent,
  Badge 
} from '../ui';
import { Status, Priority, type TicketFilters } from '../../types';
import { cn } from '../../utils/cn';

interface TicketFiltersProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
  className?: string;
}

export function TicketFilters({ filters, onFiltersChange, className }: TicketFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  
  // Debounced search - update filters 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        onFiltersChange({ ...filters, search: searchQuery || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, onFiltersChange]);

  const handleFilterChange = (key: keyof TicketFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = !!(
    filters.search || 
    filters.status || 
    filters.priority || 
    filters.sortBy !== 'createdAt' || 
    filters.sortOrder !== 'desc'
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') count++;
    return count;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar - Always Visible */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets by title, description, or user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  placeholder="All statuses"
                >
                  <option value="">All statuses</option>
                  <option value={Status.OPEN}>Open</option>
                  <option value={Status.IN_PROGRESS}>In Progress</option>
                  <option value={Status.RESOLVED}>Resolved</option>
                  <option value={Status.CLOSED}>Closed</option>
                </Select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Priority
                </label>
                <Select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  placeholder="All priorities"
                >
                  <option value="">All priorities</option>
                  <option value={Priority.LOW}>Low</option>
                  <option value={Priority.MEDIUM}>Medium</option>
                  <option value={Priority.HIGH}>High</option>
                  <option value={Priority.CRITICAL}>Critical</option>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Sort by
                </label>
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                >
                  <option value="createdAt-desc">Newest first</option>
                  <option value="createdAt-asc">Oldest first</option>
                  <option value="updatedAt-desc">Recently updated</option>
                  <option value="updatedAt-asc">Least recently updated</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="status-asc">Status (A-Z)</option>
                  <option value="status-desc">Status (Z-A)</option>
                  <option value="priority-desc">Priority (High to Low)</option>
                  <option value="priority-asc">Priority (Low to High)</option>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Active filters:
                  </span>
                  {filters.search && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Search: {filters.search}
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          handleFilterChange('search', undefined);
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.status && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Status: {filters.status}
                      <button
                        onClick={() => handleFilterChange('status', undefined)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.priority && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Priority: {filters.priority}
                      <button
                        onClick={() => handleFilterChange('priority', undefined)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {(filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Sort: {filters.sortBy} {filters.sortOrder}
                      <button
                        onClick={() => {
                          handleFilterChange('sortBy', 'createdAt');
                          handleFilterChange('sortOrder', 'desc');
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}