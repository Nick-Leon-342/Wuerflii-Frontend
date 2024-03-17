

import { Link } from 'react-router-dom'
import './css/CustomLink.css'





export default function CustomLink({ linkTo, text }) {

	return (
		<div className='customlink_container'>
			<Link to={linkTo}>{text}</Link>
		</div>
	)

}
