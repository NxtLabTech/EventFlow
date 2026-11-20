const test = require('node:test');
const assert = require('node:assert');
const { validateCapacity, validateEventInput } = require('../src/services/validation');

test('validateCapacity: rejects empty values', () => {
  for (const emptyVal of [undefined, null, '', '   ', '\t\n']) {
    const errors = {};
    const value = {};
    validateCapacity(emptyVal, errors, value);
    assert.strictEqual(errors.capacity, 'Capacity is required', `Expected required error for ${JSON.stringify(emptyVal)}`);
    assert.strictEqual(value.capacity, undefined);
  }
});

test('validateCapacity: rejects zero capacity', () => {
  for (const zeroVal of [0, '0', '  0  ']) {
    const errors = {};
    const value = {};
    validateCapacity(zeroVal, errors, value);
    assert.strictEqual(errors.capacity, 'Capacity must be greater than 0', `Expected greater than 0 error for ${JSON.stringify(zeroVal)}`);
    assert.strictEqual(value.capacity, undefined);
  }
});

test('validateCapacity: rejects negative capacity', () => {
  for (const negVal of [-1, -100, '-5', '  -10  ']) {
    const errors = {};
    const value = {};
    validateCapacity(negVal, errors, value);
    assert.strictEqual(errors.capacity, 'Capacity must be greater than 0', `Expected greater than 0 error for ${JSON.stringify(negVal)}`);
    assert.strictEqual(value.capacity, undefined);
  }
});

test('validateCapacity: rejects non-numeric values', () => {
  for (const nonNum of ['abc', '12abc', 'abc12', true, false, {}, [], [5], NaN, Infinity, -Infinity]) {
    const errors = {};
    const value = {};
    validateCapacity(nonNum, errors, value);
    assert.strictEqual(errors.capacity, 'Capacity must be a valid number', `Expected valid number error for ${JSON.stringify(nonNum)}`);
    assert.strictEqual(value.capacity, undefined);
  }
});

test('validateCapacity: rejects non-integer values', () => {
  for (const floatVal of [1.5, 10.25, '3.14', '0.5']) {
    const errors = {};
    const value = {};
    validateCapacity(floatVal, errors, value);
    if (floatVal === '0.5') {
      assert.strictEqual(errors.capacity, 'Capacity must be a whole number');
    } else {
      assert.strictEqual(errors.capacity, 'Capacity must be a whole number');
    }
    assert.strictEqual(value.capacity, undefined);
  }
});

test('validateCapacity: accepts valid positive numbers', () => {
  for (const [input, expected] of [[1, 1], [50, 50], [1000, 1000], ['1', 1], ['50', 50], ['  100  ', 100]]) {
    const errors = {};
    const value = {};
    validateCapacity(input, errors, value);
    assert.strictEqual(errors.capacity, undefined, `Expected no error for ${JSON.stringify(input)}`);
    assert.strictEqual(value.capacity, expected);
  }
});

test('validateEventInput: validates capacity integrated with event', () => {
  const baseEvent = {
    title: 'Tech Meetup',
    location: 'Building A',
    organizer: 'Community',
    date: '2026-12-01',
    time: '14:00',
  };

  const resZero = validateEventInput({ ...baseEvent, capacity: 0 });
  assert.strictEqual(resZero.errors.capacity, 'Capacity must be greater than 0');

  const resNeg = validateEventInput({ ...baseEvent, capacity: -5 });
  assert.strictEqual(resNeg.errors.capacity, 'Capacity must be greater than 0');

  const resNonNum = validateEventInput({ ...baseEvent, capacity: 'foo' });
  assert.strictEqual(resNonNum.errors.capacity, 'Capacity must be a valid number');

  const resEmpty = validateEventInput({ ...baseEvent, capacity: '' });
  assert.strictEqual(resEmpty.errors.capacity, 'Capacity is required');

  const resValid = validateEventInput({ ...baseEvent, capacity: '10' });
  assert.strictEqual(resValid.errors.capacity, undefined);
  assert.strictEqual(resValid.value.capacity, 10);
});
