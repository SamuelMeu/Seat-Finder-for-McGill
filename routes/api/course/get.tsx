import { getCourseInfo } from "../../../services/vsb.ts"
import { define } from "../../../utils.ts"

export const handler = define.handlers({
   async GET(ctx) {
        const url = new URL(ctx.url)
        const q = url.searchParams.get('q')?.trim() || ""
        const t = url.searchParams.get('t')?.trim() || ""

        try {
            const courses = await getCourseInfo(q, t)
            return new Response(
                JSON.stringify(courses), 
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        } catch (err) {
            const error = err as Error
            return new Response(error.message, {status: 500})        
        }
    },
})