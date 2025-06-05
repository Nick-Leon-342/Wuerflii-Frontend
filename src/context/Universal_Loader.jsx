

import './scss/Universal_Loader.scss'

import { createContext, useState } from 'react'
import LoaderDots from '../components/Loader/Loader_Dots'

export const UniversalLoaderContext = createContext({})





export const UniversalLoader = ({ children }) => {

	const [ loading__universal_loader, setLoading__universal_loader ] = useState(false)





	return <>
		<UniversalLoaderContext.Provider value={{ loading__universal_loader, setLoading__universal_loader }}>
			{/* {loading__universal_loader && <LoaderDots className='universal_loader'/>} */}
			{true && <LoaderDots className='universal_loader'/>}
			{children}
		</UniversalLoaderContext.Provider>
	</>

}

export default UniversalLoader
