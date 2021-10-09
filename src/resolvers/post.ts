import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  // Fetchall
  @Query(() => [Post])
  posts(@Ctx() ctx: MyContext): Promise<Post[]> {
    // return em.find(Post, {}); if destructor ctx to { em }, which is convinient
    return ctx.em.find(Post, {});
  }

  // Fetchone
  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number, @Ctx() ctx: MyContext): Promise<Post | null> {
    // return ctx.em.findOne(Post, { id: id }); below is the kinda short way
    return ctx.em.findOne(Post, { id });
  }

  // Create
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post> {
    // const post: Post = ctx.em.create(Post, { title: title });
    const post: Post = ctx.em.create(Post, { title });
    await ctx.em.persistAndFlush(post);
    return post;
  }

  // Update
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const post: Post | null = await ctx.em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await ctx.em.persistAndFlush(post);
    }
    return post;
  }

  // Update
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number, @Ctx() ctx: MyContext) {
    const post = await ctx.em.findOne(Post, { id });
    if (!post) {
      return false;
    }
    await ctx.em.nativeDelete(Post, { id });
    return true;
  }
}
