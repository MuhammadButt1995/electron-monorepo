'use client';

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAndParseData } from '@/lib/fetchAndParseData';
import { FmInfoAPIResponseSchema } from '@/types/api';
import { useGlobalStateStore } from '@/store/global-state-store';

const SSDHealthStatusEnum = z.enum(['HEALTHY', 'UNHEALTHY']);

export const SSDHealthResponse = FmInfoAPIResponseSchema.and(
  z.object({
    data: z.object({
      ssdHealthStatus: SSDHealthStatusEnum,
    }),
  })
);

const url = 'http://localhost:8567/tools/ssd-health';
const ONE_DAY_IN_MS = 86400000;

export const useSSDHealth = () => {
  const isDaaSMachine = useGlobalStateStore((state) => state.isDaaSMachine);
  const SSDHealthQuery = useQuery({
    queryKey: [url],
    queryFn: () => fetchAndParseData(url, SSDHealthResponse),
    refetchOnMount: false,
    refetchInterval: ONE_DAY_IN_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
    networkMode: 'always',
    enabled: !isDaaSMachine,
  });

  return SSDHealthQuery;
};
