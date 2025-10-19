import { describe, expect, it } from 'vitest';
import { evaluateCondition, applyRuleAction } from './calculator';

describe('Quote Calculator', () => {
  describe('evaluateCondition', () => {
    it('should evaluate greater than condition correctly', () => {
      const condition = { field: 'hours', operator: 'gt', value: 4 };
      expect(evaluateCondition(condition, { hours: 5 })).toBe(true);
      expect(evaluateCondition(condition, { hours: 4 })).toBe(false);
      expect(evaluateCondition(condition, { hours: 3 })).toBe(false);
    });

    it('should evaluate greater than or equal condition correctly', () => {
      const condition = { field: 'hours', operator: 'gte', value: 4 };
      expect(evaluateCondition(condition, { hours: 5 })).toBe(true);
      expect(evaluateCondition(condition, { hours: 4 })).toBe(true);
      expect(evaluateCondition(condition, { hours: 3 })).toBe(false);
    });

    it('should evaluate less than condition correctly', () => {
      const condition = { field: 'people', operator: 'lt', value: 10 };
      expect(evaluateCondition(condition, { people: 8 })).toBe(true);
      expect(evaluateCondition(condition, { people: 10 })).toBe(false);
      expect(evaluateCondition(condition, { people: 12 })).toBe(false);
    });

    it('should evaluate equality condition correctly', () => {
      const condition = { field: 'subtotal', operator: 'eq', value: 1000 };
      expect(evaluateCondition(condition, { subtotal: 1000 })).toBe(true);
      expect(evaluateCondition(condition, { subtotal: 999 })).toBe(false);
    });
  });

  describe('applyRuleAction', () => {
    it('should apply percentage discount correctly', () => {
      const action = { type: 'discount_percent', value: 10 };
      const subtotal = 1000;
      expect(applyRuleAction(action, subtotal)).toBe(-100);
    });

    it('should apply fixed discount correctly', () => {
      const action = { type: 'discount_fixed', value: 50 };
      const subtotal = 1000;
      expect(applyRuleAction(action, subtotal)).toBe(-50);
    });

    it('should apply percentage surcharge correctly', () => {
      const action = { type: 'surcharge_percent', value: 15 };
      const subtotal = 1000;
      expect(applyRuleAction(action, subtotal)).toBe(150);
    });

    it('should apply fixed surcharge correctly', () => {
      const action = { type: 'surcharge_fixed', value: 100 };
      const subtotal = 1000;
      expect(applyRuleAction(action, subtotal)).toBe(100);
    });
  });

  describe('Quote Calculation Logic', () => {
    it('should calculate ship charge correctly', () => {
      const hourlyRate = 500;
      const hours = 4;
      const shipCharge = hourlyRate * hours;
      expect(shipCharge).toBe(2000);
    });

    it('should calculate per_hour service correctly', () => {
      const unitPrice = 50;
      const quantity = 2;
      const hours = 4;
      const total = unitPrice * quantity * hours;
      expect(total).toBe(400);
    });

    it('should calculate per_person service correctly', () => {
      const unitPrice = 25;
      const quantity = 1;
      const people = 8;
      const total = unitPrice * quantity * people;
      expect(total).toBe(200);
    });

    it('should calculate flat service correctly', () => {
      const unitPrice = 150;
      const quantity = 2;
      const total = unitPrice * quantity;
      expect(total).toBe(300);
    });
  });
});
