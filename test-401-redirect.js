/**
 * Test script to simulate 401 error and check redirect behavior
 */

// Simulate the API client clearing token and emitting event
function simulate401() {
  console.log('Simulating 401 error...');
  
  // Clear token (this would be done by apiClient)
  console.log('Token cleared');
  
  // Emit custom event (this is now added in apiClient)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:401'));
    console.log('Event auth:401 emitted');
  }
}

// Test if we're on a protected route
function checkCurrentRoute() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const currentRoute = segments.join('/');
  const protectedRoutes = ['(tabs)', 'settings', 'index', 'acquisition-systems', 'admin', 'user'];
  
  const isProtected = protectedRoutes.some((r) => currentRoute.includes(r) || currentRoute.endsWith(r));
  console.log(`Current route: ${currentRoute}`);
  console.log(`Is protected: ${isProtected}`);
  
  return isProtected;
}

console.log('401 Redirect Test Script Loaded');
console.log('Current URL:', window.location.href);
console.log('Route check:', checkCurrentRoute());

// Add to window for manual testing
window.simulate401 = simulate401;
window.checkCurrentRoute = checkCurrentRoute;

console.log('Test functions available in window:');
console.log('- window.simulate401() to simulate 401 error');
console.log('- window.checkCurrentRoute() to check if current route is protected');