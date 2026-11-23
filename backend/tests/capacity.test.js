import { describe, it, expect } from 'vitest';
import { validateCapacity, validateEventInput } from '../src/services/validation.js';

describe('validateCapacity', () => {
  it('rejects empty values', () => {
    for (const emptyVal of [undefined, null, '', '   ', '\t\n']) {
      const errors = {};
      const value = {};
      validateCapacity(emptyVal, errors, value);
      expect(errors.capacity).toBe('Capacity is required');
      expect(value.capacity).toBeUndefined();
    }
  });

  it('rejects zero capacity', () => {
    for (const zeroVal of [0, '0', '  0  ']) {
      const errors = {};
      const value = {};
      validateCapacity(zeroVal, errors, value);
      expect(errors.capacity).toBe('Capacity must be greater than 0');
      expect(value.capacity).toBeUndefined();
    }
  });

  it('rejects negative capacity', () => {
    for (const negVal of [-1, -100, '-5', '  -10  ']) {
      const errors = {};
      const value = {};
      validateCapacity(negVal, errors, value);
      expect(errors.capacity).toBe('Capacity must be greater than 0');
      expect(value.capacity).toBeUndefined();
    }
  });

  it('rejects non-numeric values', () => {
    for (const nonNum of ['abc', '12abc', 'abc12', true, false, {}, [], [5], NaN, Infinity, -Infinity]) {
      const errors = {};
      const value = {};
      validateCapacity(nonNum, errors, value);
      expect(errors.capacity).toBe('Capacity must be a valid number');
      expect(value.capacity).toBeUndefined();
    }
  });

  it('rejects non-integer values', () => {
    for (const floatVal of [1.5, 10.25, '3.14', '0.5']) {
      const errors = {};
      const value = {};
      validateCapacity(floatVal, errors, value);
      expect(errors.capacity).toBe('Capacity must be a whole number');
      expect(value.capacity).toBeUndefined();
    }
  });

  it('accepts valid positive numbers', () => {
    for (const [input, expected] of [[1, 1], [50, 50], [1000, 1000], ['1', 1], ['50', 50], ['  100  ', 100]]) {
      const errors = {};
      const value = {};
      validateCapacity(input, errors, value);
      expect(errors.capacity).toBeUndefined();
      expect(value.capacity).toBe(expected);
    }
  });
});

describe('validateEventInput', () => {
  it('validates capacity integrated with event', () => {
    const baseEvent = {
      title: 'Tech Meetup',
      location: 'Building A',
      organizer: 'Community',
      date: '2026-12-01',
      time: '14:00',
    };

    const resZero = validateEventInput({ ...baseEvent, capacity: 0 });
    expect(resZero.errors.capacity).toBe('Capacity must be greater than 0');

    const resNeg = validateEventInput({ ...baseEvent, capacity: -5 });
    expect(resNeg.errors.capacity).toBe('Capacity must be greater than 0');

    const resNonNum = validateEventInput({ ...baseEvent, capacity: 'foo' });
    expect(resNonNum.errors.capacity).toBe('Capacity must be a valid number');

    const resEmpty = validateEventInput({ ...baseEvent, capacity: '' });
    expect(resEmpty.errors.capacity).toBe('Capacity is required');

    const resValid = validateEventInput({ ...baseEvent, capacity: '10' });
    expect(resValid.errors.capacity).toBeUndefined();
    expect(resValid.value.capacity).toBe(10);
  });
});
