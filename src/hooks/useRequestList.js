

import { useEffect, useState } from 'react'

import axios from '../api/axios'
import useAxiosPrivate from './useAxiosPrivate'
import useErrorHandling from './useErrorHandling'





export default function useRequestList({
	offset_block, 
	url, 

	handle_404, 
	handle_409, 
	handle_500, 
	handle_default, 
}) {

	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading, setLoading ] = useState(true)
	const [ is_error, setIs_error ] = useState(false)
	const [ list, setList ] = useState([])
	const [ hasMore, setHasMore ] = useState(false)





	// useEffect(() => setList([]), [ url ])

	useEffect(() => {

		if(!url) return

		setLoading(true)
		setIs_error(false)

		const controller = new AbortController()

		let cancel
		axiosPrivate.get(
			`${url}&offset_block=${offset_block}`, 
			{ signal: controller.signal }
		).then(({ data }) => {


			const {
				List, 
				Has_More
			} = data

			setList(prev_list => [ ...new Set([ ...prev_list, ...List ]) ])
			setHasMore(Has_More)


		}).catch(err => {

			if(err.name === 'CanceledError') return
			handle_error({
				err, 
				handle_404, 
				handle_409, 
				handle_500, 
				handle_default, 
			})
			setIs_error(true)

		}).finally(() => setLoading(false))



		return () => controller.abort()

		// eslint-disable-next-line
	}, [ url, offset_block ])





	return { loading, is_error, list, hasMore }

}
