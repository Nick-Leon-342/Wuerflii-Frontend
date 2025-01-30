

import './scss/Analytics.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import ChartBar from '../../components/Statistics/Chart_Bar'
import Previous from '../../components/NavigationElements/Previous'





export default function Analytics({
	setError
}) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ user, setUser ] = useState()

	const [ counts, setCounts ] = useState()
	const [ total_sessions, setTotal_sessions ] = useState(0)
	const [ total_games_played, setTotal_games_played ] = useState(0)

	const [ loading, setLoading ] = useState(false)





	useEffect(() => {

		setLoading(true)

		axiosPrivate.get('/analytics').then(({ data }) => {


			setCounts(data.Counts)
			setTotal_sessions(data.Total_Sessions)
			setTotal_games_played(data.Total_Games_Played)


		}).catch(err => 

			handle_error({
				err, 
			})

		).finally(() => setLoading(false))


	}, [])





	return <>
		<div className='analytics'>
			<Previous onClick={() => navigate(-1)}/>

			<div className=''>
				<span>Anzahl von Partien:</span>
				<span>{total_sessions}</span>
			</div>
			
			<div className=''>
				<span>Anzahl von Spielen</span>
				<span>{total_games_played}</span>
			</div>

			{/* <div className=''>
				<span>Insgesamt Spiele gespielt</span>
				<span>{counts}</span>
			</div> */}

			<ChartBar
				Counts={counts}
			/>

			<label>Analysen von Spielern angucken</label>
			<label>Analysen von Partien angucken</label>

			<label>Bargraph für Spiele gespielt in den Jahren/Monaten</label>

		</div>
	</>
}
