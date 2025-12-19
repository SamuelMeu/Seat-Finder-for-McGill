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
                        onClick={() => selectedTerm.value = term.id}
                    >
                        <span class={`w-5 h-5 rounded-sm border border-red-400 ${selectedTerm.value == term.id && "bg-red-800"}`}></span>
                        {term.name}
                    </li>
                )
            })
        }
    </ul>
  );
}
