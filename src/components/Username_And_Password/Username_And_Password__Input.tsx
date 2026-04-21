

import { useTranslation } from 'react-i18next'
import { KeyRound, User } from 'lucide-react'
import { forwardRef } from 'react'

import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'





interface Props___Username_And_Password__Input {
	placeholder:	string
	setValue:		React.Dispatch<React.SetStateAction<string>>
	value:			string
	type:			'text' | 'password'

	onFocus?:		() => void
	onBlur?:		() => void

	is_invalid?:	boolean
	is_valid?:		boolean

	[key: string]:	any
}

const Username_And_Password__Input = forwardRef<HTMLInputElement, Props___Username_And_Password__Input>(({
	placeholder, 
	setValue, 
	value, 
	type, 

	onFocus, 
	onBlur, 

	is_invalid, 
	is_valid, 

	...props
}, ref) => {

	const { t } = useTranslation()

	return <>
		<InputGroup className='gap-1 border-0 h-12'>
			
			<InputGroupAddon 
				align='inline-start' 
				className={`[&_svg]:w-6! [&_svg]:h-6!${is_invalid ? ' [&_svg]:stroke-destructive' : ''}${is_valid ? ' [&_svg]:stroke-primary' : ''}`}
			>
				{type === 'password' 
					? <KeyRound/>
					: <User/>
				}
			</InputGroupAddon>

			<InputGroupInput
				className='border-b border-muted-foreground text-xl! h-full'
				onChange={({ target }) => setValue(target.value)}
				placeholder={t(placeholder)}
				onFocus={onFocus}
				onBlur={onBlur}
				value={value}
				type={type}
				{...props}
				ref={ref}
				required
			/>

		</InputGroup>
	</>
})

export default Username_And_Password__Input
