

import { updateURL } from '../logic/utils'
import useErrorHandling from './useErrorHandling'
import { calculateUpperColumn, calculateBottomColumn } from '../logic/Calculating'
import useAxiosPrivate from './useAxiosPrivate'





export default function useOnBlurEvent() {

	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()





	const onBlurEvent = async ({

	}) => {

		

	}





	return onBlurEvent

}
