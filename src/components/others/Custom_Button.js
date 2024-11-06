

import Loader from '../Loader/Loader'





export default function Custom_Button({ className, loading, text, onClick }) {

    return (
        <button
            className={`button${className ? ' ' + className : ''}`}
            onClick={onClick}
            disabled={loading}
        >
            {loading ? <Loader loaderVisible={true} isNotGreen={true}/> : text}
        </button>
    )

}
