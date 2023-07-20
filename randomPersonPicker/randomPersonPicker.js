

const add = document.getElementById("add")

const list = [];

add.addEventListener("click", addPerson)

function addPerson() {
    const input = document.getElementById("input");

    if(input.value != "") {

        list[list.length] = input.value;
        document.getElementById("list").innerHTML += "<dt class='listElement'><div class='nameOfPerson'>" + input.value + "</div><button class='xBtn'>X</button></dt>";
        input.value = "";

    }
    
    input.focus();
}

function inputKeyPressed(event) {
    if (event.keyCode == 13) {
        add.click();
    }
}

document.getElementById('list').addEventListener('click', function(event) {
    if (event.target.classList.contains('xBtn')) {
        const dtElement = event.target.closest('dt');
        if (dtElement) {
            const nameOfPerson = dtElement.querySelector('.nameOfPerson').innerHTML;
            dtElement.remove();

            const index = list.indexOf(nameOfPerson);
            if (index !== -1) {
                list.splice(index, 1);
            }

        }
    }
  });


function pickARandomPerson() {
    alert(list[Math.floor(Math.random() * list.length)]);
}

