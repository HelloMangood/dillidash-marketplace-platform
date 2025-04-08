<?xml version="1.0" encoding="UTF-8"?>
<code language="javascript">
// frontend/src/App.jsx
import React, { Component, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Title, Text, Alert, Loader, Center } from '@mantine/core';

// --- Page Component Imports ---
// Using React.lazy for potential code splitting, though not strictly required for MVP.
// A simple loading fallback using Mantine Loader is provided via Suspense.
const HomePage = React.lazy(() => import('./pages/HomePage.jsx'));
const StorePage = React.lazy(() => import('./pages/StorePage.jsx'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage.jsx'));
const StoreAdminPage = React.lazy(() => import('./pages/StoreAdminPage.jsx'));

// --- Basic ErrorBoundary Placeholder ---
// A real implementation would use componentDidCatch or getDerivedStateFromError
// and potentially log errors to a service. This is a structural placeholder.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    // Log basic info for MVP development purposes
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI using Mantine components
      return (
        <Alert title="Application Error" color="red" radius="md" withCloseButton={false} mt="xl">
          <Text c="red">
            Sorry, something went wrong while rendering this part of the application.
            Please try refreshing the page.
          </Text>
          {/* Optionally display more details in development */}
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          )}
        </Alert>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}


// --- Loading Fallback Component ---
const LoadingFallback = () => (
  <Center style={{ height: '80vh' }}>
    <Loader color="blue" />
  </Center>
);


// --- Not Found Page Component ---
const NotFoundPage = () => (
  <Container>
    <Title order={2} ta="center" mt="xl">404 - Page Not Found</Title>
    <Text ta="center" mt="sm">
      The page you are looking for does not exist or has been moved.
    </Text>
    {/* Consider adding a Link back to the home page */}
    {/* <Button component={Link} to="/" mt="md">Go Home</Button> */}
  </Container>
);


// --- Main Application Component ---
function App() {
  return (
    // Basic layout wrapper providing consistent padding and size constraints
    <Container size="xl" py="md">
      {/* Wrap routes in ErrorBoundary to catch rendering errors */}
      <ErrorBoundary>
        {/* Suspense is needed for React.lazy components */}
        <Suspense fallback={<LoadingFallback />}>
          {/* Routes component manages the rendering based on URL path */}
          <Routes>
            {/* Route for the Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Route for viewing a specific Store's details and products */}
            {/* :storeId is a dynamic parameter captured by React Router */}
            <Route path="/store/:storeId" element={<StorePage />} />

            {/* Route for the Checkout Page */}
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Route for the Store Administration Page */}
            {/* :storeId is a dynamic parameter captured by React Router */}
            <Route path="/admin/store/:storeId" element={<StoreAdminPage />} />

            {/* Catch-all route for handling undefined paths (404 Not Found) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Container>
  );
}

// Export the App component as the default export
export default App;

</code>