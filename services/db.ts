export const kv = await Deno.openKv("./data/db.sqlite")


export interface Course {
    key: string,
    title: string,
}

/**
 * Queries the DB for courses
 */
export async function queryCourses(q: string, limit = 10): Promise<Course[]> {
    // Normalize query
    const query = q.toLowerCase()

    // Get list
    const entries = kv.list<Course>({
        prefix: ["course-by-prefix", query]
    }, { limit: limit })

    // Format list
    const courses:Course[] = []

    for await (const entry of entries) {
        courses.push(entry.value)
    }

    return courses
}