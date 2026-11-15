export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function isStrongPassword(value) {
  return typeof value === 'string'
    && value.length >= 8
    && /[A-Za-z]/.test(value)
    && /\d/.test(value);
}

export function isValidDateRange(startDate, dueDate) {
  return !startDate || !dueDate || dueDate >= startDate;
}

export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}
