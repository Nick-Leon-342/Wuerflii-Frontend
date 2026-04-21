

import { Spinner } from '../ui/spinner'
import { Button } from '../ui/button'
import { Check } from 'lucide-react'





interface Props__Custom_Button {
	text?: 				string
	onClick?:			() => void

	svg_after_text?:	boolean
	SVG?:				React.ReactNode

	disabled?:			boolean
	loading?:			boolean
	ok?:				boolean
	
	className?:			string
	variant?:			'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export default function Custom_Button({ 
	svg_after_text, 
	className, 
	disabled, 
	variant, 
	onClick, 
	loading, 
	text, 
	SVG, 
	ok
}: Props__Custom_Button) {

    return <>
        <Button
			onClick={onClick}
			variant={variant}
			disabled={loading || ok || disabled}
			className={className ? className : ''}
        >
            
			{loading && <Spinner/>}
			{!loading && !ok && !svg_after_text && SVG}
			{!loading && !ok && text}
			{!loading && !ok && svg_after_text && SVG}
			{ok && <Check/>}

        </Button>
	</>

}
