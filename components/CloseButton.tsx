export interface CloseButtonProps {
    onClick?: () => void,
    class?: string,
}

export default function CloseButton(props: CloseButtonProps) {
    return (
        <button 
            class={`w-6 h-6 rounded-md bg-red-400 flex items-center justify-center text-white shadow-lg cursor-pointer ${props.class}`} 
            type="button" 
            onClick={props.onClick}
        >
            X
        </button>
    )
}