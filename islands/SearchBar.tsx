import { useSignal, useSignalEffect } from "@preact/signals";
import { Course } from "../services/db.ts";

export default function SearchBar() {
    const query = useSignal("")
    const results = useSignal<Course[]>([])
    
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
        <div class="w-xl max-w-full mx-auto">
            <input
                class="w-full bg-transparent rounded-md text-black text-base border border-red-500 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-red-500 hover:border-red-500 shadow-sm focus:shadow" 
                type="text" 
                placeholder="Search courses"
                value={query.value}
                onInput={(i) => query.value = i.currentTarget.value}
            />

            <div class="left-0 right-0 z-50 rounded-md bg-red-500/10 backdrop-blur-sm mt-1 shadow-lg min-h-0 max-h-50 overflow-y-auto truncate">
                <ul>
                    {
                        results.value.map((course) => (
                            <li 
                                key={course.key}
                                class="truncate block px-4 py-2 text-sm text-black focus:bg-white/5 focus:text-white focus:outline-hidden hover:cursor-pointer hover:scale-102 transition ease-in-out"
                            >
                                {course.key} | {course.title}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}