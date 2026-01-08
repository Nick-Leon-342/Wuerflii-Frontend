

import DiceOne from '../svg/Dice_One.svg?react'
import DiceTwo from '../svg/Dice_Two.svg?react'
import DiceThree from '../svg/Dice_Three.svg?react'
import DiceFour from '../svg/Dice_Four.svg?react'
import DiceFive from '../svg/Dice_Five.svg?react'
import DiceSix from '../svg/Dice_Six.svg?react'
import ArrowLeft from '../svg/Arrow_Left.svg?react'

import type { Type__Row } from '../types/Type__Row'

import { Possible_Entries__Upper_Table_1 } from './Possible_Entries/Possible_Entries__Upper_Table_1'
import { Possible_Entries__Upper_Table_2 } from './Possible_Entries/Possible_Entries__Upper_Table_2'
import { Possible_Entries__Upper_Table_3 } from './Possible_Entries/Possible_Entries__Upper_Table_3'
import { Possible_Entries__Upper_Table_4 } from './Possible_Entries/Possible_Entries__Upper_Table_4'
import { Possible_Entries__Upper_Table_5 } from './Possible_Entries/Possible_Entries__Upper_Table_5'
import { Possible_Entries__Upper_Table_6 } from './Possible_Entries/Possible_Entries__Upper_Table_6'

import { Possible_Entries__Bottom_Table_1 } from './Possible_Entries/Possible_Entries__Bottom_Table_1'
import { Possible_Entries__Bottom_Table_2 } from './Possible_Entries/Possible_Entries__Bottom_Table_2'
import { Possible_Entries__Bottom_Table_3 } from './Possible_Entries/Possible_Entries__Bottom_Table_3'
import { Possible_Entries__Bottom_Table_4 } from './Possible_Entries/Possible_Entries__Bottom_Table_4'
import { Possible_Entries__Bottom_Table_5 } from './Possible_Entries/Possible_Entries__Bottom_Table_5'
import { Possible_Entries__Bottom_Table_6 } from './Possible_Entries/Possible_Entries__Bottom_Table_6'
import { Possible_Entries__Bottom_Table_7 } from './Possible_Entries/Possible_Entries__Bottom_Table_7'

export const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api' // '/api' is for production so that no URL has to be entered and ReactJS resolves the backend URL through nginx.conf





export function formatDate(date: Date): string {

	const d = new Date(date)
	const day = d.getDate()
	const month = d.getMonth() + 1
	const year = d.getFullYear()

	const formattedDay = day < 10 ? `0${day}` : `${day}`
	const formattedMonth = month < 10 ? `0${month}` : `${month}`

	return `${formattedDay}.${formattedMonth}.${year}`

}




export const list_rows: Array<Type__Row> = [

	{
		Name: 				'Upper_Table_1', 
		Possible_Entries: 	Possible_Entries__Upper_Table_1,
		Border_Top: 		true, 
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
		Name: 				'Upper_Table_2', 
		Possible_Entries: 	Possible_Entries__Upper_Table_2,
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
		Name: 				'Upper_Table_3', 
		Possible_Entries: 	Possible_Entries__Upper_Table_3,
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
		Name: 				'Upper_Table_4', 
		Possible_Entries: 	Possible_Entries__Upper_Table_4,
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
		Name: 				'Upper_Table_5', 
		Possible_Entries: 	Possible_Entries__Upper_Table_5,
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
		Name: 				'Upper_Table_6', 
		Possible_Entries: 	Possible_Entries__Upper_Table_6,
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
		Name: 				'Bottom_Table_1', 
		Border_Top: 		true, 
		Possible_Entries: 	Possible_Entries__Bottom_Table_1,
		td: 
		<>
			<td><label>Dreierpasch</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>,
	}, {
		Name: 				'Bottom_Table_2', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_2,
		td:
		<>
			<td><label>Viererpasch</label></td>
			<td><label>alle Augen<br/>zählen</label></td>
		</>, 
	}, {
		Name: 				'Bottom_Table_3', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_3, 
		td: 
		<>
			<td><label>Full-House</label></td>
			<td><label>25<br/>Punkte</label></td>
		</>,
	}, {
		Name: 				'Bottom_Table_4', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_4, 
		td:
		<>
			<td><label>Kleine Straße</label></td>
			<td><label>30<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 				'Bottom_Table_5', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_5, 
		td: 
		<>
			<td><label>Große Straße</label></td>
			<td><label>40<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 				'Bottom_Table_6', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_6, 
		td:
		<>
			<td><label>Wuerflii</label></td>
			<td><label>50<br/>Punkte</label></td>
		</>, 
	}, {
		Name: 				'Bottom_Table_7', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_7, 
		Border_Bottom: 		true, 
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
