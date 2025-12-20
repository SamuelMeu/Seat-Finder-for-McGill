/**
 * Service to handle interaction with the McGill Visual Schedule Builder
 */
import { XMLParser } from "npm:fast-xml-parser@5.3.3"

// Constants
const ENDPOINTS = {
    COURSE: "https://vsb.mcgill.ca/api/class-data"
}

// XMLParser for VSB
const parser = new XMLParser({
    ignoreAttributes: false, 
    parseAttributeValue: true,
    attributeNamePrefix: "@"
})


/**
 * @param type Is the section a lecture (Lec) or tutorial (Tut)
 * @param number The section's number (e.g. 1).
 * @param isFull True if the section is full.
 * @param openSeats The number of remaining seats.
 * @param credits The number of credits required by this section.
 * @param campus This section's location.
 */
export interface CourseSection {
    type: "Lec" | "Tut",
    number: number,
    isFull: boolean,
    openSeats: number,
    credits: number,
    campus: string,
}

/**
 * @param campuses A list of campuses this course is available at.
 * @param key A course's code + number (e.g. COMP-202).
 * @param code A course's code (e.g. COMP).
 * @param number A course's number (e.g. 202).
 * @param sections A list of the available course sections.
 */
export interface CourseInfo {
    campuses: string[],
    key: string,
    code: string,
    number: number,
    sections: CourseSection[]
}

/**
 * Fetches information about a specific course offered during a specific term.
 * 
 * @param course The course code and number.
 * @param term The term the course is offered in
 * @returns A promise that resolves to {@link CourseInfo}
 * @throws {Error} If the request fails
 */
export async function getCourseInfo(course: string, term: string): Promise<CourseInfo> {
    const url = new URL(ENDPOINTS.COURSE)

    // Append the correct time related parameters required by VSB
    const now: Date = new Date()
    const minutesSinceEpoch: number = now.getTime() / 60000
    const t: number = Math.floor(minutesSinceEpoch) % 1000
    url.searchParams.append('t', t.toString())

    const e: number = (t % 3) + (t % 39) + (t % 42)
    url.searchParams.append('e', e.toString())

    // Append the parameters related to the course
    url.searchParams.append('term', term)
    url.searchParams.append('course_0_0', course)

    // Fetch course data
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`VSB request failed with code ${response.status}`)
    }

    // Convert xml to js object
    const xml = await response.text()
    const obj = parser.parse(xml)

    if (obj.addcourse.errors.error != undefined) {
        throw new Error(obj.addcourse.errors.error)
    }

    const data = obj.addcourse.classdata

    // Make campus list
    const campuses: string[] = []
    for (const [key, value] of Object.entries(data.campus)) {
        if (key == "@n") {
            const name = value as string
            campuses.push(name)
        }
    }

    // Make section list
    const nblist:number[] = []
    const sections: CourseSection[] = []

    if (Array.isArray(data.course.uselection)) {
        for (const sec of data.course.uselection) {
            const section = sec.selection.block
            if (Array.isArray(section)) {
                for (const item of section) {
                    if (!nblist.includes(item["@secNo"])) {
                        nblist.push(item["@secNo"])
                        sections.push({
                            type: item["@type"],
                            isFull: item["@isFull"] == 0 ? false : true,
                            campus: item["@campus"],
                            number: item["@secNo"],
                            credits: item["@credits"],
                            openSeats: item["@nres"]
                        })
                    }
                }
            } else {
                sections.push({
                    type: section["@type"],
                    isFull: section["@isFull"] == 0 ? false : true,
                    campus: section["@campus"],
                    number: section["@secNo"],
                    credits: section["@credits"],
                    openSeats: section["@nres"]
                })
            }
        }
    } else {
        const section  = data.course.uselection.selection.block
        console.log(section)
        if (Array.isArray(section)) {
            for (const item of section) {
                if (!nblist.includes(item["@secNo"])) {
                    nblist.push(item["@secNo"])
                    sections.push({
                        type: item["@type"],
                        isFull: item["@isFull"] == 0 ? false : true,
                        campus: item["@campus"],
                        number: item["@secNo"],
                        credits: item["@credits"],
                        openSeats: item["@nres"]
                    })
                }
            }
        } else {
            sections.push({
                type: section["@type"],
                isFull: section["@isFull"] == 0 ? false : true,
                campus: section["@campus"],
                number: section["@secNo"],
                credits: section["@credits"],
                openSeats: section["@nres"]
            })
        }
    }

    return {
        campuses: campuses, 
        code: data.course["@code"],
        number: Number(data.course["@number"]),
        key: data.course["@key"],
        sections: sections
    }
}