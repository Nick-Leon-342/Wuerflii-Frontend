

const add = document.getElementById("add")

const list = [];

add.addEventListener("click", addPerson)

function addPerson() {
    const input = document.getElementById("input");

    if(input.value != "") {

        list[list.length] = input.value;
        document.getElementById("list").innerHTML += "<dt class='listElement'><div class='nameOfPerson'>" + input.value + "</div><button class='xBtn'>X</button></dt>";
        input.value = "";
        console.log(list);

    }
    
    input.focus();
}

function inputKeyPressed(event) {
    if (event.keyCode == 13) {
        add.click();
    }
}
