

import './scss/Loader.scss'





export default function Loader({ loaderVisible, isNotGreen, marginBottom, marginTop }) {

	return (<>
		{loaderVisible && <div className={`loader${isNotGreen ? ' isnotgreen' : ''}`} style={{ marginBottom: marginBottom, marginTop: marginTop }}>
			<span/>
			<span/>
			<span/>
		</div>}
	</>)

}
