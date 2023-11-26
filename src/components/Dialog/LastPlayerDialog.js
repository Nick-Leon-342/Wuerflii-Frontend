

import { getPlayer } from "../../logic/utils";





export default function LastPlayerDialog({ id, lastPlayerAlias, session }) {

	return (

		<dialog id={id} className='modal'>

				<p style={{ fontSize: '25px', marginTop: '20px' }}>
					{!lastPlayerAlias 
						? 'Bis jetzt war noch keiner dran!'
						: (
							<>
								{'\'' + getPlayer(lastPlayerAlias, session)?.Name + '\' war als letztes dran.'}<br />
							</>
						)
					}
				</p>

				<button className='button' style={{ width: '100%', height: '40px' }} onClick={() => document.getElementById(id).close()}>Ok</button>

			</dialog>

	)

}
