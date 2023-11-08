

export default function Loader({ loaderVisible }) {

	return (
		<div className={`loader ${loaderVisible ? '' : 'notVisible'}`}>
			<span/>
			<span/>
			<span/>
		</div>
	)

}
