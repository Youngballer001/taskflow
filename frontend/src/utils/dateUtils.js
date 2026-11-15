export const isOverdue = (dueDate, status, today = new Date()) => Boolean(dueDate && new Date(`${dueDate}T23:59:59`) < today && !['COMPLETED', 'CANCELLED'].includes(status));
export const daysUntil = (date, today = new Date()) => date ? Math.ceil((new Date(`${date}T00:00:00`) - new Date(today.toDateString())) / 86400000) : null;
