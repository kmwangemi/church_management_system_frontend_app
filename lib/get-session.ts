import { cache } from 'react';

// Next.js Server Actions/Components cannot access localStorage where the token is currently stored.
// Authentication is handled via client-side SessionLoader.
export const getServerSession = cache(async () => {
  return null;
});
