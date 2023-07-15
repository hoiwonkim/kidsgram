// ./src/apollo.ts
// import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { createUploadLink } from 'apollo-upload-client';
// import { setContext } from '@apollo/client/link/context';

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('accessToken');

//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// const uploadLink = createUploadLink({
//   uri: 'http://localhost:4000/graphql',
// });

// const client = new ApolloClient({
//   link: authLink.concat(uploadLink),
//   cache: new InMemoryCache(),
// });

// export default client;




// ./src/apollo.ts
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem('accessToken'), // 인증 토큰을 저장하는 로컬스토리지 키를 사용하십시오.
    },
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
