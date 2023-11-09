

export default function InfoName() {

	const color = 'rgb(255, 0, 0)'

	return (
		<div style={{
			marginTop: '10px',
			border: `2px solid ${color}`,
			borderRadius: '10px',
			color: 'rgb(255, 0, 0)',
			fill: 'rgb(255, 0, 0)',
			padding: '20px',
		}}>
			<span style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
				<svg height="20" viewBox="0 -960 960 960"><path fill='rgb(255, 0, 0)' d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
				<span style={{ height: '100%', fontSize: '19px', margin: 'auto', marginLeft: '5px', color: `${color}` }}>Info</span>
			</span>
			<p style={{ textAlign: 'left', marginBottom: '0' }}>
				Der Benutzername muss <span style={{ color: color }}>4 bis 50 Zeichen</span><br/>
				lang sein und mit <span style={{ color: color }}>einem Buchstaben anfangen.</span><br/>
				Erlaubt sind:<br/>
				<span style={{ color: color }}>Buchstaben, Zahlen, Binde- und Unterstriche</span>
			</p>
		</div>
	)

}
