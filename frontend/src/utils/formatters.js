export const formatDate = (value, options = { dateStyle: 'medium' }) => value ? new Intl.DateTimeFormat(undefined, options).format(new Date(value)) : '—';
export const formatDateTime = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
export const formatStatus = (value = '') => value.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
