let divDatos=document.getElementById("datos")
let btnDatos=document.getElementById("btnDatos")
let btnLogout=document.getElementById("btnLogout")

btnLogout.addEventListener("click", ()=>{
    localStorage.removeItem("token")
    divDatos.textContent=`Logout exitoso!`
})

btnDatos.addEventListener("click", async(e)=>{
    e.preventDefault()

    let response=await fetch("/usuario", {
        headers: {
            "Authorization": `BEARER ${localStorage.getItem("token")}`
        }
    })
    if(response.status>=400){
        let {error}=await response.json()
        divDatos.textContent=`Error al recuperar información: ${error}`
        return
    }

    let data=await response.json()
    divDatos.textContent=JSON.stringify(data)
})