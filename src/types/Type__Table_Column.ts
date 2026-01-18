

import type { Possible_Entries__Upper_Table_1 } from '../logic/Possible_Entries/Possible_Entries__Upper_Table_1'
import type { Possible_Entries__Upper_Table_2 } from '../logic/Possible_Entries/Possible_Entries__Upper_Table_2'
import type { Possible_Entries__Upper_Table_3 } from '../logic/Possible_Entries/Possible_Entries__Upper_Table_3'
import type { Possible_Entries__Upper_Table_4 } from '../logic/Possible_Entries/Possible_Entries__Upper_Table_4'
import type { Possible_Entries__Upper_Table_5 } from '../logic/Possible_Entries/Possible_Entries__Upper_Table_5'
import type { Possible_Entries__Upper_Table_6 } from '../logic/Possible_Entries/Possible_Entries__Upper_Table_6'

import type { Possible_Entries__Bottom_Table_1 } from '../logic/Possible_Entries/Possible_Entries__Bottom_Table_1'
import type { Possible_Entries__Bottom_Table_2 } from '../logic/Possible_Entries/Possible_Entries__Bottom_Table_2'
import type { Possible_Entries__Bottom_Table_3 } from '../logic/Possible_Entries/Possible_Entries__Bottom_Table_3'
import type { Possible_Entries__Bottom_Table_4 } from '../logic/Possible_Entries/Possible_Entries__Bottom_Table_4'
import type { Possible_Entries__Bottom_Table_5 } from '../logic/Possible_Entries/Possible_Entries__Bottom_Table_5'
import type { Possible_Entries__Bottom_Table_6 } from '../logic/Possible_Entries/Possible_Entries__Bottom_Table_6'
import type { Possible_Entries__Bottom_Table_7 } from '../logic/Possible_Entries/Possible_Entries__Bottom_Table_7'





export interface Type__Table_Columns {
	id: 						number
	Column: 					number

	Upper_Table_1: 				typeof Possible_Entries__Upper_Table_1[number]
	Upper_Table_2: 				typeof Possible_Entries__Upper_Table_2[number]
	Upper_Table_3: 				typeof Possible_Entries__Upper_Table_3[number]
	Upper_Table_4: 				typeof Possible_Entries__Upper_Table_4[number]
	Upper_Table_5: 				typeof Possible_Entries__Upper_Table_5[number]
	Upper_Table_6: 				typeof Possible_Entries__Upper_Table_6[number]

	Upper_Table_Score: 			number
	Upper_Table_Add35: 			number
	Upper_Table_TotalScore: 	number


	Bottom_Table_1: 			typeof Possible_Entries__Bottom_Table_1[number]
	Bottom_Table_2: 			typeof Possible_Entries__Bottom_Table_2[number]
	Bottom_Table_3: 			typeof Possible_Entries__Bottom_Table_3[number]
	Bottom_Table_4: 			typeof Possible_Entries__Bottom_Table_4[number]
	Bottom_Table_5: 			typeof Possible_Entries__Bottom_Table_5[number]
	Bottom_Table_6: 			typeof Possible_Entries__Bottom_Table_6[number]
	Bottom_Table_7: 			typeof Possible_Entries__Bottom_Table_7[number]

	Bottom_Table_Score: 		number
	Bottom_Table_TotalScore: 	number

	TotalScore: 				number
}
