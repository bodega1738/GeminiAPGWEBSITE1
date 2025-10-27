import { createMachine, assign } from "xstate";

/**
 * Yacht Fleet State Machine
 * Manages yacht availability, charters, maintenance, and repairs
 * Supports complex state transitions for yacht lifecycle management
 */
export const yachtMachine = createMachine({
  id: "yacht",
  initial: "available",
  context: {
    yachtId: null as string | null,
    charterId: null as string | null,
    maintenanceReason: null as string | null,
    repairDetails: null as string | null,
  },
  states: {
    available: {
      on: {
        BOOK_YACHT: {
          target: "chartered",
          actions: assign({
            charterId: ({ event }) => event.charterId,
          }),
        },
        SCHEDULE_MAINTENANCE: {
          target: "underMaintenance",
          actions: assign({
            maintenanceReason: ({ event }) => event.reason,
          }),
        },
        MARK_OFFLINE: "offline",
        RESERVE: "reserved",
      },
    },
    chartered: {
      on: {
        END_CHARTER: "needsCleaning",
        REPORT_MECHANICAL_ISSUE: {
          target: "needsRepair",
          actions: assign({
            repairDetails: ({ event }) => event.details,
          }),
        },
      },
    },
    needsCleaning: {
      on: {
        COMPLETE_CLEANING: "available",
        REPORT_MECHANICAL_ISSUE: {
          target: "needsRepair",
          actions: assign({
            repairDetails: ({ event }) => event.details,
          }),
        },
      },
    },
    underMaintenance: {
      on: {
        COMPLETE_MAINTENANCE: "available",
        REPORT_MECHANICAL_ISSUE: {
          target: "needsRepair",
          actions: assign({
            repairDetails: ({ event }) => event.details,
          }),
        },
      },
    },
    needsRepair: {
      on: {
        RESOLVE_ISSUE: "underMaintenance",
        DECLARE_OUT_OF_SERVICE: "outOfService",
      },
    },
    outOfService: {
      on: {
        REPAIR_COMPLETE: "underMaintenance",
      },
    },
    offline: {
      on: {
        BRING_ONLINE: "available",
      },
    },
    reserved: {
      on: {
        CONFIRM_BOOKING: "chartered",
        CANCEL_RESERVATION: "available",
      },
    },
  },
});

export type YachtEvent =
  | { type: "BOOK_YACHT"; charterId: string }
  | { type: "END_CHARTER" }
  | { type: "SCHEDULE_MAINTENANCE"; reason: string }
  | { type: "COMPLETE_MAINTENANCE" }
  | { type: "COMPLETE_CLEANING" }
  | { type: "REPORT_MECHANICAL_ISSUE"; details: string }
  | { type: "RESOLVE_ISSUE" }
  | { type: "DECLARE_OUT_OF_SERVICE" }
  | { type: "REPAIR_COMPLETE" }
  | { type: "MARK_OFFLINE" }
  | { type: "BRING_ONLINE" }
  | { type: "RESERVE" }
  | { type: "CONFIRM_BOOKING" }
  | { type: "CANCEL_RESERVATION" };
