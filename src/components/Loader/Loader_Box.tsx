

import './scss/Loader_Box.scss'





interface Props__Loader_Box {
	className:	string
	dark:		boolean
}

export default function Loader_Box({
	className, 
	dark
}: Props__Loader_Box) {

	return <>
		<div className={`loader_box${className ? ` ${className}` : ''}${dark ? ' loader_box-dark' : ''}`}/>
	</>

}
