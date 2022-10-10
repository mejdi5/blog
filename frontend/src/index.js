import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { UserContextProvider } from './context/UserContext';
import { LoadingContextProvider } from './context/LoadingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
  <UserContextProvider>
    <LoadingContextProvider>
      <AuthContextProvider>
        <App/>
      </AuthContextProvider>
    </LoadingContextProvider>
  </UserContextProvider>
</React.StrictMode>
);


