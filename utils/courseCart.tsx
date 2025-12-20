import { signal } from "@preact/signals";
import { Course, CourseSubscription } from "../services/db.ts";

export const selectedTerm = signal<string>()
export const courseCart = signal<CourseSubscription[]>([])
export const selectedCourse = signal<Course>()
export const openCourseForm = signal(false)