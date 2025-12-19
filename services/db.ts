import { getCourses } from "./course_catalog.ts";

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


export interface Term {
    name: string, 
    code: string,
    id: number
}

/**
 * Get current terms
 */
export async function getTerms(): Promise<Term[]> {
    const entries = kv.list<Term>({
        prefix: ["terms"]
    })

    const terms:Term[] = []

    for await (const entry of entries) {
        terms.push({
            id: entry.key[1] as number,
            name: entry.value.name,
            code: entry.value.code
        })
    }

    return terms
}