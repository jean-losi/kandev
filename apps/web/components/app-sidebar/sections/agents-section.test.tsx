import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AgentProfile } from "@/lib/state/slices/office/types";
import { agentProfileId, workspaceId } from "@/lib/types/ids";

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
}));

const state = {
  appSidebar: {
    sectionExpanded: {
      agents: true,
    } as Record<string, boolean>,
  },
  office: {
    agentProfiles: [] as AgentProfile[],
    inboxItems: [],
  },
  workspaces: {
    activeId: "workspace-1" as string | null,
  },
  setOfficeAgentProfiles: vi.fn(),
  toggleAppSidebarSection: vi.fn(),
  setAppSidebarCollapsed: vi.fn(),
  sessions: {
    byId: {},
  },
  taskSessions: {
    items: {},
  },
};

vi.mock("@/lib/routing/client-router", () => ({
  usePathname: () => "/office",
  useRouter: () => routerMock,
}));

vi.mock("@/hooks/use-in-office", () => ({
  useInOffice: () => true,
}));

vi.mock("@/hooks/use-office-refetch", () => ({
  useOfficeRefetch: vi.fn(),
}));

vi.mock("@/lib/api/domains/office-api", () => ({
  listAgentProfiles: vi.fn(() => Promise.resolve({ agents: [] })),
}));

vi.mock("@/components/state-provider", () => ({
  useAppStore: (selector: (s: typeof state) => unknown) => selector(state),
}));

vi.mock("@kandev/ui/collapsible", () => ({
  Collapsible: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@kandev/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { AgentsSection } from "./agents-section";

describe("AgentsSection", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    state.office.agentProfiles = [];
    state.workspaces.activeId = "workspace-1";
  });

  it("renders Agent Topology as the header action before Add agent", () => {
    render(<AgentsSection collapsed={false} />);

    const agentsHeader = screen.getByRole("button", { name: "Agents" }).closest(".group\\/section");
    expect(agentsHeader).toBeTruthy();

    const topology = within(agentsHeader as HTMLElement).getByRole("link", {
      name: "Agent topology",
    });
    const addAgent = within(agentsHeader as HTMLElement).getByRole("button", {
      name: "Add agent",
    });

    expect(topology.getAttribute("href")).toBe("/office/workspace/org");
    expect(topology.compareDocumentPosition(addAgent) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("does not render stale agent links when no office workspace is active", () => {
    state.workspaces.activeId = null;
    state.office.agentProfiles = [
      {
        id: agentProfileId("stale-agent"),
        workspaceId: workspaceId("old-workspace"),
        name: "Stale Agent",
        role: "worker",
        status: "idle",
        budgetMonthlyCents: 0,
        maxConcurrentSessions: 1,
        agentId: "claude",
        agentDisplayName: "Claude",
        model: "claude-sonnet-4-5",
        allowIndexing: false,
        autoApprove: false,
        cliFlags: [],
        cliPassthrough: false,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ];

    render(<AgentsSection collapsed={false} />);

    expect(screen.queryByRole("link", { name: /stale agent/i })).toBeNull();
    expect(screen.getByText("No agents yet")).toBeTruthy();
  });
});
