

import { axiosDefault } from '../api/axios'
import { createContext, useEffect, useState } from 'react'

export const ServerVersionContext = createContext({})





export const ServerVersion = ({ children }) => {

	const [ server_version, setServer_version ] = useState('')

	useEffect(() => { axiosDefault.get('/version').then(({ data }) => setServer_version(data)) }, [])

	return <>
		<ServerVersionContext.Provider value={{ server_version }}>

			{children}

		</ServerVersionContext.Provider>
	</>

}

export default ServerVersion
