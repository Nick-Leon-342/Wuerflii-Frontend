

import { useLocation, useNavigate } from "react-router-dom"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useEffect, useLayoutEffect, useState } from "react"

import Loader from '../components/Loader'
import PlayerTable from '../components/PlayerTable'
import Table from '../components/Table'
import { id_bottomTable, id_upperTable } from "../logic/utils"





export default function SessionPreviewTable() {
	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const sessionid = urlParams.get('sessionid')
	const finalscoreid = urlParams.get('finalscoreid')

	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ List_Players, setList_Players ] = useState()
	const [ finalScores, setFinalScores ] = useState()
	const [ table, setTable ] = useState()
	const [ tableWidth, setTableWidth ] = useState()





	useLayoutEffect(() => {
		
		const ut = document.getElementById(id_upperTable)
		if(!ut) return
		setTableWidth(ut.offsetWidth)

	})

	useEffect(() => {

		async function request() {

			setLoaderVisible(true)

			await axiosPrivate.get('/sessionpreview-table',
				{
					headers: { 'Content-Type': 'application/json' },
					params: { SessionID: sessionid, FinalScoreID: finalscoreid },
					withCredentials: true
				}
			).then((res) => {

				const tmpList_Players = []
				for(const alias of res.data.List_PlayerOrder) {
					for(const p of res.data.List_Players) {
						if(alias === p.Alias) {
							tmpList_Players.push(p)
							break
						}
					}
				}
				setList_Players(tmpList_Players)
				setFinalScores(res.data.FinalScores)
				setTable(res.data.Table)

			}).catch((err) => {

				const status = err?.response?.status
				if(status === 404) {
					window.alert('Dieser Spielstand exisiert nicht!')
				} else if(status === 400) {
					window.alert('Die Anfrage ist falsch!')
				} else {
					console.log(err)
					window.alert('Beim Server trat ein Fehler auf!')
				}
				navigate(`/sessionpreview?sessionid=${sessionid}`, { replace: true })

			})

			setLoaderVisible(false)

		}

		request()

	}, [])

	useEffect(() => {

		if(!table || !finalScores || !List_Players) return

		const columns =  Array.from({ length: finalScores.Columns }, (_, index) => index)
		const list = {}
		for(const p of List_Players) {
			list[p.Alias] = columns.map((c) => {
				return { UpperSum: 0, BottomSum: 0 } 
			})
		}

		for(const c of table) {
			if(c.TableID === id_upperTable) {
				let sum = 0
				for(let i = 0; 6 > i; i++) {
					sum += c[i]
				}
				list[c.Alias][c.Column].UpperSum = sum
			} else {
				let sum = 0
				for(let i = 0; 7 > i; i++) {
					sum += c[i]
				}
				list[c.Alias][c.Column].BottomSum = sum
			}
		}

		const upperTable = document.getElementById(id_upperTable)
		const bottomTable = document.getElementById(id_bottomTable)

		for(const p of List_Players) {
			for(const c of columns) {
				const us = list[p.Alias][c].UpperSum
				const bs = list[p.Alias][c].BottomSum

				upperTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="6"]`).textContent = us
				upperTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="7"]`).textContent = us < 63 ? '-' : 35
				upperTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="8"]`).textContent = us < 63 ? us : us + 35

				bottomTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="7"]`).textContent = bs
				bottomTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="8"]`).textContent = us < 63 ? us : us + 35
				bottomTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="9"]`).textContent = bs + (us < 63 ? us : us + 35)
			}

		}

	}, [table, List_Players, finalScores])





	return (
		<>

			{List_Players && <>
				<PlayerTable
					disabled={true}
					list_Players={List_Players}
					playerScores={finalScores?.PlayerScores}
					showScores={true}
					tableWidth={tableWidth}
				/>

				<Table
					tableID={id_upperTable}
					tableColumns={table}
					columns={finalScores?.Columns}
					list_Players={List_Players}
					disabled={true}
				/>

				<Table
					tableID={id_bottomTable}
					tableColumns={table}
					columns={finalScores?.Columns}
					list_Players={List_Players}
					disabled={true}
				/> 
			</>}

			<Loader loaderVisible={loaderVisible} />
			
			<button className='button' style={{ height: '50px', width: '100%', marginBottom: '0px' }} onClick={() => navigate(`/sessionpreview?sessionid=${sessionid}`, { replace: false })}>Zurück</button>

		</>
	)

}
