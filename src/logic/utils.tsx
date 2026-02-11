

import type { TFunction } from 'i18next'

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
		renderTd: 			(t: TFunction) => (<>
			<td>
				<DiceOne/>
				<DiceOne/>
				<DiceOne/>
			</td>
			<td><label>{t('game.ones')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_2', 
		Possible_Entries: 	Possible_Entries__Upper_Table_2,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<DiceTwo/>
				<DiceTwo/>
				<DiceTwo/>
			</td>
			<td><label>{t('game.twos')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_3', 
		Possible_Entries: 	Possible_Entries__Upper_Table_3,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<DiceThree/>
				<DiceThree/>
				<DiceThree/>
			</td>
			<td><label>{t('game.threes')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_4', 
		Possible_Entries: 	Possible_Entries__Upper_Table_4,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<DiceFour/>
				<DiceFour/>
				<DiceFour/>
			</td>
			<td><label>{t('game.fours')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_5', 
		Possible_Entries: 	Possible_Entries__Upper_Table_5,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<DiceFive/>
				<DiceFive/>
				<DiceFive/>
			</td>
			<td><label>{t('game.fives')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_6', 
		Possible_Entries: 	Possible_Entries__Upper_Table_6,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<DiceSix/>
				<DiceSix/>
				<DiceSix/>
			</td>
			<td><label>{t('game.sixes')}</label></td>
		</>), 
	}, {
		Name: 'Upper_Table_Score', 
		Border_Top: true, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.points')}</label></td>
			<td><ArrowLeft/></td>
		</>), 
	}, {
		Name: 'Upper_Table_Add35', 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.uppertable_bonus_if_63')}</label></td>
			<td><label>{t('game.uppertable_add_35')}</label></td>
		</>), 
	}, {
		Name: 'Upper_Table_TotalScore', 
		Border_Bottom: true, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.uppertable_total')}</label></td>
			<td><ArrowLeft/></td>
		</>), 
	},





	{
		Name: 'Blank', 
	},





	{
		Name: 				'Bottom_Table_1', 
		Border_Top: 		true, 
		Possible_Entries: 	Possible_Entries__Bottom_Table_1,
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.three_kind')}</label></td>
			<td><label>{t('game.all_dice_count')}</label></td>
		</>), 
	}, {
		Name: 				'Bottom_Table_2', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_2,
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.four_kind')}</label></td>
			<td><label>{t('game.all_dice_count')}</label></td>
		</>), 
	}, {
		Name: 				'Bottom_Table_3', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_3, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.full_house')}</label></td>
			<td><label>{t('game.all_dice_count')}</label></td>
		</>), 
	}, {
		Name: 				'Bottom_Table_4', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_4, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.small_straight')}</label></td>
			<td><label>30 {t('game.points')}</label></td>
		</>), 
	}, {
		Name: 				'Bottom_Table_5', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_5, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.large_straight')}</label></td>
			<td><label>40 {t('game.points')}</label></td>
		</>), 
	}, {
		Name: 				'Bottom_Table_6', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_6, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.wuerflii')}</label></td>
			<td><label>50 {t('game.points')}</label></td>
		</>), 
	}, {
		Name: 				'Bottom_Table_7', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_7, 
		Border_Bottom: 		true, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.chance')}</label></td>
			<td><label>{t('game.all_dice_count')}</label></td>
		</>), 
	}, {
		Name: 'Bottom_Table_Score', 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.points')}</label></td>
			<td><ArrowLeft/></td>
		</>), 
	}, {
		Name: 'Upper_Table_TotalScore', 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.uppertable_total')}</label></td>
			<td><ArrowLeft/></td>
		</>), 
	}, {
		Name: 'Bottom_Table_TotalScore', 
		Border_Bottom: true, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.total')}</label></td>
			<td><ArrowLeft/></td>
		</>), 
	}

]
