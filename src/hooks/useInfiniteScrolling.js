

import { useEffect, useRef, useState } from 'react'

import useErrorHandling from './useErrorHandling'
import useAxiosPrivate from './useAxiosPrivate'





/**
 * 
 * useInfiniteScrolling is a custom hook that enables infinite scrolling functionality for fetching and displaying data.
 * It supports both vertical and horizontal scrolling and can work with either the window scrollbar or a custom container.
 *
 * @param {Object} params - The parameters passed to the hook.
 * @param {boolean} params.useWindowScrollbar - If true, the window scrollbar is used; otherwise, a custom container scrollbar is used.
 * @param {'vertical' | 'horizontal'} params.scrollDirection - Defines the scroll direction for fetching new data ('vertical' or 'horizontal').
 * @param {Function} params.handle_404 - Function to handle 404-error
 * @param {Function} params.handle_409 - Function to handle 409-error
 * @param {Function} params.handle_500 - Function to handle 500-error
 * @param {string} params.url - The URL endpoint to request data from. The request includes an offset to fetch paginated data.
 *
 * @returns {Object} The returned object from the hook.
 * @returns {Object} ref - Ref to the scrollable container, needed when `useWindowScrollbar` is false.
 * @returns {Array} list - The current list of fetched items.
 * @returns {boolean} loading - Indicates whether a new request is in progress.
 * 
 */


export default function useInfiniteScrolling({
	useWindowScrollbar,
	scrollDirection,
	handle_404, 
	handle_409, 
	handle_500, 
	url,
}) {

	const ref = useRef()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading, setLoading ] = useState(false)
	const [ list, setList ] = useState([])

	let list_length = 0
	let offset_int = 0
	let currently_requested_offset_int = 0




	const request = ( firstRequest ) => {

		if(!url || (
				!firstRequest && (
					loading || 
					list.length === list_length || 
					offset_int > list_length ||
					currently_requested_offset_int === offset_int
				)
			)
		) return

		currently_requested_offset_int = offset_int
		
		setLoading(true)

		axiosPrivate.get(`${url}&offset_int=${offset_int}`).then(({ data }) => {


			const newList = data.List
			setList(prevList => {
			
				for (const e of newList) {
					if (!prevList.some(item => item.id === e.id)) prevList.push(e)
				}
			
				return prevList
			})
			list_length = data.List_Length
			offset_int += newList.length

			console.log(newList)


		}).catch((err) => {

			handle_error({ 
				err, 
				handle_404, 
				handle_409, 
				handle_500, 
			})

		}).finally(() => setLoading(false))

	}





	const handleScroll = () => {

		let scrollTop, scrollHeight, clientHeight

		if (useWindowScrollbar) {

			scrollTop = window.scrollY || document.documentElement.scrollTop
			scrollHeight = document.documentElement.scrollHeight
			clientHeight = window.innerHeight

		} else if (ref.current) {

			const container = ref.current
			scrollTop = container.scrollTop
			scrollHeight = container.scrollHeight
			clientHeight = container.clientHeight

		}

		const int = 50	// At what point new data should be requested

		if (scrollDirection === 'vertical') {
			if (scrollTop + clientHeight >= scrollHeight - int) request()
		} else {
			const scrollLeft = useWindowScrollbar ? window.scrollX : ref.current.scrollLeft
			const clientWidth = useWindowScrollbar ? window.innerWidth : ref.current.clientWidth
			const scrollWidth = useWindowScrollbar ? document.documentElement.scrollWidth : ref.current.scrollWidth

			if (scrollLeft + clientWidth >= scrollWidth - int) request()
		}
	}





    useEffect(() => {
		
        setList([])
        request(true)



        if (useWindowScrollbar) {
            window.addEventListener('scroll', handleScroll)
			return () => window.removeEventListener('scroll', handleScroll)
        } else {
			if(!ref || !ref.current) return
            const container = ref.current
            if (container) container.addEventListener('scroll', handleScroll)
			return () => container.removeEventListener('scroll', handleScroll)
        }

        // eslint-disable-next-line
    }, [ url ])





	return { ref, list, loading }
}
