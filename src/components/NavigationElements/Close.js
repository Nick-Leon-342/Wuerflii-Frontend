

import './css/Close.css'





export default function Close({ onClick }) {
	
	return (
		<div className='close-container'>
			<svg className='button-responsive' onClick={onClick} height='28' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
		</div>
	)

}
