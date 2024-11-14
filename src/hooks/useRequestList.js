

import { useEffect, useState } from 'react'

import axios from '../api/axios'
import useAxiosPrivate from './useAxiosPrivate'
import useErrorHandling from './useErrorHandling'





export default function useRequestList(url, pageNumber) {

	const axiosPrivate = useAxiosPrivate()

	const [ loading, setLoading ] = useState(true)
	const [ error, setError ] = useState(false)
	const [ list, setList ] = useState([])
	const [ hasMore, setHasMore ] = useState(false)





	useEffect(() => setList([]), [ url ])

	useEffect(() => {
		setLoading(true)
		setError(false)

		let cancel
		axiosPrivate.get(url, { cancelToken: new axios.CancelToken(c => cancel = c) }).then(({ data }) => {

			const {
				List, 
				List_length
			} = data

			setList(prev_list => {
				return [ ...new Set([ ...prev_list, ...List ]) ]
			})
			setHasMore(data.docs.length > 0)
			setLoading(false)

		}).catch(err => {

			if (axios.isCancel(err)) return
			setError(true)

		})

		return () => cancel()
	}, [ url, pageNumber ])


	return { loading, error, list, hasMore }

}









import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

export default function App() {
	const [query, setQuery] = useState('')
	const [pageNumber, setPageNumber] = useState(1)

	const {
	books,
	hasMore,
	loading,
	error
	} = useBookSearch(query, pageNumber)

	const observer = useRef()
	const lastBookElementRef = useCallback(node => {
		if (loading) return
		if (observer.current) observer.current.disconnect()
			observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore) {
				setPageNumber(prevPageNumber => prevPageNumber + 1)
			}
		})
		if (node) observer.current.observe(node)
	}, [loading, hasMore])

	function handleSearch(e) {
		setQuery(e.target.value)
		setPageNumber(1)
	}

	return (<>
		<input type="text" value={query} onChange={handleSearch}></input>
		{books.map((book, index) => {
			if (books.length === index + 1) {
				return <div ref={lastBookElementRef} key={book}>{book}</div>
			} else {
				return <div key={book}>{book}</div>
			}
		})}
		<div>{loading && 'Loading...'}</div>
		<div>{error && 'Error'}</div>
	</>)
}