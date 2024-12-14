import type {
  Student,
  StudentModel,
  Teacher,
  TeacherModel,
  Course,
  CourseModel,
} from "./types.ts";
import { Collection } from "mongodb";

export const fromModelToCourse = async (
  course: CourseModel,
  studentCollection: Collection<StudentModel>
): Promise<Course> => {
  const students = await studentCollection
    .find({ _id: { $in: course.studentIds } })
    .toArray();
  const studentsMap = await Promise.all(
    students.map((p) => ({
      id: p._id!.toString(),
      name: p.name,
      email: p.email,
      enrolledCourses: [],
    }))
  );
  return {
    id: course._id!.toString(),
    title: course.title,
    description: course.description,
    teacherId: course.teacherId.toString(),
    students: studentsMap,
  };
};

export const fromModelToStudent = async (
  student: StudentModel,
  courseCollection: Collection<CourseModel>
): Promise<Student> => {
  const courses = await courseCollection
    .find({ _id: { $in: student.enrolledCourses } })
    .toArray();

  const coursesMap = await Promise.all(
    courses.map((p) => ({
      id: p._id!.toString(),
      title: p.title,
      description: p.description,
      teacherId: p.teacherId!.toString(),
      students: [],
    }))
  );

  return {
    id: student._id!.toString(),
    name: student.name,
    email: student.email,
    enrolledCourses: coursesMap,
  };
};

export const fromModelToTeacher = async (
  teacher: TeacherModel,
  courseCollection: Collection<CourseModel>,
  studentCollection: Collection<StudentModel>
): Promise<Teacher> => {
  const courses = await courseCollection
    .find({ _id: { $in: teacher.coursesTaught } })
    .toArray();

  const coursesMap = await Promise.all(
    courses.map((course) => fromModelToCourse(course, studentCollection))
  );

  return {
    id: teacher._id!.toString(),
    name: teacher.name,
    email: teacher.email,
    coursesTaught: coursesMap,
  };
};
