// React.js
import { RefObject, useEffect, useRef } from 'react'

// Calls the callback if a click happens outside of the container (containerRef)
export default function useListenClickOutside(
    containerActiveState: boolean,
    callback: () => void,
    containerRef: RefObject<HTMLElement | null>,
) {
    const initialRender = useRef(true)

    function closeContainer(event: Event) {
        const clickedInside = containerRef.current?.contains(event.target as Node) || false
        // If clicked outside of the container
        if (!clickedInside){
            callback()
        }
    }

    useEffect(() => {
        if (containerActiveState) {
            // Add event listener if container is active
            window.addEventListener('click', closeContainer)
            initialRender.current = false

        } else if (!initialRender.current) {
            window.removeEventListener('click', closeContainer)
        }

        // Cleanup code, avoid react bugs
        return () => {
            window.removeEventListener('click', closeContainer)
        }
    }, [containerActiveState])
}