import { gql } from "apollo-server-express"
import db from "../database.js"
import Sequelize from "sequelize"

const typeDefs= gql`
    type Query {
        videos: [Video]
        video(id_video: String!): Video
        user(id_token: String!): User
        video5: [Video]
        videorand1: [Video]
    }
    type Video {
        id: ID!
        id_video: String!
        source: String!
        title: String!
        tag: String
        author_name: String!
        author_avatar: String!
        number_of_like: Int!
        number_of_dislike: Int!
        comment: String!
        number_of_comment: Int!
        number_of_view: Int!,
        imagesnapshot: String, 

    }
    type User {
        id_token: String!
        username: String!
        avatar: String
    }
    type Mutation {
        createUser (
            id_token: String!,
            username: String!,
            avatar: String
        ): User
        increment_like (
            number_of_like: Int!,
            id_video: String!
        ): Video
        decrement_like (
            number_of_dislike: Int!,
            id_video: String!
        ): Video
    }   
`

const resolvers= {
    Query: {
        videos: async ()=> db.short.findAll(),
        video: async (obj, args, context, info)=> {
            return await db.short.findOne({ where: { id_video: args.id_video } })
        },
        user: async (obj, args, context, info)=> {
            return await db.short.findOne({ where: { id_token: args.id_token } })
        },
        video5: async(obj, args, context, info)=> {
            return await db.short.findAll({ order: Sequelize.literal('rand()'), limit: 5 })
        },
        videorand1: async (abj, args, context, info)=> {
            return await db.short.findAll({ order: Sequelize.fn('RAND'), limit: 1 })
        }
        
    },
    Mutation: {
        createUser: async (root, args, context, info)=> {
            const user= await db.user.create({
                id_token: args.id_token,
                username: args.username,
                avatar: args.avatar
            })
            return user.save()
        },
        increment_like: async (root, args, context, info)=> {
            console.log(args)
            await db.short.update(
                { number_of_like: args.number_of_like, updatedAt: '1234',  },
                { where: { id_video: args.id_video}}
            )
            .then(()=> console.log(1))
            .catch((err)=> console.log(err))
        },
        decrement_like: async (root, args, context, info)=> {
            await db.short.update(
                {number_of_dislike: args.number_of_dislike, updatedAt: '1234'},
                {where: { id_video: args.id_video }}
            )
            .then(()=> console.log())
            .catch((err)=> console.log(err))
        }
    }
}

export { typeDefs, resolvers }