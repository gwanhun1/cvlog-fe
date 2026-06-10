import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchTagAutocomplete } from 'service/api/tag';
import { TagSuggestion } from 'service/api/tag/type';

const useDebouncedValue = <T,>(value: T, delay = 200): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

interface UseTagAutocompleteOptions {
  limit?: number;
  debounceMs?: number;
  enabled?: boolean;
}

export const useTagAutocomplete = (
  keyword: string,
  options: UseTagAutocompleteOptions = {},
) => {
  const { limit = 10, debounceMs = 200, enabled = true } = options;
  const debounced = useDebouncedValue(keyword.trim(), debounceMs);
  const isValid = debounced.length >= 1 && debounced.length <= 30;

  return useQuery<TagSuggestion[]>({
    queryKey: ['tag-autocomplete', debounced, limit],
    queryFn: () => fetchTagAutocomplete(debounced, limit),
    enabled: enabled && isValid,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
