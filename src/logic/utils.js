

import { ReactComponent as DiceOne } from '../svg/Dice_One.svg'
import { ReactComponent as DiceTwo } from '../svg/Dice_Two.svg'
import { ReactComponent as DiceThree } from '../svg/Dice_Three.svg'
import { ReactComponent as DiceFour } from '../svg/Dice_Four.svg'
import { ReactComponent as DiceFive } from '../svg/Dice_Five.svg'
import { ReactComponent as DiceSix } from '../svg/Dice_Six.svg'
import { ReactComponent as ArrowLeft } from '../svg/Arrow_Left.svg'

export const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '/api' // '/api' is for production so that no URL has to be entered and ReactJS resolves the backend URL through nginx.conf





export const formatDate = date => {

	const d = new Date(date)
	const day = d.getDate()
	const month = d.getMonth() + 1
	const year = d.getFullYear()

	const formattedDay = day < 10 ? `0${day}` : `${day}`
	const formattedMonth = month < 10 ? `0${month}` : `${month}`

	return `${formattedDay}.${formattedMonth}.${year}`

}





export const list_rows = [

	{
		Name: 'Upper_Table_1', 
		Possible_Entries: [ 0, 1, 2, 3, 4, 50 ],
		Border_Top: true, 
		td:
		<>
			<td>
				<DiceOne/>
				<DiceOne/>
				<DiceOne/>
			</td>
			<td><label>Nur Einser<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_2', 
		Possible_Entries: [ 0, 2, 4, 6, 8, 50 ],
		td: 
		<>
			<td>
				<DiceTwo/>
				<DiceTwo/>
				<DiceTwo/>
			</td>
			<td><label>Nur Zweier<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_3', 
		Possible_Entries: [ 0, 3, 6, 9, 12, 50 ],
		td: 
		<>
			<td>
				<DiceThree/>
				<DiceThree/>
				<DiceThree/>
			</td>
			<td><label>Nur Dreier<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_4', 
		Possible_Entries: [ 0, 4, 8, 12, 16, 50 ],
		td: 
		<>
			<td>
				<DiceFour/>
				<DiceFour/>
				<DiceFour/>
			</td>
			<td><label>Nur Vierer<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_5', 
		Possible_Entries: [ 0, 5, 10, 15, 20, 50 ],
		td: 
		<>
			<td>
				<DiceFive/>
				<DiceFive/>
				<DiceFive/>
			</td>
			<td><label>Nur Fünfer<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_6', 
		Possible_Entries: [ 0, 6, 12, 18, 24, 50 ],
		td: 
		<>
			<td>
				<DiceSix/>
				<DiceSix/>
				<DiceSix/>
			</td>
			<td><label>Nur Sechser<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Upper_Table_Score', 
		Border_Top: true, 
		td: 
		<>
			<td>gesamt</td>
			<td><ArrowLeft/></td>
		</>, 
	}, {
		Name: 'Upper_Table_Add35', 
		td: 
		<>
			<td>Bonus bei 63<br/>oder mehr</td>
			<td>plus 35</td>
		</>, 
	}, {
		Name: 'Upper_Table_TotalScore', 
		Border_Bottom: true, 
		td: 
		<>
			<td>gesamt<br/>oberer Teil</td>
			<td><ArrowLeft/></td>
		</>, 
	},





	{
		Name: 'Blank', 
	},





	{
		Name: 'Bottom_Table_1', 
		Border_Top: true, 
		// Possible_Entries: [ 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 50 ],
		Possible_Entries: [ 50, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 0 ], // Feedback from my parents: You often get higher values than lower values
		td: 
		<>
			<td><label>Dreierpasch</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>,
	}, {
		Name: 'Bottom_Table_2', 
		// Possible_Entries: [ 0, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 50 ], 
		Possible_Entries: [ 50, 29, 28, 27, 26, 25, 24, 23, 22, 21, 19, 18, 17, 16, 14, 13, 12, 11, 10, 9, 8, 7, 6, 0 ],  // Feedback from my parents: You often get higher values than lower values
		td:
		<>
			<td><label>Viererpasch</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_3', 
		Possible_Entries: [ 0, 25, 50 ], 
		td: 
		<>
			<td><label>Full-House</label></td>
			<td><label>25<br/>Punkte</label></td>
		</>,
	}, {
		Name: 'Bottom_Table_4', 
		Possible_Entries: [ 0, 30, 40, 50 ], 
		td:
		<>
			<td><label>Kleine Straße</label></td>
			<td><label>30<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_5', 
		Possible_Entries: [ 0, 40, 50 ], 
		td: 
		<>
			<td><label>Große Straße</label></td>
			<td><label>40<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_6', 
		Possible_Entries: [ 0, 50 ], 
		td:
		<>
			<td><label>Wuerflii</label></td>
			<td><label>50<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_7', 
		// Possible_Entries: [ 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 50 ], 
		Possible_Entries: [ 50, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6 ], // Feedback from my parents: You often get higher values than lower values
		Border_Bottom: true, 
		td: 
		<>
			<td><label>Chance</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>, 
	}, {
		Name: 'Bottom_Table_Score', 
		td:
		<>
			<td>gesamt<br/>unterer Teil</td>
			<td><ArrowLeft/></td>
		</>, 
	}, {
		Name: 'Upper_Table_TotalScore', 
		td:
		<>
			<td>gesamt<br/>oberer Teil</td>
			<td><ArrowLeft/></td>
		</>, 
	}, {
		Name: 'Bottom_Table_TotalScore', 
		Border_Bottom: true, 
		td:
		<>
			<td>Endsumme</td>
			<td><ArrowLeft/></td>
		</>
	}

]
