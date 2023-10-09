

import '../App.css'
import './css/EnterNames.css'

import React from 'react'


function EnterNames() {


//__________________________________________________Check SessionStorage before displaying__________________________________________________

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('application').style.display = 'block'

    if(isTest()) {

        initTestData()

    }else {

        const playercount = sessionStorage.getItem(sessionStorage_players)

        if(playercount && playercount != 0) {

            gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes))

            document.getElementById('enterNamesList').innerHTML = ''
            for(let i = 0; playercount > i; i++){addEnterNamesAndSelectColorElement(i)}

        } else {
            window.location.replace('/creategame')
        }

    }



}, false);





function initTestData() {

    for(let i = 0; 5 > i; i++) {
        addEnterNamesAndSelectColorElement(i)
    }

}





function addEnterNamesAndSelectColorElement(i) {

    const enterNamesList = document.getElementById('enterNamesList')
    const dt = document.createElement('dt')
    const nameInput = document.createElement('input')
    const colorInput = document.createElement('input')

    dt.classList.add('enterNamesElement')
    nameInput.classList.add('input')
    nameInput.value = `Player_${i+1}`
    colorInput.classList.add('colorbox')
    colorInput.type = 'color';
    colorInput.value = i % 2 == 0 ? '#ffffff' : '#ADD8E6'

    dt.appendChild(nameInput)
    dt.appendChild(colorInput)
    enterNamesList.appendChild(dt)

}





function play() {
    
    const enterNamesElement = document.getElementsByClassName('enterNamesElement')
    players.length = 0
    //for(const element of enterNamesElement) {
    for(let i = 0; enterNamesElement.length > i; i++) {
        players.push(createPlayer(enterNamesElement[i].querySelector('.input').value, `Player_${i}`, enterNamesElement[i].querySelector('.colorbox').value))
    }

    sessionStorage.setItem(sessionStorage_players, JSON.stringify(players))

    window.location.replace('/game')

}





function backToCreateGame() {

    clearSessionStorage()
    window.location.replace('/creategame')

}


	return (
		<div id='application'>
			<a href='https://games.mmtn-schneider.com'><button class='button'>Home</button></a>

			<div class='interface'>
				<dl id='enterNamesList'></dl>
				<div class='button-container'>
					<button class='button' onclick='backToCreateGame()'>Zurück</button>
					<button class='button' onclick='play()'>Los!</button>
				</div>
			</div>

		</div>
	)
}

export default EnterNames
