let divMessage=document.getElementById("message")
let inputEmail=document.getElementById("email")
let inputPassword=document.getElementById("password")
let btnSubmit=document.getElementById("btnSubmit")

btnSubmit.addEventListener("click", async(e)=>{

    e.preventDefault()

    let email=inputEmail.value
    let password=inputPassword.value 

    if(!email || !password){
        divMessage.textContent=`Complete los datos...!!!`
        setTimeout(() => {
            divMessage.textContent=""
        }, 3000);

        return 
    }

    let response=await fetch("/login", {
        method: "post", 
        headers: {
            "Content-Type":"application/json"
        }, 
        body: JSON.stringify({email, password})
    })
    if(response.status>=400){
        divMessage.textContent=`Error al autenticar`
        setTimeout(() => {
            divMessage.textContent=""
        }, 3000);        
        return 
    }

    let {usuarioLogueado, token}=await response.json()
    divMessage.textContent=`Login exitoso para ${usuarioLogueado.nombre}`

    localStorage.setItem("token", token)
})
