

import './css/Loader.css'





export default function Loader({ loaderVisible, marginBottom, marginTop }) {

	return (
		<div className={`loader ${loaderVisible ? '' : 'notvisible'}`} style={{ marginBottom: marginBottom, marginTop: marginTop }}>
			<span/>
			<span/>
			<span/>
		</div>
	)

}
