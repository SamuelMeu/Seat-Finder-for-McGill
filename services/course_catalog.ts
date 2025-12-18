/**
 * Scrape McGill's course catalog to find course codes.
 */
import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

// Constants
const URL = "https://coursecatalogue.mcgill.ca/courses/"

/**
 * @param key Course code and number (e.g. comp 202)
 * @param title Course title (e.g. Foundations of Programming)
 */
interface Course {
    key: string, 
    title: string
}

/**
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

