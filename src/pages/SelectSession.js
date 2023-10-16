

import '../App.css'
import './css/SelectSession.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resizeEvent, sessionStorage_attributes, sessionStorage_players } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


function SelectSession() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [list, setList] = useState([])
	const list_checkbox = list.map(() => false)
	const [ disabled, setDisabled] = useState(true)
	
	const message = 'Es gibt noch keine Partie!'





	useEffect(() => {

		axiosPrivate.get('/selectsession').then((res) => {
			const l = res.data
			const tmp = []

			for(const e of l) {
				tmp.push({ 
					Attributes: JSON.parse(e.Attributes), 
					List_Players: JSON.parse(e.List_Players) 
				})
			}
			
			setList(tmp)
		})

		resizeEvent()

	}, [])





	const handleDelete = (e) => {

		if (window.confirm('Bist du sicher, dass du diese Session löschen möchtest?')) {
			console.log('delete')
		}
		window.location.reload()
		
	}





	const handleClick = (element) => {
		
		const i = element.target.closest('dt').getAttribute('index')
		
		sessionStorage.setItem(sessionStorage_attributes, JSON.stringify(list[i].Attributes))
		sessionStorage.setItem(sessionStorage_players, JSON.stringify(list[i].List_Players))

		navigate('/sessionpreview', { replace: false })

	}





	const handleCheckbox = (index, checked) => {

		list_checkbox[index] = checked
		if(checked) {
			setDisabled(false)
		} else {
			for(const e of list_checkbox) {
				if(e) return
			}
			setDisabled(true)
		}

	}





	return (
		<>
			<button disabled={disabled} onClick={handleDelete}>Delete</button>
			<dl id='sessionList'>
				{list.length === 0 ? (
					<dt className='message'>{message}</dt>
				) : (
					list.map((s, i) => (
						<dt className='listElement' index={i} key={i}>
							<input className='checkbox-delete' type='checkbox' onChange={(e) => handleCheckbox(i, e.target.checked)} />

							<div className='container' onClick={handleClick}>
								<label className='label'>
									{s.List_Players.map((p) => p.Name).join(' vs ')}
								</label>
								<label className='label date'>{s.Attributes.CreatedDate}</label>
							</div>
						</dt>
					))
				)}
			</dl>
			
			<p className='loadGames'>
				<Link to='/creategame'>Erstelle Spiel</Link>
			</p>
		</>
	)
}

export default SelectSession
