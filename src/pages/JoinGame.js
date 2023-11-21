

import '../App.css'
import './css/Game.css'

import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../api/axios'
import { id_bottomTable, id_upperTable, thickBorder, getPlayer, updateURL } from '../logic/utils'
import { focusEvent, removeFocusEvent, onblurEvent } from '../logic/Events'
import io from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from '../logic/utils-env'
import { calculateUpperColumn, calculateBottomColumn } from '../logic/Calculating'

import PlayerTable from '../components/PlayerTable'
import Table from '../components/Table'





function Game() {

	const navigate = useNavigate()

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const joincode = urlParams.get('joincode')
	const [ lastPlayerAlias, setLastPlayerAlias ] = useState(urlParams.get('lastplayer'))
	
	const [ columnsSum ] = useState([])
	
	const [ socket, setSocket ] = useState()
	const [ session, setSession ] = useState()

	const [ tableWidth, setTableWidth ] = useState(0)
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
				
				const tmp_session = res?.data?.Session
				columnsSum.length = 0
				for(const p of tmp_session?.List_Players) {
					for(let c = 0; tmp_session?.Columns > c; c++) {
						columnsSum.push({Alias: p.Alias, Column: c, Upper: 0, Bottom: 0, All: 0})
					}
				}
				setSession(tmp_session)
				setInputType(urlParams.get('inputtype') || tmp_session?.InputType)
				setTableColumns(res?.data?.TableColumns)
				setGnadenwurf(res?.data?.Gnadenwürfe)


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

		return () => {
			tmp_socket.disconnect()
		}

	}, [])





	// __________________________________________________Gnadenwurf__________________________________________________
	// Gnadenwurf is an extra try
	
	const [gnadenwurf, setGnadenwurf] = useState({})

	



	// __________________________________________________InputType__________________________________________________

	const [ inputType, setInputType ] = useState()

	const handleInputTypeChange = (e) => {

		const v = e.target.value
		urlParams.set('inputtype', v)
		updateURL(urlParams)
		return window.location.reload()

	}





	const handleLeave = () => {

		navigate('/creategame', { replace: false })

	}


	


	return (
		<>

			{/* __________________________________________________Dialogs__________________________________________________ */}

			<dialog id='modal-nextPlayer' className='modal'>
				<p style={{ fontSize: '22px', marginTop: '20px' }}>
					{!lastPlayerAlias 
						? 'Bis jetzt war noch keiner dran!'
						: (
							<>
								{'\'' + getPlayer(lastPlayerAlias, session)?.Name + '\' war als letztes dran.'}<br />
							</>
						)
					}
				</p>
				<button className='button' onClick={() => document.getElementById('modal-nextPlayer').close()}>Ok</button>
			</dialog>

			<dialog id='modal-invalidnumber' className='modal'>
				<p id='message-invalidnumber' style={{ fontSize: '22px', marginTop: '20px' }}></p>
				<button className='button' onClick={() => document.getElementById('modal-invalidnumber').close()}>Ok</button>
			</dialog>





			{/* __________________________________________________Page__________________________________________________ */}

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<select
					value={inputType}
					onChange={handleInputTypeChange}
					style={{
						borderRadius: '10px',
						height: '30px',
						padding: '5px',
						marginLeft: '5px',
						marginRight: '10px',
						border: '1px solid var(--text-color)',
						outline: 'none',
						color: 'var(--text-color)',
					}}
				>
					<option value='select' key='select'>Auswahl</option>
					<option value='typeselect' key='typeselect'>Auswahl und Eingabe</option>
					<option value='type' key='type'>Eingabe</option>
				</select>

				<button 
					className='button'
					onClick={handleLeave}
					style={{
						margin: '0',
						marginRight: '5px',
						background: 'none',
						boxShadow: 'none',
					}}
				>Verlassen</button>
			</div>

			<PlayerTable 
				session={session}
				socket={socket}
				tableWidth={tableWidth}
				thickBorder={thickBorder}
				getPlayer={getPlayer}
				lastPlayerAlias={lastPlayerAlias}
				gnadenwurf={gnadenwurf}
				setGnadenwurf={setGnadenwurf}
			/>
			
			<Table 
				tableID={id_upperTable}
				session={session}
				tableColumns={tableColumns}
				getPlayer={getPlayer}
				inputType={inputType}
				onblurEvent={(e) => onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)}
				removeFocusEvent={removeFocusEvent}
			/>
			<Table 
				tableID={id_bottomTable}
				session={session}
				tableColumns={tableColumns}
				getPlayer={getPlayer}
				inputType={inputType}
				onblurEvent={(e) => onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)}
				removeFocusEvent={removeFocusEvent}
			/>

		</>
	)
}

export default Game
