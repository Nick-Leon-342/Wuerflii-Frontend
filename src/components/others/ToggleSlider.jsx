

import './scss/ToggleSlider.scss'





/**
 * 
 * ToggleSlider component renders a toggle switch (checkbox) that can be checked or unchecked.
 * It triggers a callback function (`onChange`) when the state of the switch changes.
 *
 * @component
 * @example
 * // Example usage of ToggleSlider component
 * <ToggleSlider
 *   checked={isChecked}
 *   onChange={handleToggleChange}
 * />
 *
 * @param {Object} props - The component props
 * @param {boolean} props.checked - Determines if the toggle is checked or not
 * @param {Function} props.onChange - Callback function to handle the toggle state change
 *
 * @returns {JSX.Element} The rendered ToggleSlider component
 * 
 */

export default function ToggleSlider({ checked, onChange }) {

	return <>
		<label className='toggleslider'>

			<input type='checkbox' checked={checked} onChange={onChange}/>

			<span/>

		</label>
	</>

}
