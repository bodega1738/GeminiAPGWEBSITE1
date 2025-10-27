import { createMachine, assign } from "xstate";

/**
 * Booking Workflow State Machine
 * Manages booking creation with conflict detection and resolution
 * Prevents booking without availability checks
 */
export const bookingMachine = createMachine({
  id: "booking",
  initial: "configuring",
  context: {
    bookingId: null as string | null,
    shipId: null as string | null,
    startTime: null as number | null,
    endTime: null as number | null,
    conflicts: [] as string[],
    alternativeShips: [] as string[],
  },
  states: {
    configuring: {
      on: {
        CHECK_AVAILABILITY: "checkingAvailability",
        CANCEL: "cancelled",
      },
    },
    checkingAvailability: {
      on: {
        AVAILABLE: "confirmed",
        CONFLICT_DETECTED: {
          target: "conflictDetected",
          actions: assign({
            conflicts: ({ event }) => event.conflicts,
            alternativeShips: ({ event }) => event.alternativeShips || [],
          }),
        },
        ERROR: "failed",
      },
    },
    conflictDetected: {
      on: {
        SELECT_ALTERNATIVE_SHIP: {
          target: "checkingAvailability",
          actions: assign({
            shipId: ({ event }) => event.shipId,
            conflicts: [],
          }),
        },
        SELECT_ALTERNATIVE_TIME: {
          target: "checkingAvailability",
          actions: assign({
            startTime: ({ event }) => event.startTime,
            endTime: ({ event }) => event.endTime,
            conflicts: [],
          }),
        },
        CANCEL: "cancelled",
      },
    },
    confirmed: {
      on: {
        START_CHARTER: "active",
        CANCEL: "cancelled",
      },
    },
    active: {
      on: {
        COMPLETE_CHARTER: "completed",
        CANCEL_ACTIVE: "cancelled",
      },
    },
    completed: {
      type: "final",
    },
    cancelled: {
      type: "final",
    },
    failed: {
      on: {
        RETRY: "configuring",
        CANCEL: "cancelled",
      },
    },
  },
});

export type BookingEvent =
  | { type: "CHECK_AVAILABILITY" }
  | { type: "AVAILABLE" }
  | { type: "CONFLICT_DETECTED"; conflicts: string[]; alternativeShips?: string[] }
  | { type: "SELECT_ALTERNATIVE_SHIP"; shipId: string }
  | { type: "SELECT_ALTERNATIVE_TIME"; startTime: number; endTime: number }
  | { type: "START_CHARTER" }
  | { type: "COMPLETE_CHARTER" }
  | { type: "CANCEL" }
  | { type: "CANCEL_ACTIVE" }
  | { type: "ERROR" }
  | { type: "RETRY" };
