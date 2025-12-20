import type { ComponentChildren } from "preact";

export interface BoxProps {
  children?: ComponentChildren;
  title?: string;
  class?: string;
}

export default function Box(props: BoxProps) {
  return (
    <div class={`relative bg-white border border-gray-200 rounded-lg p-6 shadow-md w-full m-0 ${props.class}`}>
        {props.title ? <h1 class="font-mono text-left">{props.title}</h1> : null}
        <hr class="mt-1 mb-2 bg-gray-600 border-0 h-px"/>
        {props.children}
    </div>
  );
}