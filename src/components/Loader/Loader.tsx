

import './scss/Loader.scss'





interface Props__Loader {
	className?:	string
	loading:	boolean
}

export default function Loader({ 
	className, 
	loading, 
}: Props__Loader) {

	return <>
		{loading && 
			<div className={`loader${className ? ` ${className}` : ''}`}>
				<span/>
				<span/>
				<span/>
			</div>
		}
	</>

}
