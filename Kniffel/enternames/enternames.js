

function addEnterNamesAndSelectColorElement(i) {

    const enterNamesList = document.getElementById("enterNamesList");
    const dt = document.createElement("dt");
    const nameInput = document.createElement("input");
    const colorInput = document.createElement("input");

    dt.classList.add("enterNamesElement");
    nameInput.classList.add("input");
    nameInput.value = `Player_${i+1}`
    colorInput.classList.add("colorbox");
    colorInput.type = "color";
    colorInput.value = i % 2 == 0 ? "#ffffff" : "#ADD8E6";

    dt.appendChild(nameInput);
    dt.appendChild(colorInput);
    enterNamesList.appendChild(dt);

}

function play() {
    
    const enterNamesElement = document.getElementsByClassName("enterNamesElement");
    for(const element of enterNamesElement) {
        players.push(createPlayer(element.querySelector(".input").value, element.querySelector(".colorbox").value));
    }

    initGame();

}


function backToEnterPAC() {

    document.getElementById("enterNamesInterface").style.display = "none";
    document.getElementById("enterPlayerAndColumnCountInterface").style.display = "block";

}
