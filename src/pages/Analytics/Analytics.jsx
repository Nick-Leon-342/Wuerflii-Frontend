

import './scss/Analytics.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import ChartBar from '../../components/Statistics/Chart_Bar'
import Previous from '../../components/NavigationElements/Previous'




const tmp = {
	2021: {
	  "Total": 287,
	  1: {
		"Total": 58,
		"2": 10,
		"5": 15,
		"12": 18,
		"25": 15
	  },
	  4: {
		"Total": 72,
		"3": 30,
		"10": 22,
		"18": 10,
		"29": 10
	  }
	},
	2022: {
	  "Total": 315,
	  2: {
		"Total": 85,
		"1": 25,
		"7": 30,
		"15": 20,
		"23": 10
	  },
	  6: {
		"Total": 90,
		"5": 35,
		"12": 25,
		"20": 20,
		"28": 10
	  }
	},
	2023: {
	  "Total": 400,
	  3: {
		"Total": 110,
		"2": 40,
		"9": 30,
		"16": 20,
		"27": 20
	  },
	  7: {
		"Total": 140,
		"6": 50,
		"14": 40,
		"21": 30,
		"30": 20
	  }
	},
	2024: {
	  "Total": 375,
	  5: {
		"Total": 95,
		"3": 35,
		"11": 25,
		"19": 20,
		"24": 15
	  },
	  8: {
		"Total": 130,
		"4": 45,
		"13": 40,
		"22": 25,
		"29": 20
	  }
	},
	2025: {
	  "Total": 410,
	  2: {
		"Total": 120,
		"5": 2,
		"10": 1,
		"18": 2,
		"26": 2
	  },
	  1: {
		"Total": 140,
		"7": 1,
		"15": 1,
		"23": 1,
		"30": 2
	  }
	}
  }



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

	const [ statistics_view, setStatistics_view ] = useState('statistics_years')
	const [ statistics_view_month, setStatistics_view_month ] = useState(new Date().getMonth() + 1)
	const [ statistics_view_year, setStatistics_view_year ] = useState(new Date().getFullYear())

	const [ list_years, setList_years ] = useState([])
	const list_months = [
		'Januar', 
		'Februar', 
		'März', 
		'April', 
		'Mai', 
		'Juni', 
		'Juli', 
		'August', 
		'September', 
		'Oktober', 
		'November', 
		'Dezember', 
	]





	useEffect(() => {

		setLoading(true)

		axiosPrivate.get('/analytics').then(({ data }) => {

			
			setUser(data.User)
			setTotal_sessions(data.Total_Sessions)
			setTotal_games_played(data.Total_Games_Played)


			// const Counts = data.Counts
			const Counts = tmp
			setCounts(Counts)

			const list_years = Object.keys(Counts).map(year => +year)
			setList_years(list_years)


		}).catch(err => 

			handle_error({
				err, 
			})

		).finally(() => setLoading(false))

		// eslint-disable-next-line
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

			<select
				value={statistics_view}
				onChange={({ target }) => setStatistics_view(target.value)}
			>
				<option key={0} value='statistics_years'>Gesamt</option>
				<option key={1} value='statistics_months_of_year'>Jahr</option>
				<option key={2} value='statistics_days_of_month'>Monat</option>
			</select>

			{(statistics_view === 'statistics_months_of_year' || statistics_view === 'statistics_days_of_month') && <>
				<select
					value={statistics_view_year}
					onChange={({ target }) => setStatistics_view_year(+target.value)}
				>
					{list_years.map(year => <>
						<option key={year} value={year}>{year}</option>
					</>)}
				</select>
			</>}

			{statistics_view === 'statistics_days_of_month' && <>
				<select
					value={statistics_view_month}
					onChange={({ target }) => setStatistics_view_month(+target.value)}
				>
					{list_months.map((month, index_month) => <>
						<option key={month} value={index_month + 1}>{month}</option>
					</>)}
				</select>
			</>}

			<ChartBar
				Counts={tmp}
				list_months={list_months}

				statistics_view={statistics_view}
				statistics_view_month={statistics_view_month}
				statistics_view_year={statistics_view_year}
			/>

			<label>Analysen von Spielern angucken</label>
			<label>Analysen von Partien angucken</label>

			<label>Bargraph für Spiele gespielt in den Jahren/Monaten</label>

		</div>
	</>
}
