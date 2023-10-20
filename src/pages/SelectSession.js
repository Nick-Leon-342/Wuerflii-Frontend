

import '../App.css'
import './css/SelectSession.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, resizeEvent, sessionStorage_attributes, sessionStorage_players } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


function SelectSession() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [list, setList] = useState([])
	const [list_checkbox] = useState([])
	const [disabled, setDisabled] = useState(true)
	const [loaderVisible, setLoaderVisible] = useState(false)
	
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
			
			tmp.sort(sortByTimestampDesc)
			setList(tmp)
		})

		resizeEvent()

	}, [])

	const sortByTimestampDesc = (a, b) => {
		return new Date(b.Attributes.LastPlayed) - new Date(a.Attributes.LastPlayed)
	}





	const handleDelete = async () => {

		if(disabled) return
		setLoaderVisible(true)

		if((window.confirm('Bist du sicher, dass du diese Session(s) löschen möchtest?'))) {
			for(let i = 0; list_checkbox.length > i; i++) {
				if(list_checkbox[i]) {
					await axiosPrivate.delete('/selectsession',
						{
							headers: { 'Content-Type': 'application/json' },
							withCredentials: true,
							params: list[i].Attributes
						}
					).catch((e) => {
						console.log(e)
					})


				}
			}
		}

		setLoaderVisible(false)
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
			<div className={`trashcan-container`}>
				<svg className={`${disabled ? 'disabled' : ''}`} onClick={handleDelete} viewBox="-0.5 -0.5 458 510"><g><rect x="58" y="55" width="340" height="440" rx="51" ry="51" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="30" pointerEvents="all"/><rect x="15" y="55" width="427" height="30" rx="4.5" ry="4.5" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="30" pointerEvents="all"/><rect x="125" y="145" width="50" height="280" rx="9" ry="9" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="50" pointerEvents="all"/><rect x="275" y="145" width="50" height="280" rx="9" ry="9" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="50" pointerEvents="all"/><rect x="158" y="15" width="142" height="30" rx="4.5" ry="4.5" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="30" pointerEvents="all"/></g></svg>
				<div className={`loader ${loaderVisible ? '' : 'notVisible'}`}>
					<span/>
					<span/>
					<span/>
				</div>
			</div>
			<dl className='sessionList'>
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
								<label className='label date'>{formatDate(s.Attributes.LastPlayed)}</label>
							</div>
						</dt>
					))
				)}
			</dl>
			
			<div style={{ display: 'flex'}}>
				<p className='link-switch'>
					<Link to='/creategame'>Erstelle Spiel</Link>
				</p>
			</div>

		</>
	)
}

export default SelectSession
