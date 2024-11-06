

import './scss/Loader_Box.scss'




export default function Loader_Box({
	className, 
	dark
}) {

	return (
		<div className={`loader_box${className ? ` ${className}` : ''}${dark ? ' dark' : ''}`}/>
	)

}