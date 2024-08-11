// React.js
import { RefObject, useEffect } from 'react'

export default function useListenClickOutside(
    containerActiveState: boolean,
    callback: () => void,
    containerRef: RefObject<HTMLElement>,
    toggleContainersRef?: RefObject<HTMLElement>[]
) {

    function closeContainer(event: Event) {

        const container = containerRef.current

        const clickedInsideMainContainer = 
            container && (container === event.target || container.contains(event.target as Node))

        const clickedInsideToggleContainers = toggleContainersRef?.reduce((toggleContainerRef) => {
            return toggleContainerRef.current?.contains(event.target as Node)/* i was here */
        })
            

        const clickedInside = clickedInsideMainContainer || clickedInsideToggleContainers

        console.log('event.target', event.target)
        console.log('container', container)
        console.log(clickedInside)


        // If clicked on the space outside of the container
        if (!clickedInside){
            callback()
            window.removeEventListener('click', closeContainer)
            console.log('stopped')
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
            console.log('listening')
        }

    }, [containerActiveState])
}