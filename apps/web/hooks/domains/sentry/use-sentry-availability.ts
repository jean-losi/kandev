"use client";

import { useCallback } from "react";
import { fetchSentryConfig } from "@/lib/api/domains/sentry-api";
import {
  useIntegrationAuthed,
  useIntegrationAvailable,
} from "../integrations/use-integration-availability";
import { qk } from "@/lib/query/keys";
import { useSentryEnabled } from "./use-sentry-enabled";

export function useSentryAuthed(workspaceId?: string | null): boolean {
  const fetchConfig = useCallback(
    async () => (await fetchSentryConfig(workspaceId ? { workspaceId } : undefined)) ?? null,
    [workspaceId],
  );
  return useIntegrationAuthed({
    active: workspaceId !== null,
    fetchConfig,
    queryKey: qk.integrations.sentry.config(workspaceId),
  });
}

export function useSentryAvailable(workspaceId?: string | null): boolean {
  const fetchConfig = useCallback(
    async () => (await fetchSentryConfig(workspaceId ? { workspaceId } : undefined)) ?? null,
    [workspaceId],
  );
  return useIntegrationAvailable({
    active: workspaceId !== null,
    useEnabled: useSentryEnabled,
    fetchConfig,
    queryKey: qk.integrations.sentry.config(workspaceId),
  });
}
