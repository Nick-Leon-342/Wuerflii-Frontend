

import './scss/Universal_Loader.scss'

import { createContext, useState, type ReactNode } from 'react'

import type { Type__Context__Universal_Loader } from '../types/Type__Context/Type__Context__Universal_Loader'

import LoaderDots from '../components/Loader/Loader_Dots'





const Context__Universal_Loader = createContext<Type__Context__Universal_Loader>({
	loading__universal_loader:		false, 
	setLoading__universal_loader:	() => {}, 
})
export default Context__Universal_Loader

interface Props__Provider__Universal_Loader { children: ReactNode }





export const Provider_And_Context__Universal_Loader = ({ children }: Props__Provider__Universal_Loader) => {

	const [ loading__universal_loader, setLoading__universal_loader ] = useState(false)

	return <>
		<Context__Universal_Loader.Provider value={{ loading__universal_loader, setLoading__universal_loader }}>
			{loading__universal_loader && <LoaderDots className='universal_loader'/>}
			{children}
		</Context__Universal_Loader.Provider>
	</>

}
