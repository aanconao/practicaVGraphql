import { Collection, ObjectId } from "mongodb";
import { Student, StudentModel, Teacher, TeacherModel, Course, CourseModel } from "./types.ts";
import { fromModelToCourse, fromModelToStudent, fromModelToTeacher } from "./utils.ts";

export const resolvers = {
  Query: {
    students: async (
      _: unknown,
      __: unknown,

      context: {
        StudentCollection: Collection<StudentModel>;

        CourseCollection: Collection<CourseModel>;

      }
    ): Promise<Student[]> => {

      const studentsModel = await context.StudentCollection.find().toArray();

      return Promise.all(

        studentsModel.map((studentModel) =>
          fromModelToStudent(studentModel, context.CourseCollection)
        )
      );
    },

    student: async (

      _: unknown,

      { id }: { id: string },

      context: {
        StudentCollection: Collection<StudentModel>;
        CourseCollection: Collection<CourseModel>;
      }

    ): Promise<Student | null> => {

      const studentModel = await context.StudentCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!studentModel) {return null;}

      return fromModelToStudent(studentModel, context.CourseCollection);
    },

    teachers: async (
      _: unknown,
      __: unknown,

      context: {

        TeacherCollection: Collection<TeacherModel>;
        CourseCollection: Collection<CourseModel>;
        StudentCollection: Collection<StudentModel>;

      }
    ): Promise<Teacher[]> => {

      const teachersModel = await context.TeacherCollection.find().toArray();

      return Promise.all(
        teachersModel.map((teacherModel) =>
          fromModelToTeacher(
            teacherModel,
            context.CourseCollection,
            context.StudentCollection
          )
        )
      );
    },

    teacher: async (
      _: unknown,
      { id }: { id: string },
      context: {
        TeacherCollection: Collection<TeacherModel>;
        CourseCollection: Collection<CourseModel>;
        StudentCollection: Collection<StudentModel>;
      }
    ): Promise<Teacher | null> => {

      const teacherModel = await context.TeacherCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!teacherModel) {
        return null;
      }

      return fromModelToTeacher(

        teacherModel,
        context.CourseCollection,
        context.StudentCollection
      );
    },

    courses: async (
      _: unknown,
      __: unknown,
      context: {
        CourseCollection: Collection<CourseModel>;
        StudentCollection: Collection<StudentModel>;
      }
    ): Promise<Course[]> => {

      const coursesModel = await context.CourseCollection.find().toArray();

      return Promise.all(
        coursesModel.map((courseModel) =>
          fromModelToCourse(courseModel, context.StudentCollection)
        )
      );
    },

    course: async (
      _: unknown,
      { id }: { id: string },
      context: {
        CourseCollection: Collection<CourseModel>;
        StudentCollection: Collection<StudentModel>;
      }
    ): Promise<Course | null> => {
      const courseModel = await context.CourseCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!courseModel) {
        return null;
      }

      return fromModelToCourse(courseModel, context.StudentCollection);
    },
  },

  Mutation: {

    createStudent: async (
      _: unknown,
      { name, email }: { name: string; email: string },
      context: { StudentCollection: Collection<StudentModel> }

    ): Promise<Student> => {

      const { insertedId } = await context.StudentCollection.insertOne({
        name,
        email,
        enrolledCourses: [],
      });

      return {
        id: insertedId.toString(),
        name,
        email,
        enrolledCourses: [],
      };
    },

    createTeacher: async (
      _: unknown,

      { name, email }: { name: string; email: string },
      context: { TeacherCollection: Collection<TeacherModel> }

    ): Promise<Teacher> => {
      const { insertedId } = await context.TeacherCollection.insertOne({
        name,
        email,

        coursesTaught:[],
      });
      return {


        id: insertedId.toString(),
        name,
        email,
        coursesTaught: [],
      };
    },

    createCourse: async (
      _: unknown,
      { title, description, teacherId }: { title: string; description: string; teacherId: string },
      context: { CourseCollection: Collection<CourseModel> }
    ): Promise<Course> => {

      const { insertedId } = await context.CourseCollection.insertOne({
        title,
        description,
        teacherId: new ObjectId(teacherId),
        studentIds: [],
      });



      return {
        id: insertedId.toString(),
        title,
        description,
        teacherId,
        students: [],
      };
    },

    deleteStudent: async (
      _: unknown,


      { id }: { id: string },
      context: {
        StudentCollection: Collection<StudentModel>;
        CourseCollection: Collection<CourseModel>;


      }
    ): Promise<boolean> => {
      const { deletedCount } = await context.StudentCollection.deleteOne({
        _id: new ObjectId(id),
      });

      return deletedCount > 0;
    },

    deleteTeacher: async (
      _: unknown,
      { id }: { id: string },

      context: {
        TeacherCollection: Collection<TeacherModel>;
        CourseCollection: Collection<CourseModel>;
      }
    ): Promise<boolean> => {


      const { deletedCount } = await context.TeacherCollection.deleteOne({
        _id: new ObjectId(id),
      });

      return deletedCount > 0;
    },

    deleteCourse: async (
      _: unknown,
      { id }: { id: string },
      context: { CourseCollection: Collection<CourseModel> }
    ): Promise<boolean> => {
      
      const { deletedCount } = await context.CourseCollection.deleteOne({

        _id: new ObjectId(id),
      });

      return deletedCount > 0;
    },
  },
};
