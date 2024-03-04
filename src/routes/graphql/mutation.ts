import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import {
  ChangePost,
  ChangeProfile,
  ChangeUser,
  CreatePost,
  CreateProfile,
  CreateUser,
  Post,
  Profile,
  User,
  UserSubscribedTo,
} from './interfaces.js';
import prismaClient from './prisma.js';
import { UUIDType } from './types/uuid.js';
import { ChangeUserInputType, CreateUserInputType, UserType } from './types/user.js';
import { ChangePostInputType, CreatePostInputType, PostType } from './types/post.js';
import {
  ChangeProfileInputType,
  CreateProfileInputType,
  ProfileType,
} from './types/profile.js';

export const Mutations = new GraphQLObjectType({
  name: 'Mutation',

  fields: () => ({
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: { dto: { type: new GraphQLNonNull(CreatePostInputType) } },
      resolve: async (_parent, { dto }: CreatePost) =>
        await prismaClient.post.create({ data: dto }),
    },

    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (_parent, { id, dto }: ChangePost) =>
        await prismaClient.post.update({ where: { id }, data: dto }),
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: Post) => {
        try {
          await prismaClient.post.delete({ where: { id } });
        } catch (err) {
          return false;
        }

        return true;
      },
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: { dto: { type: new GraphQLNonNull(CreateProfileInputType) } },
      resolve: async (_parent, { dto }: CreateProfile) =>
        await prismaClient.profile.create({ data: dto }),
    },

    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (_parent, { id, dto }: ChangeProfile) =>
        await prismaClient.profile.update({ where: { id }, data: dto }),
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: Profile) => {
        try {
          await prismaClient.profile.delete({ where: { id } });
        } catch (err) {
          return false;
        }

        return true;
      },
    },

    createUser: {
      type: new GraphQLNonNull(UserType),
      args: { dto: { type: new GraphQLNonNull(CreateUserInputType) } },
      resolve: async (_parent, { dto }: CreateUser) =>
        await prismaClient.user.create({ data: dto }),
    },

    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (_parent, { id, dto }: ChangeUser) =>
        await prismaClient.user.update({ where: { id: id }, data: dto }),
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: User) => {
        try {
          await prismaClient.user.delete({ where: { id: id } });
        } catch (err) {
          return false;
        }

        return true;
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(UserType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { userId, authorId }: UserSubscribedTo) => {
        await prismaClient.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId: authorId },
        });

        return await prismaClient.user.findFirst({ where: { id: userId } });
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { userId, authorId }: UserSubscribedTo) => {
        try {
          await prismaClient.subscribersOnAuthors.deleteMany({
            where: { subscriberId: userId, authorId: authorId },
          });
        } catch {
          return false;
        }

        return true;
      },
    },
  }),
});
