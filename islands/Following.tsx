import { courseCart } from "../utils/courseCart.tsx";
import CloseButton from "../components/CloseButton.tsx";

export default function Following() {
    if (courseCart.value.length == 0) return (
        <p class="text-gray-400">Use the search bar to add courses</p>
    )
    else return (
        <div class="flex flex-col gap-y-2">
            {courseCart.value.map(subscription => (
                <div class="flex flex-row gap-x-2 rounded-md p-2 items-center border-2 border-red-200 shadow-md justify-between">
                    <div>
                        <div class="font-bold">{subscription.key}</div>
                        <div class="text-gray-500 text-sm">{subscription.type} {subscription.secNo}</div>
                    </div>
                    <CloseButton/>
                </div>
            ))}
        </div>
    )
}