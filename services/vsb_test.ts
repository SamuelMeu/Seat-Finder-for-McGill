import { getCourseInfo } from "./vsb.ts";

Deno.test("Get and verify comp202 course info", async () => {
    const info = await getCourseInfo('COMP-202', '202601')
    console.log(info)
})


Deno.test("Return an error when given wrong info", async () => {
    try {
        await getCourseInfo('CC-2', '202601')
        throw new Error("Error was expected")
    } catch(err) {
        const error = err as Error
        if (error.message != "\"CC-2\" could not be found in any enabled term.") {
            console.log(error.message)
            throw new Error(`Unexpected error`)
        }
    }
})