import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, isStrongPassword, isValidDateRange, isRequired } from '../src/utils/validators.js';

test('email validation accepts a normal address and rejects malformed values', () => {
  assert.equal(isValidEmail('person@example.com'), true);
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail('   '), false);
});

test('password validation requires length, a letter, and a digit', () => {
  assert.equal(isStrongPassword('Taskflow2026'), true);
  assert.equal(isStrongPassword('short1'), false);
  assert.equal(isStrongPassword('passwordonly'), false);
});

test('date validation permits missing dates and rejects due dates before start', () => {
  assert.equal(isValidDateRange('', '2026-11-14'), true);
  assert.equal(isValidDateRange('2026-11-14', '2026-11-14'), true);
  assert.equal(isValidDateRange('2026-11-15', '2026-11-14'), false);
});

test('required validation rejects blank input', () => {
  assert.equal(isRequired('value'), true);
  assert.equal(isRequired('  '), false);
  assert.equal(isRequired(null), false);
});
