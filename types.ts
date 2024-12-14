import { ObjectId,OptionalId } from "mongodb";

export type StudentModel = OptionalId<{
  name: string;
  email: string;
  enrolledCourses:ObjectId[];
}>;

export type Student = {
  id: string;
  name: string;
  email: string;
  enrolledCourses:Course[];
};

export type TeacherModel = OptionalId<{
    name: string;
    email: string;
    coursesTaught: ObjectId[];
  }>;

export type Teacher ={
    id: string;
    name: string;
    email: string;
    coursesTaught: Course[];
}

export type CourseModel = OptionalId<{
    title: string;
    description: string;
    teacherId: ObjectId;
    studentIds: ObjectId[];
    
  }>;

export type Course ={
    id: string;
    title: string;
    description: string;
    teacherId: string;
    students: Student[];
}
