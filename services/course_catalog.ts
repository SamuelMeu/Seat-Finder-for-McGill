/**
 * Scrape McGill's course catalog to find course codes.
 */
import { kv } from "./db.ts"
import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.56"

// Constants
const URL = "https://coursecatalogue.mcgill.ca/courses/"

/**
 * @param key Course code and number (e.g. comp 202)
 * @param title Course title (e.g. Foundations of Programming)
 */
export interface Course {
    key: string, 
    title: string
}

/**
 * Scrapes McGill's course catalog to return a list of all course keys and titles. 
 * @returns A list of all mcgill courses.
 */
export async function getCourses(): Promise<Course[]> {
    // Fetch McGill's course catalog
    const response = await fetch(URL, {
        headers: {
            "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
            "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        },
    })

    const html = await response.text()

    // Load in DOM
    const document = new DOMParser().parseFromString(html, 'text/html')

    // Create course list
    const list:Course[] = []

    const lis = document.getElementById('textcontainer')!.querySelectorAll('li')!
    for (const li of lis) {
        const course = li.querySelector('a')?.textContent
        const split = course?.split(" - ")
        list.push({
            key: split![0].toLowerCase(),
            title: split![1].toLowerCase()
        })
    }

    return list
}

/**
 * Updates the course list in the database.
 */
export async function updateCourses() {
    // Scrape courses
    const courses = await getCourses()

    // Create an atomic transaction
    let atomic = kv.atomic()

    let i = 0

    while (courses[0] != undefined) {
        i++
        const course = courses.pop()!

        /**
         * Set prefixes
         * Change in future for a tree like dataset with all possible searches to reduce db size.
         * Ex: (kv.get(query) => list of 10 items) much faster and smaller
         */
        const prefix = kv.atomic()

        let str = ""

        for (const letter of course.key) {
            str += letter
            prefix.set(["course-by-prefix", str, course.key], course)
        }

        await prefix.commit()

        // Populate course database
        atomic.set(["courses", course.key], course)

        if(i == 1000) {
            const commit = await atomic.commit()
            if (!commit.ok) {
                throw new Error("Error when commiting")
            }
            atomic = kv.atomic()
        }
    }
}

console.log("Updating course catalog...")
await updateCourses()
console.log("Done")