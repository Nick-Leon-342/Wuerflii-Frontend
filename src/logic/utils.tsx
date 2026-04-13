

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

export const darkMode_string = 'Wuerflii_DarkMode'



// ____________________ ENV-Variables ____________________

export const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api' // '/api' is for production so that no URL has to be entered and ReactJS resolves the backend URL through nginx.conf

export const COLOR__REGEX: RegExp = /^#([0-9A-Fa-f]{3}){1,2}$/


// ____________________ User ____________________

export const NAME__MIN_CHARACTER 			: number	= +(import.meta.env.USER_NAME__MIN_CHARACTER || 4)
export const NAME__MAX_CHARACTER 			: number	= +(import.meta.env.USER_NAME__MAX_CHARACTER || 64)

export const NAME__REGEX					: string	= `^[A-z][A-z0-9-_]{${NAME__MIN_CHARACTER - 1},${NAME__MAX_CHARACTER - 1}}$`
export const NAME__REGEX_MINMAX 			: string	= `^.{${NAME__MIN_CHARACTER},${NAME__MAX_CHARACTER}}$`
export const NAME__REGEX_LETTERFIRST 		: string	= '^[A-z]'
export const NAME__REGEX_ALLOWEDCHARS 		: string	= '^[a-zA-Z0-9_-]+$'


export const PASSWORD__MIN_CHARACTER 		: number	= +(import.meta.env.USER_PASSWORD__MIN_CHARACTER || 8)
export const PASSWORD__MAX_CHARACTER 		: number	= +(import.meta.env.USER_PASSWORD__MAX_CHARACTER || 128)

export const PASSWORD__REGEX 				: string	= `^(?=.*[-_!#%@$])[a-zA-Z0-9-_!#%@$]{${PASSWORD__MIN_CHARACTER},${PASSWORD__MAX_CHARACTER}}$`
export const PASSWORD__REGEX_MINMAX 		: string	= `^.{${PASSWORD__MIN_CHARACTER},${PASSWORD__MAX_CHARACTER}}$`
export const PASSWORD__REGEX_ALLOWEDCHARS 	: string	= '[a-zA-Z0-9]+'
export const PASSWORD__REGEX_ALLOWEDSYMBOLS : string	= '[-_!#%@$]+'


// ____________________ Game ____________________

export const MAX_LENGTH_SESSION_NAME 	: number	= +(import.meta.env.VITE__MAX_LENGTH_SESSION_NAME	|| 50)
export const MAX_LENGTH_PLAYER_NAME 	: number	= +(import.meta.env.VITE__MAX_LENGTH_PLAYER_NAME	|| 50)
export const MAX_PLAYERS 				: number	= +(import.meta.env.VITE__MAX_PLAYERS				|| 16)
export const MAX_COLUMNS 				: number	= +(import.meta.env.VITE__MAX_COLUMNS				|| 10)
export const MAX_FINALSCORES_LIMIT 		: number	= +(import.meta.env.VITE__MAX_FINALSCORES_LIMIT	|| 10)










// __________________________________________________ Possible Entries __________________________________________________

const TD_Text = ({ text }: { text: string }) => { return <td><span dangerouslySetInnerHTML={{ __html: text }}/></td> }

export const list_rows: Array<Type__Row> = [

	{
		Name: 				'Upper_Table_1', 
		Possible_Entries: 	Possible_Entries__Upper_Table_1,
		renderTd: 			(t: TFunction) => (<>
			<td>
				<Dice_1/>
				<Dice_1/>
				<Dice_1/>
			</td>
			<TD_Text text={t('game.ones')}/>
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
			<TD_Text text={t('game.twos')}/>
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
			<TD_Text text={t('game.threes')}/>
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
			<TD_Text text={t('game.fours')}/>
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
			<TD_Text text={t('game.fives')}/>
		</>), 
	}, {
		Name: 				'Upper_Table_6', 
		Possible_Entries: 	Possible_Entries__Upper_Table_6,
		Border_Bottom: true, 
		renderTd: 			(t: TFunction) => (<>
			<td>
				<Dice_6/>
				<Dice_6/>
				<Dice_6/>
			</td>
			<TD_Text text={t('game.sixes')}/>
		</>), 
	}, {
		Name: 'Upper_Table_Score', 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.points')}/>
			<td><MoveRight/></td>
		</>), 
	}, {
		Name: 'Upper_Table_Add35', 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.uppertable_bonus_if_63')}/>
			<TD_Text text={t('game.uppertable_add_35')}/>
		</>), 
	}, {
		Name: 'Upper_Table_TotalScore', 
		Border_Bottom: true, 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.uppertable_total')}/>
			<td><MoveRight/></td>
		</>), 
	},





	{
		Name: 'Blank', 
	},





	{
		Name: 				'Bottom_Table_1', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_1,
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.three_kind')}/>
			<TD_Text text={t('game.all_dice_count')}/>
		</>), 
	}, {
		Name: 				'Bottom_Table_2', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_2,
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.four_kind')}/>
			<TD_Text text={t('game.all_dice_count')}/>
		</>), 
	}, {
		Name: 				'Bottom_Table_3', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_3, 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.full_house')}/>
			<TD_Text text={'25 ' + t('game.points')}/>
		</>), 
	}, {
		Name: 				'Bottom_Table_4', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_4, 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.small_straight')}/>
			<TD_Text text={'30 ' + t('game.points')}/>
		</>), 
	}, {
		Name: 				'Bottom_Table_5', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_5, 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.large_straight')}/>
			<TD_Text text={'40 ' + t('game.points')}/>
		</>), 
	}, {
		Name: 				'Bottom_Table_6', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_6, 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.wuerflii')}/>
			<TD_Text text={'50 ' + t('game.points')}/>
		</>), 
	}, {
		Name: 				'Bottom_Table_7', 
		Possible_Entries: 	Possible_Entries__Bottom_Table_7, 
		Border_Bottom: 		true, 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.chance')}/>
			<TD_Text text={t('game.all_dice_count')}/>
		</>), 
	}, {
		Name: 'Bottom_Table_Score', 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.points')}/>
			<td><MoveRight/></td>
		</>), 
	}, {
		Name: 'Upper_Table_TotalScore', 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.uppertable_total')}/>
			<td><MoveRight/></td>
		</>), 
	}, {
		Name: 'Bottom_Table_TotalScore', 
		renderTd: 			(t: TFunction) => (<>
			<TD_Text text={t('game.total')}/>
			<td><MoveRight/></td>
		</>), 
	}

]
