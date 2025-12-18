import { queryCourses } from "../../../services/db.ts";
import { define } from "../../../utils.ts"

export const handler = define.handlers({
   async GET(ctx) {
        const url = new URL(ctx.url)
        const q = url.searchParams.get('q')?.trim() || ""

        const courses = await queryCourses(q)

        return new Response(
            JSON.stringify(courses), 
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    },
})