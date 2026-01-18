

import { createContext, useEffect, useState, type ReactNode } from 'react'

import { axiosDefault } from '../api/axios'

import type { Type__Context__Server_Version } from '../types/Type__Context/Type__Context__Server_Version'





const Context__Server_Version = createContext<Type__Context__Server_Version>({ server_version: 0 })
export default Context__Server_Version

interface Props__Provider__Server_Version { children: ReactNode }





export const Provider_And_Context__Server_Version = ({ children }: Props__Provider__Server_Version) => {

	const [ server_version, setServer_version ] = useState(0)

	useEffect(() => { axiosDefault.get('/version').then(({ data }) => setServer_version(data)) }, [])

	return <>
		<Context__Server_Version.Provider value={{ server_version }}>

			{children}

		</Context__Server_Version.Provider>
	</>

}
