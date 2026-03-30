

import type { TFunction } from 'i18next'

import Dice_1 from '../svg/Dice_1.svg?react'
import Dice_2 from '../svg/Dice_2.svg?react'
import Dice_3 from '../svg/Dice_3.svg?react'
import Dice_4 from '../svg/Dice_4.svg?react'
import Dice_5 from '../svg/Dice_5.svg?react'
import Dice_6 from '../svg/Dice_6.svg?react'
import { MoveRight } from 'lucide-react'

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
export const darkMode_string = 'Wuerflii_DarkMode'





export const list_rows: Array<Type__Row> = [

	{
		Name: 				'Upper_Table_1', 
		Possible_Entries: 	Possible_Entries__Upper_Table_1,
		Border_Top: 		true, 
		renderTd: 			(t: TFunction) => (<>
			<td>
				<Dice_1/>
				<Dice_1/>
				<Dice_1/>
			</td>
			<td><label>{t('game.ones')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_2', 
		Possible_Entries: 	Possible_Entries__Upper_Table_2,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<Dice_2/>
				<Dice_2/>
				<Dice_2/>
			</td>
			<td><label>{t('game.twos')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_3', 
		Possible_Entries: 	Possible_Entries__Upper_Table_3,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<Dice_3/>
				<Dice_3/>
				<Dice_3/>
			</td>
			<td><label>{t('game.threes')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_4', 
		Possible_Entries: 	Possible_Entries__Upper_Table_4,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<Dice_4/>
				<Dice_4/>
				<Dice_4/>
			</td>
			<td><label>{t('game.fours')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_5', 
		Possible_Entries: 	Possible_Entries__Upper_Table_5,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<Dice_5/>
				<Dice_5/>
				<Dice_5/>
			</td>
			<td><label>{t('game.fives')}</label></td>
		</>), 
	}, {
		Name: 				'Upper_Table_6', 
		Possible_Entries: 	Possible_Entries__Upper_Table_6,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<Dice_6/>
				<Dice_6/>
				<Dice_6/>
			</td>
			<td><label>{t('game.sixes')}</label></td>
		</>), 
	}, {
		Name: 'Upper_Table_Score', 
		Border_Top: true, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.points')}</label></td>
			<td><MoveRight/></td>
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
			<td><MoveRight/></td>
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
			<td><MoveRight/></td>
		</>), 
	}, {
		Name: 'Upper_Table_TotalScore', 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.uppertable_total')}</label></td>
			<td><MoveRight/></td>
		</>), 
	}, {
		Name: 'Bottom_Table_TotalScore', 
		Border_Bottom: true, 
		renderTd: 			(t: TFunction) => (<>
			<td><label>{t('game.total')}</label></td>
			<td><MoveRight/></td>
		</>), 
	}

]
