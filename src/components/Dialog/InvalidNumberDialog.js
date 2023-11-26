

export default function InvalidNumberDialog({ id }) {

	return (

		<dialog id={id} className='modal'>
		
			<p id='message-invalidNumber' style={{ fontSize: '25px', marginTop: '20px' }}></p>
		
			<button className='button' style={{ width: '100%', height: '40px' }} onClick={() => document.getElementById(id).close()}>Ok</button>
		
		</dialog>

	)

}
