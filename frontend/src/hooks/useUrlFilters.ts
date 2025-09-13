import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { Status, Priority, type TicketFilters } from '../types';

const DEFAULT_FILTERS: TicketFilters = {
  page: 1,
  limit: 12,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const parseFilters = useCallback((): TicketFilters => {
    const filters: TicketFilters = { ...DEFAULT_FILTERS };

    // Parse page
    const page = searchParams.get('page');
    if (page && !isNaN(parseInt(page, 10))) {
      filters.page = parseInt(page, 10);
    }

    // Parse limit
    const limit = searchParams.get('limit');
    if (limit && !isNaN(parseInt(limit, 10))) {
      filters.limit = parseInt(limit, 10);
    }

    // Parse search
    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }

    // Parse status
    const status = searchParams.get('status') as Status;
    if (status && Object.values(Status).includes(status)) {
      filters.status = status;
    }

    // Parse priority
    const priority = searchParams.get('priority') as Priority;
    if (priority && Object.values(Priority).includes(priority)) {
      filters.priority = priority;
    }

    // Parse sortBy
    const sortBy = searchParams.get('sortBy');
    if (sortBy && ['createdAt', 'updatedAt', 'title', 'status', 'priority'].includes(sortBy)) {
      filters.sortBy = sortBy as TicketFilters['sortBy'];
    }

    // Parse sortOrder
    const sortOrder = searchParams.get('sortOrder');
    if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
      filters.sortOrder = sortOrder as TicketFilters['sortOrder'];
    }

    return filters;
  }, [searchParams]);

  const updateFilters = useCallback((newFilters: TicketFilters) => {
    const params = new URLSearchParams();

    // Only add parameters that differ from defaults or are explicitly set
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Skip default values to keep URLs clean
        const defaultValue = DEFAULT_FILTERS[key as keyof TicketFilters];
        if (value !== defaultValue) {
          params.set(key, value.toString());
        }
      }
    });

    // Always include page if it's not 1
    if (newFilters.page && newFilters.page !== 1) {
      params.set('page', newFilters.page.toString());
    }

    setSearchParams(params);
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    filters: parseFilters(),
    updateFilters,
    clearFilters,
  };
}