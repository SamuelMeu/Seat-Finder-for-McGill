import { selectedTerm } from "../utils/courseCart.tsx";
import { Term } from "../services/db.ts";

interface TermProps {
    terms: Term[]
}

export default function TermSelector(props: TermProps) {
  return (
    <ul class="space-y-2">
        {
            props.terms.map(term => {
                return(
                    <li
                        class="flex flex-row gap-x-2 items-center cursor-pointer"
                        onClick={() => selectedTerm.value = term.code}
                    >
                        <span class={`w-5 h-5 rounded-sm border-2 border-red-400 ${selectedTerm.value == term.code && "bg-red-800"}`}></span>
                        {term.name}
                    </li>
                )
            })
        }
    </ul>
  );
}
