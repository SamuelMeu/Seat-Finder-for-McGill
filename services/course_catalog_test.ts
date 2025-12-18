import { getCourses } from "./course_catalog.ts";

Deno.test("Get Course List", async () => {
    const list = await getCourses()
    console.log(list[100])
})