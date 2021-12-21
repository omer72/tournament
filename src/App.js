import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Tournament from './components/tournament';

const queryClient = new QueryClient();

const App = function () {
  return (
    <QueryClientProvider client={queryClient}>
      <Tournament />
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};

export default App;
