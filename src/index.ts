import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async function () {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  //   const post: Post = orm.em.create(Post, { title: "First post" });
  //   await orm.em.persistAndFlush(post);

  const postId1 = await orm.em.find(Post, { id: 1 });
  const posts = await orm.em.find(Post, {});

  console.log(posts);
  console.log("===============POSTS WITH ID 1==============");
  console.log(postId1);
};

main().catch((err) => {
  console.error(err);
});
