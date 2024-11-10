

// import { useLocation, useNavigate } from 'react-router-dom'
// import useAxiosPrivate from '../../hooks/useAxiosPrivate'
// import { useEffect, useLayoutEffect, useState } from 'react'

// import useErrorHandling from '../../hooks/useErrorHandling'

// import Table from '../../components/Tables/Table'
// import Loader from '../../components/Loader/Loader'
// import PlayerTable from '../../components/Tables/Table_Player'
// import OptionsDialog from '../../components/others/OptionsDialog'





export default function SessionPreviewTable() {
	
	// const navigate = useNavigate()
	// const axiosPrivate = useAxiosPrivate()
	// const location = useLocation()
	// const handle_error = useErrorHandling()
	// const urlParams = new URLSearchParams(location.search)

	// const [ session_id, setSession_id ] = useState()

	// const [ loaderVisible, setLoaderVisible ] = useState(false)
	// const [ List_Players, setList_Players ] = useState()
	// const [ finalScores, setFinalScores ] = useState()
	// const [ table, setTable ] = useState()
	// const [ tableWidth, setTableWidth ] = useState()





	// useLayoutEffect(() => {
		
	// 	const ut = document.getElementById(id_upperTable)
	// 	if(!ut) return
	// 	setTableWidth(ut.offsetWidth)

	// })

	// useEffect(() => {

	// 	const session_id = urlParams.get('session_id')
	// 	const finalscore_id = urlParams.get('finalscore_id')
	// 	setSession_id(session_id)

	// 	setLoaderVisible(true)

	// 	axiosPrivate.get(`/session/preview-table?session_id=${session_id}&finalscore_id=${finalscore_id}`).then((res) => {


	// 		const tmpList_Players = []
	// 		for(const alias of res.data.List_PlayerOrder) {
	// 			for(const p of res.data.List_Players) {
	// 				if(alias === p.Alias) {
	// 					tmpList_Players.push(p)
	// 					break
	// 				}
	// 			}
	// 		}
	// 		setList_Players(tmpList_Players)
	// 		setFinalScores(res.data.FinalScores)
	// 		setTable(res.data.Table)


	// 	}).catch((err) => {

	// 		handle_error({
	// 			err, 
	// 			handle_404: () => {
	// 				window.alert('Dieser Spielstand exisiert nicht!')
	// 				navigate(-1)
	// 			}
	// 		})


	// 	}).finally(() => { setLoaderVisible(false) })

	// }, [])

	// useEffect(() => {

	// 	if(!table || !finalScores || !List_Players) return

	// 	const columns =  Array.from({ length: finalScores.Columns }, (_, index) => index)
	// 	const list = {}
	// 	for(const p of List_Players) {
	// 		list[p.Alias] = columns.map((c) => {
	// 			return { UpperSum: 0, BottomSum: 0 } 
	// 		})
	// 	}

	// 	for(const c of table) {
	// 		if(c.TableID === id_upperTable) {
	// 			let sum = 0
	// 			for(let i = 0; 6 > i; i++) {
	// 				sum += c[i]
	// 			}
	// 			list[c.Alias][c.Column].UpperSum = sum
	// 		} else {
	// 			let sum = 0
	// 			for(let i = 0; 7 > i; i++) {
	// 				sum += c[i]
	// 			}
	// 			list[c.Alias][c.Column].BottomSum = sum
	// 		}
	// 	}

	// 	const upperTable = document.getElementById(id_upperTable)
	// 	const bottomTable = document.getElementById(id_bottomTable)

	// 	for(const p of List_Players) {
	// 		for(const c of columns) {
	// 			const us = list[p.Alias][c].UpperSum
	// 			const bs = list[p.Alias][c].BottomSum

	// 			upperTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="6"]`).textContent = us
	// 			upperTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="7"]`).textContent = us < 63 ? '-' : 35
	// 			upperTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="8"]`).textContent = us < 63 ? us : us + 35

	// 			bottomTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="7"]`).textContent = bs
	// 			bottomTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="8"]`).textContent = us < 63 ? us : us + 35
	// 			bottomTable.querySelector(`[alias="${p.Alias}"][column="${c}"][row="9"]`).textContent = bs + (us < 63 ? us : us + 35)
	// 		}

	// 	}

	// }, [table, List_Players, finalScores])





	// return (
	// 	<>

	// 		<OptionsDialog/>

	// 		<div className='game_container'>
	// 			<div className='game'>

	// 				{List_Players && <>
	// 					<PlayerTable
	// 						disabled={true}
	// 						list_Players={List_Players}
	// 						playerScores={finalScores?.PlayerScores}
	// 						showScores={true}
	// 						setShowScores={() => {}}
	// 						tableWidth={tableWidth}
	// 					/>

	// 					<Table
	// 						tableID={id_upperTable}
	// 						tableColumns={table}
	// 						columns={finalScores?.Columns}
	// 						list_Players={List_Players}
	// 						disabled={true}
	// 					/>

	// 					<Table
	// 						tableID={id_bottomTable}
	// 						tableColumns={table}
	// 						columns={finalScores?.Columns}
	// 						list_Players={List_Players}
	// 						disabled={true}
	// 					/> 
	// 				</>}

	// 				<Loader loaderVisible={loaderVisible} />
					
	// 				<button 
	// 					className='button' 
	// 					onClick={() => navigate(`/session/preview?session_id=${session_id}`, { replace: false })}
	// 				>Zurück</button>

	// 			</div>
	// 		</div>
	// 	</>
	// )

}
