

export default function Loader({ loaderVisible, marginBottom, marginTop }) {

	return (
		<div className={`loader ${loaderVisible ? '' : 'notVisible'}`} style={{ marginBottom: marginBottom, marginTop: marginTop }}>
			<span/>
			<span/>
			<span/>
		</div>
	)

}
