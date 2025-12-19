import { useSignal, useSignalEffect } from "@preact/signals";
import { Course } from "../services/db.ts";

export default function SearchBar() {
    const query = useSignal("")
    const results = useSignal<Course[]>([])
    const showRes = useSignal(false)
    
    useSignalEffect(() => {
        // Empty request
        if (!query.value) {
            results.value = []
            return 
        }

        const dbounce = setTimeout(async () => {
            const rep = await fetch(`/api/course/search?q=${query.value}`)
            results.value = await rep.json()
        }, 200)

        return () => clearTimeout(dbounce)
    })

    return (
        <div class="w-full">
            <input
                class={`w-full bg-transparent text-black text-base border border-red-500 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-red-500 hover:border-red-500 shadow-sm focus:shadow ${
                    (showRes.value && results.value.length > 0) ? "rounded-t-lg rounded-b-sm" : "rounded-lg"
                }`}
                type="text" 
                placeholder="Search courses"
                value={query.value}
                onInput={(i) => query.value = i.currentTarget.value}
                onFocusOut={(e) => showRes.value = false}
                onFocusIn={(e) => showRes.value = true}
            />

            {showRes.value && results.value.length > 0 ? <div class="border border-red-500 rounded-b-lg rounded-t-sm bg-red-500/10 backdrop-blur-sm mt-1 shadow-lg min-h-0 max-h-50 overflow-y-auto truncate">
                <ul class="divide-y divide-red-500/12">
                    {
                        results.value.map((course) => (
                            <li 
                                key={course.key}
                                class="truncate block px-3 py-2 text-sm text-black focus:bg-white/5 focus:text-white focus:outline-hidden cursor-pointer hover:text-red-900 transition ease-in-out"
                            >
                                {course.key} | {course.title}
                            </li>
                        ))
                    }
                </ul>
            </div> : null}
        </div>
    )
}