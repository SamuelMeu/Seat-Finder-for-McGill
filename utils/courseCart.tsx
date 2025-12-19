import { signal } from "@preact/signals";
import { Course } from "../services/db.ts";

export const selectedTerm = signal<number>(0)
export const courseCart = signal<Course[]>([])
export const selectedCourse = signal<Course>()
export const openCourseForm = signal(false)