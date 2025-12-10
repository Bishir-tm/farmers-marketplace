/**
 * Simple observable service to manage global loading state.
 * This allows us to trigger the loader from non-React files (like axios interceptors)
 * without complex context passing or ejecting configs.
 */

let isLoading = false;
let listeners = [];

export const loadingService = {
  getIsLoading: () => isLoading,

  setIsLoading: (loading) => {
    isLoading = loading;
    listeners.forEach((listener) => listener(isLoading));
  },

  subscribe: (listener) => {
    listeners.push(listener);
    // Return unsubscribe function
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};
