// Generate a future date for expiry
const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const stubTodos = [
  {
    id: 1,
    title: 'Complete project documentation',
    completed: false,
    expiryDate: getFutureDate(5),
  },
  {
    id: 2,
    title: 'Review pull requests',
    completed: true,
    expiryDate: getFutureDate(2),
  },
  {
    id: 3,
    title: 'Update dependencies',
    completed: true,
    expiryDate: getFutureDate(7),
  },
  {
    id: 4,
    title: 'Write unit tests',
    completed: false,
    expiryDate: getFutureDate(3),
  },
]; 