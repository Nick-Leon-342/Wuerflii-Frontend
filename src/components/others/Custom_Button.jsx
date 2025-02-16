

import './scss/Custom_Button.scss'

import Loader from '../Loader/Loader'





/**
 * 
 * A customizable button component that displays either a loading spinner or text based on the loading state.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - An optional additional class name to style the button.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {boolean} props.loading - A boolean indicating whether the button is in a loading state.
 * @param {string} props.text - The text to display on the button when it is not loading.
 * @param {boolean} props.ok - A boolean indicating whether a process connected to that button is finished. Displays a check-svg.
 *
 * @returns {JSX.Element} The rendered button element.
 * 
 */

export default function Custom_Button({ 
	className, 
	onClick, 
	loading, 
	text, 
	ok
}) {

    return <>
        <button
			onClick={onClick}
			disabled={loading || ok}
			className={`button${className ? ` ${className}` : ''}`}
        >
            
			{loading && <Loader loading={true} className='custom_button_loader'/>}
			{ok && <svg className='custom_button_ok' viewBox='0 -960 960 960'><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>}
			{!loading && !ok && text}

        </button>
	</>

}
