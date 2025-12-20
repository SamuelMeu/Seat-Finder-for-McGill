import { selectedTerm, selectedCourse, openCourseForm, courseCart } from "../utils/courseCart.tsx";
import { CourseInfo } from "../services/vsb.ts";
import Box from "../components/Box.tsx";
import CourseSection from "../components/CourseSection.tsx";
import CloseButton from "../components/CloseButton.tsx";
import { useSignalEffect, useSignal } from "@preact/signals";

export default function CourseModal() {
    const courseData = useSignal<CourseInfo | null>()
    const loading = useSignal(false)

    // Fetch API data
    useSignalEffect(() => {
        if (selectedCourse.value && selectedTerm.value && openCourseForm.value) {
            const url = `/api/course/get?q=${selectedCourse.value.key.replace(' ', '-')}&t=${selectedTerm.value}`
            
            loading.value = true

            fetch(url)
            .then((res) => res.json())
            .then((json) => {courseData.value = json; loading.value = false})
            .catch(err => {
                loading.value = false
                console.log(err)
            })
        }
    })

    if (!openCourseForm.value) return null

    if(loading.value) return (
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <svg class="animate-spin size-20 text-red-500" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    )

    if (!courseData.value) return (
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="w-2xl max-w-full">
                <Box title="Not Found">
                    <CloseButton class="absolute top-2 right-2" onClick={() => {openCourseForm.value = false; courseData.value = null}}/>
                    Perhaps this course is not offered this semester?
                </Box>
            </div>
        </div>
    )

    return (
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="w-2xl max-w-full">
                <Box title={courseData.value!.key + " (" + courseData.value.campuses.join(' & ') + ")"} class="max-h-[80vh] overflow-auto">
                    <button class="absolute top-2 right-2 w-6 h-6 rounded-md bg-red-400 flex items-center justify-center text-white shadow-lg cursor-pointer" type="button" onClick={() => {openCourseForm.value = false; courseData.value = null}}>X</button>
                    <div class="flex flex-col gap-y-2 mt-2">
                        {
                            courseData.value.sections.map(sec => (
                                <CourseSection 
                                    type = {sec.type} 
                                    number={sec.number} 
                                    seats={sec.openSeats} 
                                    subscribable={sec.isFull}
                                    onAdd={() => {
                                        courseCart.value = [...courseCart.value, {
                                            key: courseData.value!.key,
                                            type: sec.type,
                                            secNo: sec.number
                                        }]
                                        openCourseForm.value = false
                                        courseData.value = null
                                    }}
                                />
                            ))
                        }
                    </div>
                </Box>
            </div>
        </div>
    )
}