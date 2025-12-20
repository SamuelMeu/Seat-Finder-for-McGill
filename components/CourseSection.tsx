// @ts-types="preact"
import { MouseEventHandler } from "preact";

export interface SectionProps {
    type: string,
    number: number, 
    seats: number, 
    subscribable: boolean;
    onAdd?: MouseEventHandler<HTMLButtonElement>;
}

export default function CourseSection(props: SectionProps) {
  return (
    <div class="rounded-md shadow-md truncate">
        <div class="relative flex flex-row justify-between bg-red-100 px-2 py-1">
            {props.subscribable && <button type="button" class="absolute flex justify-center items-center top-0 right-0 h-full bg-green-300 px-4 text-white cursor-pointer" onClick={props.onAdd}>add</button>}
            <h2>{props.type} {props.number}</h2>
        </div>
        <div class="px-2 py-1">
            <p class="text-sm">Remaining seats: {props.seats}</p>
        </div>
    </div>
  );
}