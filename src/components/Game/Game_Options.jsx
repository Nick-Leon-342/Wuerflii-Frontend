

import './scss/Game_Options.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../Popup/Popup'
import Loader from '../Loader/Loader'
import LoaderBox from '../Loader/Loader_Box'





/**
 * 
 * Game_Options component that provides game settings, such as input type selection, score visibility toggle,
 * player management, and options for starting a new game or surrendering.
 *
 * @component
 * @example
 * // Example usage of Game_Options component
 * <Game_Options 
 *   setShow_surrender={setShowSurrender} 
 *   setShow_options={setShowOptions} 
 *   show_options={showOptions} 
 *   setSession={setSession} 
 *   session={session} 
 * />
 *
 * @param {Object} props - The component props
 * @param {Function} props.setShow_surrender - Function to show/hide surrender option
 * @param {Function} props.setShow_options - Function to show/hide options popup
 * @param {boolean} props.show_options - Boolean value to control visibility of the options popup
 * @param {Function} props.setSession - Function to update the session state
 * @param {Object} props.session - The current game session object, containing details like input type and show scores option
 *
 * @returns {JSX.Element} The rendered Game_Options component
 * 
 */

export default function Game_Options({
	setShow_surrender, 

	setShow_options, 
	show_options, 

	setSession, 
	session, 
}) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading_newGame, setLoading_newGame ] = useState(false)
	const [ loading_inputType, setLoading_inputType ] = useState(false)
	const [ loading_showScores, setLoading_showScores ] = useState(false)
	




	const change_inputType = ( e ) => {

		const v = e.target.value
		setLoading_inputType(true)

		axiosPrivate.patch('/session', {
			SessionID: session.id, 
			InputType: v
		}).then(() => {

			setSession(prev => {
				const tmp = { ...prev }
				tmp.InputType = v
				return tmp
			})

		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => {
					alert('Session nicht gefunden.')
					navigate('/', { replace: true })
				}
			})

		}).finally(() => setLoading_inputType(false))

	}

	const change_showScores = ( e ) => {

		const v = e.target.checked
		setLoading_showScores(true)

		axiosPrivate.patch('/session', {
			SessionID: session.id, 
			ShowScores: v
		}).then(() => {

			setSession(prev => {
				const tmp = { ...prev }
				tmp.ShowScores = v
				return tmp
			})

		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => {
					alert('Session nicht gefunden.')
					navigate('/', { replace: true })
				}
			})

		}).finally(() => setLoading_showScores(false))

	}

	const new_game = () => {

		if(!window.confirm('Sicher, dass dieses Spiel gelöscht werden soll?')) return 
		setLoading_newGame(true)
	
		axiosPrivate.delete(`/game?session_id=${session.id}`).then(() => {

			navigate('/', { replace: true })

		}).catch((err) => {

			handle_error({ 
				err 
			})

		}).finally(() =>  setLoading_newGame(false))
	
	}





	return <>
		<Popup
			title='Einstellungen'
			showPopup={show_options}
			setShowPopup={setShow_options}
		>
			<div className='game_options'>

				{/* __________________________________________________ InputType __________________________________________________ */}

				<section>
					<label>Eingabetyp</label>

					{loading_inputType && <LoaderBox className='game_options_loader-inputtype' dark={true}/>}

					{!loading_inputType && <>
						<select
							value={session?.InputType}
							onChange={change_inputType}
						>
							<option value='select' key='select'>Auswahl</option>
							<option value='select_and_type' key='select_and_type'>Auswahl und Eingabe</option>
							<option value='type' key='type'>Eingabe</option>
						</select>
					</>}
				</section>



				{/* __________________________________________________ ShowScores __________________________________________________ */}

				<section>
					<label>Summe anzeigen</label>

					{loading_showScores && <LoaderBox className='game_options_loader-showscores' dark={true}/>}

					{!loading_showScores && <>
						<input
							type='checkbox'
							checked={session?.ShowScores}
							onChange={change_showScores}
						/>
					</>}
				</section>



				{/* __________________________________________________ Edit __________________________________________________ */}

				<section>
					<label>Spieler bearbeiten</label>

					<button
						onClick={() => navigate(`/session/${session.id}/players`, { replace: false })} 
						className='button button-reverse button-responsive edit'
					><svg viewBox='0 -960 960 960'><path d='M400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18h14q6 0 12 2-8 18-13.5 37.5T404-360h-4q-71 0-127.5 18T180-306q-9 5-14.5 14t-5.5 20v32h252q6 21 16 41.5t22 38.5H80Zm560 40-12-60q-12-5-22.5-10.5T584-204l-58 18-40-68 46-40q-2-14-2-26t2-26l-46-40 40-68 58 18q11-8 21.5-13.5T628-460l12-60h80l12 60q12 5 22.5 11t21.5 15l58-20 40 70-46 40q2 12 2 25t-2 25l46 40-40 68-58-18q-11 8-21.5 13.5T732-180l-12 60h-80Zm40-120q33 0 56.5-23.5T760-320q0-33-23.5-56.5T680-400q-33 0-56.5 23.5T600-320q0 33 23.5 56.5T680-240ZM400-560q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Zm12 400Z'/></svg></button>
				</section>



				{/* __________________________________________________ Surrender __________________________________________________ */}

				<section>
					<button 
						className='button button-red-reverse'
						onClick={() => setShow_surrender(true)}
					>Aufgeben</button>
				</section>



				{/* __________________________________________________ New Game __________________________________________________ */}

				<section>
					{loading_newGame && <Loader loading={true}/>}
					{!loading_newGame && <>
						<button 
							onClick={new_game} 
							className='button button-reverse'
						>Neues Spiel</button>
					</>}
				</section>

			</div>
		</Popup>
	</>
}
