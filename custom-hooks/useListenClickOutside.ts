// React.js
import { RefObject, useEffect } from 'react'

export default function useListenClickOutside(
    containerActiveState: boolean,
    callback: () => void,
    containerId: string,
    insideContainersRefs: RefObject<HTMLDivElement[]>
) {

    function closeContainer(event: Event) {

        const container: HTMLElement | null = document.querySelector('#' + containerId)

        const clickedInside = 
            container?.contains(event.target as Node) ||
            insideContainersRefs.current.

        console.log("outside:", !clickedInside)

        // If clicked on the space outside of the container
        if (!clickedInside){
            callback()
            window.removeEventListener('click', closeContainer)
            console.log('closed', event.target, container)
        }
    }

    useEffect(() => {

        // Cleanup code, avoid react bugs
        return () => {
            window.removeEventListener('click', closeContainer)
        }

    }, [])

    useEffect(() => {

        if (containerActiveState) {
            // Add event listener if container is active
            window.addEventListener('click', closeContainer)
        }

    }, [containerActiveState])
}