import { createMachine, assign } from "xstate";

/**
 * Lead Pipeline State Machine
 * Manages lead progression from initial contact to booking
 * Prevents invalid status transitions (e.g., new → booked without qualification)
 */
export const leadMachine = createMachine({
  id: "lead",
  initial: "new",
  context: {
    leadId: null as string | null,
    assignedTo: null as string | null,
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  },
  states: {
    new: {
      on: {
        CONTACT: "contacted",
        MARK_LOST: "lost",
      },
    },
    contacted: {
      on: {
        QUALIFY: "qualified",
        MARK_LOST: "lost",
        BACK_TO_NEW: "new",
      },
    },
    qualified: {
      on: {
        SEND_PROPOSAL: "proposal",
        MARK_LOST: "lost",
        BACK_TO_CONTACTED: "contacted",
      },
    },
    proposal: {
      on: {
        ACCEPT_PROPOSAL: "booked",
        MARK_LOST: "lost",
        REVISE: "qualified",
      },
    },
    booked: {
      type: "final",
    },
    lost: {
      type: "final",
    },
  },
});

export type LeadEvent =
  | { type: "CONTACT" }
  | { type: "QUALIFY" }
  | { type: "SEND_PROPOSAL" }
  | { type: "ACCEPT_PROPOSAL" }
  | { type: "REVISE" }
  | { type: "MARK_LOST" }
  | { type: "BACK_TO_NEW" }
  | { type: "BACK_TO_CONTACTED" };
