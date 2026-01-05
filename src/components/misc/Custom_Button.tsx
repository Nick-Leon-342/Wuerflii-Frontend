

import './scss/Custom_Button.scss'

import Loader from '../Loader/Loader'
import type { MouseEventHandler } from 'react';





interface Props__Custom_Button {
	text: 		string
	onClick?:	MouseEventHandler<HTMLButtonElement>
	loading?:	boolean
	ok?:		boolean
	className?:	string
	type?:		'button' | 'submit'
}

export default function Custom_Button({ 
	className, 
	onClick, 
	loading, 
	text, 
	ok
}: Props__Custom_Button) {

    return <>
        <button
			onClick={onClick}
			disabled={loading || ok}
			className={`button button_scale_0${className ? ` ${className}` : ''}`}
        >
            
			{loading && <Loader loading={true} className='custom_button_loader'/>}
			{ok && <svg className='custom_button_ok' viewBox='0 -960 960 960'><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>}
			{!loading && !ok && text}

        </button>
	</>

}
