// React.js
import { RefObject, useEffect, useRef } from 'react'

export default function useListenClickOutside(
    containerActiveState: boolean,
    callback: () => void,
    containerId: string,
    insideContainersRefs: RefObject<HTMLDivElement>[],
    activeListener: boolean
) {

    const ignoreFirstClick = useRef<boolean>(true)

    function closeContainer(event: Event) {

        if (ignoreFirstClick.current) {
            ignoreFirstClick.current = false
            return
        }

        const container: HTMLElement | null = document.querySelector('#' + containerId)

        const clickedInside = 
            container?.contains(event.target as Node)/*  ||
            insideContainersRefs.every((ref) => {
                !ref.current
            }) */

        // If clicked on the space outside of the container
        if (!clickedInside){
            callback()
            window.removeEventListener('click', closeContainer)
            console.log('stopped', ignoreFirstClick.current)
        }
    }

    useEffect(() => {

        // Cleanup code, avoid react bugs
        return () => {
            window.removeEventListener('click', closeContainer)
        }

    }, [])

    useEffect(() => {

        if (containerActiveState && activeListener) {
            // Add event listener if container is active
            window.addEventListener('click', closeContainer)
            console.log('listening')
            
            // Subsequent toggles
            ignoreFirstClick.current = true
        }

    }, [containerActiveState, activeListener])
}