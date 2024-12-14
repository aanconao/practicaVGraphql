import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { MongoClient } from "mongodb";
import { StudentModel,CourseModel,TeacherModel } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();
console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("School");
const StudentCollection = mongoDB.collection<StudentModel>("students");
const CourseCollection = mongoDB.collection<CourseModel>("students");
const TeacherCollection = mongoDB.collection<TeacherModel>("teacher");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  
  context: async () => ({ StudentCollection,CourseCollection,TeacherCollection }),
});

console.info(`Server ready at ${url}`);