

import './scss/Game_Options.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../Popup/Popup'
import Loader from '../Loader/Loader'
import LoaderBox from '../Loader/Loader_Box'





export default function Game_Options({
	setShow_surrender, 
	setShow_edit, 

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
					navigate('/session/select', { replace: true })
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
					navigate('/session/select', { replace: true })
				}
			})

		}).finally(() => setLoading_showScores(false))

	}

	const new_game = () => {

		if(!window.confirm('Sicher, dass dieses Spiel gelöscht werden soll?')) return 
		setLoading_newGame(true)
	
		axiosPrivate.delete(`/game?session_id=${session.id}`).then(() => {

			navigate('/session/select', { replace: true })

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
					<label>Bearbeiten</label>

					<button
						onClick={() => setShow_edit(true)} 
						className='button button-reverse button-responsive edit'
					><svg viewBox='0 -960 960 960'><path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z'/></svg></button>
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
