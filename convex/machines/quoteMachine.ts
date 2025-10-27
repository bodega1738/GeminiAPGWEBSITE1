import { createMachine, assign } from "xstate";

/**
 * Quote Generation State Machine
 * Manages quote creation, calculation, saving, and conversion to booking
 * Prevents saving uncalculated quotes or converting unsaved quotes
 */
export const quoteMachine = createMachine({
  id: "quote",
  initial: "configuring",
  context: {
    quoteId: null as string | null,
    shipId: null as string | null,
    hours: 0,
    people: 0,
    services: [] as Array<{ serviceId: string; quantity: number }>,
    calculation: null as any,
  },
  states: {
    configuring: {
      on: {
        SET_SHIP: {
          actions: assign({
            shipId: ({ event }) => event.shipId,
          }),
        },
        SET_DURATION: {
          actions: assign({
            hours: ({ event }) => event.hours,
            people: ({ event }) => event.people,
          }),
        },
        ADD_SERVICE: {
          actions: assign({
            services: ({ context, event }) => [
              ...context.services,
              { serviceId: event.serviceId, quantity: event.quantity },
            ],
          }),
        },
        REMOVE_SERVICE: {
          actions: assign({
            services: ({ context, event }) =>
              context.services.filter((s) => s.serviceId !== event.serviceId),
          }),
        },
        CALCULATE: "calculating",
      },
    },
    calculating: {
      on: {
        CALCULATION_COMPLETE: {
          target: "calculated",
          actions: assign({
            calculation: ({ event }) => event.calculation,
          }),
        },
        CALCULATION_ERROR: "configuring",
      },
    },
    calculated: {
      on: {
        SAVE: "saving",
        EDIT: "configuring",
      },
    },
    saving: {
      on: {
        SAVE_SUCCESS: {
          target: "saved",
          actions: assign({
            quoteId: ({ event }) => event.quoteId,
          }),
        },
        SAVE_ERROR: "calculated",
      },
    },
    saved: {
      on: {
        CONVERT_TO_BOOKING: "convertingToBooking",
        CREATE_NEW: "configuring",
        EDIT: "configuring",
      },
    },
    convertingToBooking: {
      on: {
        BOOKING_CREATED: "completed",
        BOOKING_ERROR: "saved",
      },
    },
    completed: {
      type: "final",
    },
  },
});

export type QuoteEvent =
  | { type: "SET_SHIP"; shipId: string }
  | { type: "SET_DURATION"; hours: number; people: number }
  | { type: "ADD_SERVICE"; serviceId: string; quantity: number }
  | { type: "REMOVE_SERVICE"; serviceId: string }
  | { type: "CALCULATE" }
  | { type: "CALCULATION_COMPLETE"; calculation: any }
  | { type: "CALCULATION_ERROR" }
  | { type: "SAVE" }
  | { type: "SAVE_SUCCESS"; quoteId: string }
  | { type: "SAVE_ERROR" }
  | { type: "EDIT" }
  | { type: "CONVERT_TO_BOOKING" }
  | { type: "BOOKING_CREATED" }
  | { type: "BOOKING_ERROR" }
  | { type: "CREATE_NEW" };
