

import './css/CustomLink.scss'





export default function CustomLink({ onClick, text, textBefore }) {

	return (
		<div className={`customlink ${textBefore && 'right'}`}>
			
			<label>{textBefore}</label>

			<button
				onClick={onClick}
			>{text}</button>

		</div>
	)

}
