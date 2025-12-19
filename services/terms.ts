/**
 * For now, we will manually enter terms. Implement scrapping of VSB in the future.
 */

import { kv } from "./db.ts"

const terms = [
    {
        name: "Winter 2026",
        code: "202601",
    }
]

const atomic = kv.atomic() //not really usefull for only one term, but will be in future

let i = 0

for (const term of terms) {
    atomic.set(["terms", i], {
        name: term.name,
        code: term.code,
        id: i
    })

    i++
}

await atomic.commit()