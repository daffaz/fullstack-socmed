import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username length must be greater than 2",
          },
        ],
      };
    }

    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "password length must be greater than 2",
          },
        ],
      };
    }
    const hashedPassword: string = await argon2.hash(options.password);
    const user: User = ctx.em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    // Now checking if user already exist or not

    // There are multiple ways to check whether the user already registered or not, below is the example
    // we check if user with the username given is already in database or not

    // const userFound: User | null = await ctx.em.findOne(User, {
    //     username: options.username,
    //   });
    //   if (userFound) {
    //     return {
    //       errors: [
    //         {
    //           field: "username",
    //           message: "username already exists",
    //         },
    //       ],
    //     };
    //   }

    // The second solution is using try catch, but this works because we already setting up the database
    // to ensure that username is unique
    try {
      await ctx.em.persistAndFlush(user);
    } catch (error) {
      // Duplicate username error
      if (error.code === "ER_DUP_ENTRY") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    // store user id session
    // keep them logged in
    ctx.req.session.userId = user.id;
    return {
      user: user,
    };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    // If not log in (cookie user id not found)
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user: User | null = await em.findOne(User, {
      username: options.username,
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "username not found",
          },
        ],
      };
    }
    const validatePassword: boolean = await argon2.verify(
      user.password,
      options.password
    );

    if (!validatePassword) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    req.session.userId = user.id;
    return {
      user: user,
    };
  }
}
