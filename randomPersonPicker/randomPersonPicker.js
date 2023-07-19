

const add = document.getElementById("add")

const list = [];

add.addEventListener("click", addPerson)

function addPerson() {
    const input = document.getElementById("input");
    list[list.length] = input.value;
    input.value = "";
    console.log(list);
    document.getElementById("list").innerHTML += "<li>" + input.value + "</li>"
    input.focus();
}
