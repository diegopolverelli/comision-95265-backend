const divMensajes=document.getElementById("mensajes")
const inputEmail=document.getElementById("email")
const inputPass=document.getElementById("password")
const btnSubmit=document.getElementById("submit")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()

    let email=inputEmail.value
    let password=inputPass.value

    if(!email || !password){
        divMensajes.textContent=`email | password son requeridos`
        setTimeout(() => {
            divMensajes.textContent=""
        }, 3000);
        return 
    }

    let response=await fetch("/api/sessions/login", {
        method: "post",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({email, password})
    })
    if(response.status>=400){
        let {error}=await response.json()
        divMensajes.textContent=error
        setTimeout(() => {
            divMensajes.textContent=""
        }, 3000);
        return 
    }

    let {message}=await response.json()
    divMensajes.textContent=message


})