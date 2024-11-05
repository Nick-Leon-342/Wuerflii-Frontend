

import { useNavigate } from 'react-router-dom'
import { id_playerTable } from '../../logic/utils'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'





export default function PlayerTable({ 
	list_players, 
	tableWidth, 
	lastPlayerAlias, 
	disabled, 
	setShow_lastPlayer, 
}) {
  
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()





	const handleGnadenwurfChange = async (alias, checked) => {

		// const before = { ...gnadenwurf }
		// const g = { ...gnadenwurf }
		// g[alias] = checked
		// setGnadenwurf(g)


		// for(let i = 0; 100 > i; i++) {

		// 	let tryagain = false
	
		// 	await axiosPrivate.post('/game/gnadenwurf', { Gnadenwürfe: g, JoinCode: joincode }).catch((err) => {

		// 		if(err.response.status === 404) {
		// 			window.alert('Das Spiel wurde nicht gefunden!')
		// 			return navigate('/selectsession', { replace: true })
		// 		} else if(err.response.status === 400) {
		// 			window.alert('Client-Anfrage ist falsch!')
		// 		} else {
		// 			tryagain = window.confirm('Der Gnadenwurf wurde nicht gespeichert.\nErneut versuchen?')
		// 			console.log(err)
		// 			if(!tryagain) setGnadenwurf(before)
		// 		}

		// 	})

		// 	if(tryagain) continue
		// 	break

		// }

	}

	const calculateScore = ( player ) => {

		let sum = 0
		for(const tc of player.List_Table_Columns) { sum += tc.TotalScore }
		return sum

	}





	return (

		<table id={id_playerTable} className='table table_player' style={{ minWidth: tableWidth, width: tableWidth, maxWidth: tableWidth }}>
			<tbody>



				{/* __________________________________________________ Names __________________________________________________ */}

				<tr>

					<td>
						<span>Spieler </span>
						{!disabled && <svg className='button-responsive' onClick={() => setShow_lastPlayer(true)} height='18' viewBox='0 -960 960 960'><path d='M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'/></svg>}
					</td>

					{list_players?.map((p, i) => 
						<td key={i}>
							<span style={{ 
								fontWeight: lastPlayerAlias === p.Alias ? 'bold' : '',
								color: lastPlayerAlias === p.Alias ? 'var(--green)' : '',
							}}>
								{p.Name}
							</span>
						</td>
					)}

				</tr>



				{/* __________________________________________________ Scores __________________________________________________ */}

				{!sessionStorage.ShowScores && 
					<tr>

						<td>Spieler gesamt</td>

						{list_players?.map((p, i) => 
							<td key={i}>
								<span>{calculateScore(p)}</span>
							</td>
						)}

					</tr>
				}



				{/* __________________________________________________ Gnadenwurf __________________________________________________ */}

				{!disabled && <tr>

					<td>Gnadenwurf</td>

					{list_players?.map((p, i) => 
						<td key={i}>
							<div className='checkbox-container'>
								
								<input 
									className='button-responsive' 
									type='checkbox' 
									checked={p.Gnadenwurf}
									onChange={(e) => handleGnadenwurfChange(p.Alias, e.target.checked)} 
								/>

							</div>
						</td>
					)}

				</tr>}
			</tbody>
		</table>

	)

}
