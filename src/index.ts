import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
var cors = require("cors");

const main = async function () {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 90, // 3 months
        httpOnly: true,
        sameSite: "none", // csrf
        secure: true, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "somerandomsecretkeysdkjala",
      resave: false,
    })
  );
  app.use(
    cors({ credentials: true, origin: "https://studio.apollographql.com" })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();

  // app.use(function (_, res, next) {
  //   // Website you wish to allow to connect
  //   res.setHeader(
  //     "Access-Control-Allow-Origin",
  //     "https://studio.apollographql.com"
  //   );

  //   // Set to true if you need the website to include cookies in the requests sent
  //   // to the API (e.g. in case you use sessions)
  //   res.setHeader("Access-Control-Allow-Credentials", "true");

  //   // Pass to next layer of middleware
  //   next();
  // });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Running in port 4000");
  });
};

main().catch((err) => {
  console.error(err);
});
