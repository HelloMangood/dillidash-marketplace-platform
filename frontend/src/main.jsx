<?xml version="1.0" encoding="UTF-8"?><code language="javascript">
// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
// Import global styles required by Mantine
import '@mantine/core/styles.css';

import App from './App.jsx'; // The root application component
import { CartProvider } from './context/CartContext.jsx'; // Global cart state provider

// Identify the root DOM element
const rootElement = document.getElementById('root');

// Critical check: Ensure the root element exists before attempting to render
if (!rootElement) {
  throw new Error('Critical: Failed to find the root element. React application cannot mount.');
}

// Create a React root attached to the root DOM element
const root = ReactDOM.createRoot(rootElement);

// Render the application into the root
// Order of providers matters: Router needs to be outside Mantine for routing hooks in theme-dependent components,
// CartProvider should be inside MantineProvider if its components use Mantine, but generally can be either inside or outside Mantine.
// StrictMode helps catch potential problems in development.
root.render(
  &lt;React.StrictMode&gt;
    &lt;BrowserRouter&gt;
      &lt;MantineProvider /* defaultTheme */ &gt; {/* Applies Mantine theme and styles globally */}
        &lt;CartProvider&gt; {/* Provides global cart state */}
          &lt;App /&gt; {/* The main application component with routing */}
        &lt;/CartProvider&gt;
      &lt;/MantineProvider&gt;
    &lt;/BrowserRouter&gt;
  &lt;/React.StrictMode&gt;
);

</code>