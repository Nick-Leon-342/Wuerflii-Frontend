
window.addEventListener("resize", resizeEvent);

function resizeEvent() {
    const kA = document.getElementById("kniffelApplication");
    const body = document.body;

    if(kA.offsetWidth >= this.window.innerWidth) {
        body.style.justifyContent = "left";
        kA.style.borderRadius = "0px";
        kA.style.marginTop = "10px";
        kA.style.marginBottom = "10px";
    } else {
        body.style.justifyContent = "center";
        kA.style.borderRadius = "20px";
        kA.style.marginTop = "0px";
        kA.style.marginBottom = "0px";
    }

    if(kA.offsetHeight >= this.window.innerHeight) {
        body.style.height = "100%";
    } else {
        body.style.height = "100vh";
    }
}
