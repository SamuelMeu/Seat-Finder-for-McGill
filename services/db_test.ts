import { queryCourses, kv } from "./db.ts";

Deno.test("Try to query courses", async () => {
    const courses = await queryCourses("com")
    console.log(courses)
})