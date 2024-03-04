import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql/index.js';
import prismaClient from './prisma.js';
import { UserType } from './types/user.js';
import { Member, Post, Profile, User } from './interfaces.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberType, MemberTypeId } from './types/member.js';

export const Query = new GraphQLObjectType({
  name: 'Query',

  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: User) =>
        await prismaClient.user.findFirst({ where: { id } }),
    },

    users: {
      type: new GraphQLList(UserType),
      resolve: async () => await prismaClient.user.findMany(),
    },

    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: Post) =>
        await prismaClient.post.findFirst({ where: { id } }),
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async () => await prismaClient.post.findMany(),
    },

    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      resolve: async (_parent, { id }: Profile) =>
        await prismaClient.profile.findFirst({ where: { id } }),
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async () => await prismaClient.profile.findMany({}),
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_parent, { id }: Member) =>
        await prismaClient.memberType.findFirst({ where: { id } }),
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async () => await prismaClient.memberType.findMany(),
    },
  }),
});
