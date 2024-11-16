

import { useCallback, useRef, useState } from 'react'

import useRequestList from './useRequestList'





export default function useInfiniteScrolling({
	url, 
	
	handle_404, 
	handle_409, 
	handle_500, 
	handle_default, 
}) {

	const [ offset_block, setOffset_block ] = useState(1)

	const { loading, is_error, list, hasMore } = useRequestList({
		offset_block, 
		url,
	
		handle_404, 
		handle_409, 
		handle_500, 
		handle_default, 
	})





	const observer = useRef()
	const ref = useCallback(node => {
		if (loading) return
		if (observer.current) observer.current.disconnect()
			observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore) {
				setOffset_block(prev => prev + 1)
			}
		})
		if (node) observer.current.observe(node)
	}, [ loading, hasMore ])





	return { ref, loading, is_error, list }
}
