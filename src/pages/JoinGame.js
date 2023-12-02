

import '../App.css'
import './css/Game.css'

import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../api/axios'
import { id_bottomTable, id_upperTable, thickBorder, updateURL, handleInputTypeChange, successfullyConnected, handleShowScoresChange } from '../logic/utils'
import { focusEvent, removeFocusEvent, onblurEvent } from '../logic/Events'
import io from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from '../logic/utils-env'
import { calculateUpperColumn, calculateBottomColumn } from '../logic/Calculating'

import PlayerTable from '../components/PlayerTable'
import Table from '../components/Table'
import LastPlayerDialog from '../components/Dialog/LastPlayerDialog'
import InvalidNumberDialog from '../components/Dialog/InvalidNumberDialog'
import ToggleSlider from '../components/ToggleSlider'





function Game() {

	const navigate = useNavigate()

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const joincode = urlParams.get('joincode')
	const [ lastPlayerAlias, setLastPlayerAlias ] = useState(urlParams.get('lastplayer'))
	
	const [ columnsSum ] = useState([])
	
	const [ socket, setSocket ] = useState()
	const [ session, setSession ] = useState()

	const [ inputType, setInputType ] = useState()
	const [ showScores, setShowScores ] = useState()
	const [ tableWidth, setTableWidth ] = useState(0)
	const [ gnadenwurf, setGnadenwurf ] = useState({})	// Gnadenwurf is an extra try
	const [ tableColumns, setTableColumns ] = useState([])


	


	useLayoutEffect(() => {
		
		const ut = document.getElementById(id_upperTable)
		if(!ut) return
		setTableWidth(ut.offsetWidth)

	})

	useEffect(() => {

		if(!session) return

		for(const alias of session?.List_PlayerOrder) {
			for(let i = 0; session?.Columns > i; i++) {
				calculateUpperColumn(alias, i, columnsSum)
				calculateBottomColumn(alias, i, columnsSum)
			}
		}

		const elements = document.getElementsByClassName('kniffelInput')
		if (elements) {
			for(const e of elements) {
				e.addEventListener('focus', focusEvent)
				if(inputType === 0) {
					e.addEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)))
				} else {
					e.addEventListener('blur', removeFocusEvent)
				}
			}
		}

		return () => {
			for(const e of elements) {
				e.removeEventListener('focus', focusEvent)
				e.removeEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)))
			}
		}

	}, [session])

	useEffect(() => {

		async function connect() {
			await axios.get(`/joingame?joincode=${joincode}`,
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).then((res) => {
				
				successfullyConnected(
					res.data, 
					columnsSum, 
					urlParams, 
					setSession, 
					setInputType, 
					setShowScores, 
					setTableColumns, 
					setGnadenwurf, 
				)


			}).catch(() => {
				
				return navigate('/creategame', { replace: true })
				
			})
		}

		if(!joincode) return navigate('/creategame', { replace: true })
		
		connect()

		const tmp_socket = io.connect(REACT_APP_BACKEND_URL, { auth: { joincode: joincode } })
		setSocket(tmp_socket)
		tmp_socket.emit('JoinSession', '')
		tmp_socket.on('UpdateValueResponse', (msg) => {

			const m = msg.Data
			const tableID = m.UpperTable ? id_upperTable : id_bottomTable

			document.getElementById(tableID).querySelector(`.kniffelInput[alias='${m.Alias}'][column='${m.Column}'][row='${m.Row}']`).value = m.Value
			if(m.UpperTable) {calculateUpperColumn(m.Alias, m.Column, columnsSum)
			} else {calculateBottomColumn(m.Alias, m.Column, columnsSum)}

			for(const e of tableColumns) {
				if(e.TableID === tableID && e.Alias === m.Alias && e.Column === m.Column) {
					e[m.Row] = m.Value
				}
			}

			setLastPlayerAlias(m.Alias)
			urlParams.set('lastplayer', m.Alias)
			updateURL(urlParams)

		})
		tmp_socket.on('UpdateGnadenwurf', (msg) => {

			setGnadenwurf(msg.Data)

		})
		tmp_socket.on('RefreshGame', () => {

			window.location.reload()

		})
		tmp_socket.on('EndGame', () => {

			navigate('/creategame', { replace: true })

		})

		return () => {
			tmp_socket.disconnect()
		}

	}, [])





	const handleLeave = () => {

		navigate('/creategame', { replace: false })

	}


	


	return (
		<>

			{/* __________________________________________________Dialogs__________________________________________________ */}

			<LastPlayerDialog id='modal-lastPlayer' lastPlayerAlias={lastPlayerAlias} session={session}/>

			<InvalidNumberDialog id='modal-invalidNumber'/>





			{/* __________________________________________________Page__________________________________________________ */}

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<select
					value={inputType}
					onChange={(e) => handleInputTypeChange(e.target.value, urlParams)}
					className='button'
					style={{
						fontSize: '13px', 
						borderRadius: '10px',
						height: '30px',
						padding: '5px',
						marginLeft: '5px',
						marginRight: '10px',
						marginTop: '0',
						marginBottom: '0',
						background: 'none', 
						border: '1px solid var(--text-color)',
						outline: 'none',
						color: 'var(--text-color)',
					}}
				>
					<option value='select' key='select'>Auswahl</option>
					<option value='typeselect' key='typeselect'>Auswahl und Eingabe</option>
					<option value='type' key='type'>Eingabe</option>
				</select>

				<ToggleSlider scale='.9' toggled={showScores} setToggled={() => {handleShowScoresChange(!showScores, urlParams); setShowScores(!showScores)}}/>

				<button 
					className='button'
					onClick={handleLeave}
					style={{
						margin: '0',
						marginRight: '5px',
						background: 'none',
						boxShadow: 'none',
						color: 'var(--text-color)', 
					}}
				>Verlassen</button>
			</div>

			<PlayerTable 
				session={session}
				socket={socket}
				tableWidth={tableWidth}
				thickBorder={thickBorder}
				lastPlayerAlias={lastPlayerAlias}
				gnadenwurf={gnadenwurf}
				setGnadenwurf={setGnadenwurf}
				showScores={showScores}
			/>
			
			<Table 
				tableID={id_upperTable}
				session={session}
				tableColumns={tableColumns}
				inputType={inputType}
				onblurEvent={(e) => onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)}
				removeFocusEvent={removeFocusEvent}
			/>
			<Table 
				tableID={id_bottomTable}
				session={session}
				tableColumns={tableColumns}
				inputType={inputType}
				onblurEvent={(e) => onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)}
				removeFocusEvent={removeFocusEvent}
			/>

		</>
	)
}

export default Game
