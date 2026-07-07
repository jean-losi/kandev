import { describe, expect, it } from "vitest";
import type { WorkflowSnapshot } from "@/lib/types/http";
import { snapshotToState } from "./mapper";

describe("snapshotToState", () => {
  it("preserves workflow step WIP fields", () => {
    const state = snapshotToState({
      workflow: {
        id: "wf-1",
        workspace_id: "ws-1",
        name: "Workflow",
        created_at: "",
        updated_at: "",
      },
      steps: [
        {
          id: "step-1",
          workflow_id: "wf-1",
          name: "Review",
          position: 1,
          color: "bg-blue-500",
          allow_manual_move: true,
          wip_limit: 2,
          pull_from_step_id: "step-0",
        },
      ],
      tasks: [],
    } as unknown as WorkflowSnapshot);

    expect(state.kanban?.steps[0]).toMatchObject({
      wip_limit: 2,
      pull_from_step_id: "step-0",
    });
  });
});
