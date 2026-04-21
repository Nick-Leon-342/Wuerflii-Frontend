

import { createContext, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { Type__ENV_Variables } from '@/types/Type__ENV_Variables'
import { get__env } from '@/api/env'

import { toast } from 'sonner'





const Context__ENV_Variables = createContext<Type__ENV_Variables>({
	NAME__MIN_CHARACTER:				4, 
	NAME__MAX_CHARACTER:				64, 

	NAME__REGEX:						'', 
	NAME__REGEX_MINMAX:					'', 
	NAME__REGEX_LETTERFIRST:			'', 
	NAME__REGEX_ALLOWEDCHARS:			'', 


	PASSWORD__MIN_CHARACTER:			8, 
	PASSWORD__MAX_CHARACTER:			128, 

	PASSWORD__REGEX:					'', 
	PASSWORD__REGEX_MINMAX:				'', 
	PASSWORD__REGEX_ALLOWEDCHARS:		'', 
	PASSWORD__REGEX_ALLOWEDSYMBOLS:		'', 


	MAX_LENGTH_SESSION_NAME:			50, 
	MAX_PLAYERS:						16, 
	MAX_LENGTH_PLAYER_NAME:				50, 
	MAX_COLUMNS:						20, 
	MAX_FINALSCORES_LIMIT:				10, 
})
export default Context__ENV_Variables





export const Provider_And_Context__ENV_Variables = ({ children }: { children: ReactNode }) => {

	const { t } = useTranslation()

	const [ NAME__MIN_CHARACTER, 			setNAME__MIN_CHARACTER				] = useState<number>(4)
	const [ NAME__MAX_CHARACTER, 			setNAME__MAX_CHARACTER				] = useState<number>(64)

	const [ NAME__REGEX,					setNAME__REGEX						] = useState<string>('')
	const [ NAME__REGEX_MINMAX,				setNAME__REGEX_MINMAX				] = useState<string>('')
	const [ NAME__REGEX_LETTERFIRST,		setNAME__REGEX_LETTERFIRST			] = useState<string>('')
	const [ NAME__REGEX_ALLOWEDCHARS,		setNAME__REGEX_ALLOWEDCHARS			] = useState<string>('')


	const [ PASSWORD__MIN_CHARACTER, 		setPASSWORD__MIN_CHARACTER			] = useState<number>(8)
	const [ PASSWORD__MAX_CHARACTER, 		setPASSWORD__MAX_CHARACTER			] = useState<number>(8)

	const [ PASSWORD__REGEX,				setPASSWORD__REGEX					] = useState<string>('')
	const [ PASSWORD__REGEX_MINMAX,			setPASSWORD__REGEX_MINMAX			] = useState<string>('')
	const [ PASSWORD__REGEX_ALLOWEDCHARS,	setPASSWORD__REGEX_ALLOWEDCHARS		] = useState<string>('')
	const [ PASSWORD__REGEX_ALLOWEDSYMBOLS,	setPASSWORD__REGEX_ALLOWEDSYMBOLS	] = useState<string>('')


	const [ MAX_LENGTH_SESSION_NAME, 		setMAX_LENGTH_SESSION_NAME 			] = useState<number>(50)
	const [ MAX_PLAYERS, 					setMAX_PLAYERS 						] = useState<number>(16)
	const [ MAX_LENGTH_PLAYER_NAME, 		setMAX_LENGTH_PLAYER_NAME 			] = useState<number>(50)
	const [ MAX_COLUMNS, 					setMAX_COLUMNS 						] = useState<number>(20)
	const [ MAX_FINALSCORES_LIMIT, 			setMAX_FINALSCORES_LIMIT 			] = useState<number>(10)





	useEffect(() => {

		get__env().then(variables => {

			setNAME__MIN_CHARACTER(				variables.NAME__MIN_CHARACTER			)
			setNAME__MAX_CHARACTER(				variables.NAME__MAX_CHARACTER			)

			setNAME__REGEX(						variables.NAME__REGEX					)
			setNAME__REGEX_MINMAX(				variables.NAME__REGEX_MINMAX			)
			setNAME__REGEX_LETTERFIRST(			variables.NAME__REGEX_LETTERFIRST		)
			setNAME__REGEX_ALLOWEDCHARS(		variables.NAME__REGEX_ALLOWEDCHARS		)

			setPASSWORD__MIN_CHARACTER(			variables.PASSWORD__MIN_CHARACTER		)
			setPASSWORD__MAX_CHARACTER(			variables.PASSWORD__MAX_CHARACTER		)

			setPASSWORD__REGEX(					variables.PASSWORD__REGEX				)
			setPASSWORD__REGEX_MINMAX(			variables.PASSWORD__REGEX_MINMAX		)
			setPASSWORD__REGEX_ALLOWEDCHARS(	variables.PASSWORD__REGEX_ALLOWEDCHARS	)
			setPASSWORD__REGEX_ALLOWEDSYMBOLS(	variables.PASSWORD__REGEX_ALLOWEDSYMBOLS)


			setMAX_LENGTH_SESSION_NAME(			variables.MAX_LENGTH_SESSION_NAME		)
			setMAX_PLAYERS(						variables.MAX_PLAYERS					)
			setMAX_LENGTH_PLAYER_NAME(			variables.MAX_LENGTH_PLAYER_NAME		)
			setMAX_COLUMNS(						variables.MAX_COLUMNS					)
			setMAX_FINALSCORES_LIMIT(			variables.MAX_FINALSCORES_LIMIT			)

		}).catch(() => {
			toast.error(t('error.variables_not_initialized'))
		})

	}, [])





	return <>
		<Context__ENV_Variables.Provider 
			value={{
				NAME__MIN_CHARACTER, 
				NAME__MAX_CHARACTER, 

				NAME__REGEX, 
				NAME__REGEX_MINMAX, 
				NAME__REGEX_LETTERFIRST, 
				NAME__REGEX_ALLOWEDCHARS, 


				PASSWORD__MIN_CHARACTER, 
				PASSWORD__MAX_CHARACTER, 

				PASSWORD__REGEX, 
				PASSWORD__REGEX_MINMAX, 
				PASSWORD__REGEX_ALLOWEDCHARS, 
				PASSWORD__REGEX_ALLOWEDSYMBOLS, 


				MAX_LENGTH_SESSION_NAME, 
				MAX_PLAYERS, 
				MAX_LENGTH_PLAYER_NAME, 
				MAX_COLUMNS, 
				MAX_FINALSCORES_LIMIT
			}}
		>
			{children}
		</Context__ENV_Variables.Provider>
	</>
}
