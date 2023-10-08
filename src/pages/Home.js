

import '../App.css'
import './css/Home.css'

import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'


function Home() {

	const { setAuth } = useAuth()
	const [user, setUser] = useState()
	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()

	const refresh = () => {
		axiosPrivate.get('/home').then((res) => {
            // setUser(res.data)
			console.log(res.data)
        }).catch((err) => console.log('ERROR', err))
	}

	const logout = () => {
		axiosPrivate.delete('/logout').then((res) => {
			if(res.status === 204) {
				setAuth({ accessToken: '' })
				navigate('/login', { replace: true })
			}
		})
	}





	//____________________Sidemenu-slide____________________

	const width = 300
	const [menuPosition, setMenuPosition] = useState(-width);
	const [currentPosition, setCurrentPosition] = useState(-width)
	const [startingX, setStartingX] = useState(0)

	const touchStart = (e) => {setStartingX(e.touches[0].clientX)}

	const touchMove = (e) => {
		
		const movingX = e.touches[0].clientX
		const tmp = movingX - startingX
		let distance

		if(currentPosition === 0) {distance = tmp > 0 ? 0 : (tmp < -width ? -width : tmp)
		} else {distance = tmp < 0 ? 0 : (tmp > width ? width : tmp)}
		setMenuPosition(currentPosition + distance)

	}

	const touchEnd = () => {

		let tmp = menuPosition >= -(width / 2) ? 0 : -width
		setMenuPosition(tmp)
		setCurrentPosition(tmp)

	}





	//____________________MinimizeSidemenuOnClick____________________

	const sidemenuRef = useRef(null);

	const handleClickOutsideSidebar = (event) => {
		if (sidemenuRef.current && !sidemenuRef.current.contains(event.target)) {
			setMenuPosition(-width)
			setCurrentPosition(-width)
		}
	};
  
	useEffect(() => {
		document.addEventListener('click', handleClickOutsideSidebar)

		// axiosPrivate.get('/home').then((res) => {
        //     // setUser(res.data)
		// 	console.log(res.data)
        // }).catch((err) => {
		// 	navigate('/login')
		// })

		return () => {document.removeEventListener('click', handleClickOutsideSidebar)}
	}, [])		//empty dependency array so that the function will be executed only once in the beginning





	return (
		<div onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd}>

			<div className={`sidemenu`} style={{ left: `${menuPosition}px` }} ref={sidemenuRef}>
				<div>Test</div>
				<br/>
				<button onClick={refresh}>Refresh</button>
				<br/><br/>
				<button onClick={logout}>Logout</button>
			</div>

			<div className='headerpanel'>
				<label className='welcome'>Willkommen zurück.</label>
			</div>

			<div className='mainpanel'>

				<div className='cashflow'>
					<label id='cashflow'>Cashflow</label>
					<div className='money'>
						<div className='moneyBlub'>
							<label className='moneyBlub-header'>Einnahmen</label>
							<label className='moneyBlub-text'>2500,00 €</label>
						</div>
						<div className='moneyBlub'>
							<label className='moneyBlub-header'>Ausgaben</label>
							<label className='moneyBlub-text'>187,00 €</label>
						</div>
					</div>
				</div>

				<div className='trend'>

				</div>

			</div>

		</div>
	)
}

export default Home
