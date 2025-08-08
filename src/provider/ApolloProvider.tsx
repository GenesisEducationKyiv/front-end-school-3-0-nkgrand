import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// eslint-disable-next-line react-refresh/only-export-components
export const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
});

export const MyApolloProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <ApolloProvider client={client}>{children}</ApolloProvider>;
