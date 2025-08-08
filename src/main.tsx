import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { MyApolloProvider } from './provider/ApolloProvider';
import React from 'react';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <MyApolloProvider>
        <App />
      </MyApolloProvider>
    </React.StrictMode>
  );
} else {
  throw new Error('Root element not found');
}
