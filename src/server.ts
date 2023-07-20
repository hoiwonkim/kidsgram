// ./src/server.ts
// import "dotenv/config";
// import express, { Express } from "express";
// import morgan from "morgan";
// import prisma from "./prisma";
// import schema from "./schema";
// import { User } from "@prisma/client";
// import { createServer, Server } from "http";
// import { execute, subscribe } from "graphql";
// import { graphqlUploadExpress } from "graphql-upload";
// import { ApolloServer, ExpressContext } from "apollo-server-express";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
// import { ConnectionContext, SubscriptionServer } from "subscriptions-transport-ws";
// import { handleGetLoggedInUser, handleCheckLogin } from "./users/users.utils";
// import cors from "cors";

// interface ConnectionParams {
//   token?: string;
//   "content-type"?: string;
// }

// const startServer = async (): Promise<void> => {
//   const app: Express = express();
//   app.use(cors()); // Add cors middleware
//   app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
//   app.use(morgan("dev"));
//   app.use("/uploads", express.static("uploads"));

//   const httpServer: Server = createServer(app);
//   const subscriptionServer: SubscriptionServer = SubscriptionServer.create(
//     {
//       schema,
//       execute,
//       subscribe,
//       async onConnect({ token }: ConnectionParams, webSocket: any, context: ConnectionContext) {
//         if (token === undefined) {
//           throw new Error("Could not connect to Subscription Server because the token does not exist.");
//         }
//         const foundUser: User | null = await handleGetLoggedInUser(token);
//         return { loggedInUser: foundUser };
//       },
//       onDisconnect(webSocket: any, context: ConnectionContext) {},
//     },
//     { server: httpServer, path: "/graphql" }
//   );
//   const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
//     schema,
//     context: async ({ req }) => {
//       const foundUser: User | null = await handleGetLoggedInUser(req.headers.token as string | undefined);
//       return { prisma, loggedInUser: foundUser, handleCheckLogin };
//     },
//     introspection: true,
//     plugins: [
//       ApolloServerPluginLandingPageGraphQLPlayground(),
//       {
//         async serverWillStart() {
//           return {
//             async drainServer() {
//               subscriptionServer.close();
//             },
//           };
//         },
//       },
//     ],
//   });
//   await apolloServer.start();
//   apolloServer.applyMiddleware({ app });
//   httpServer.listen(process.env.PORT, () => console.log(`🚀 Server: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`));
// };

// startServer();


import "dotenv/config";
import express, { Express } from "express";
import morgan from "morgan";
import prisma from "./prisma";
import schema from "./schema";
import { User } from ".prisma/client";
import { createServer, Server } from "http";
import { execute, subscribe } from "graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ConnectionContext, SubscriptionServer } from "subscriptions-transport-ws";
import { handleGetLoggedInUser, handleCheckLogin } from "./users/users.utils";

interface ConnectionParams {
  token?: string;
  "content-type"?: string;
}

const startServer = async (): Promise<void> => {
  const app: Express = express();
  app.use(graphqlUploadExpress());
  app.use(morgan("dev"));
  app.use("/uploads", express.static("uploads"));

  const httpServer: Server = createServer(app);
  const subscriptionServer: SubscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect({ token }: ConnectionParams, webSocket: any, context: ConnectionContext) {
        if (token === undefined) {
          throw new Error("토큰이 존재하지 않기 때문에 Subscription Server에 연결할 수 없습니다.");
        }
        const foundUser: User | null = await handleGetLoggedInUser(token);
        return { loggedInUser: foundUser };
      },
      onDisconnect(webSocket: any, context: ConnectionContext) {},
    },
    { server: httpServer, path: "/graphql" }
  );
  const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const foundUser: User | null = await handleGetLoggedInUser(req.headers.token);
      return { prisma, loggedInUser: foundUser, handleCheckLogin };
    },
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground,
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  httpServer.listen(process.env.PORT, () => console.log(`🚀 Server: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`));
};

startServer();