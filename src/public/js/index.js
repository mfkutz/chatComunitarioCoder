const socket = io()

let user //Este user será con el que el cliente se identificará para saber quien escribio el mensaje
let chatBox = document.getElementById('chatBox') //Obtenemos la referencia del cuadro donde se escribirá

Swal.fire({
    title: "Identifícate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre de usuario para continuar'
        //Esta validación ocurre si el usuario decide dar en "continuar" sin haber colocado un nombre de usuario
    },
    allowOutsideClick: false //Impide que el usuario salga de la alerta al dar click fuera de la alerta

}).then(result => {
    //Una vez que el usuario se identifica, lo asignamos a la variable user
    user = result.value

    socket.emit('updateMessages')
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) { //Corroboramos que el mensaje no esté vacío o solo contenga espacios
            socket.emit('message', { user: user, message: chatBox.value }) //Emitimos nuestro primer evento
            chatBox.value = ""
        } else {
            console.log('no pasó validacion')
        }
    }
})


/* SOCKET LISTENERS */
socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ''

    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} </br>`
    })

    log.innerHTML = messages
})

//Alert new user conected
socket.on('newUserConnected', () => {
    Swal.fire({
        text: "Nuevo usuario conectado",
        toast: true,
        position: "top-right"
    })
})