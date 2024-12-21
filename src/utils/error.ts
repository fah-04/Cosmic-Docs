export function handleError(message: string, error: any): void {
  console.error(message, error);
  
  // You can add additional error handling here, like:
  // - Sending to an error tracking service
  // - Showing a toast notification
  // - Logging to a service
}