import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/view.router.js'
import { Server } from 'socket.io' //Recuerda que este {Server} es propio de websockets

const app = express()
const httpServer = app.listen(8080, () => console.log('Listening on PORT 8080'))

const io = new Server(httpServer) //io será un servidor para trabajar con sockets, ¿Porque lo llamamos io? POR CONVENCION lo llaman asi

//Plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public')) //recuerda que es importante para tener archivos js y css en plantillas
app.use('/', viewsRouter)

let messages = []

io.on('connection', (socket) => {
    console.log('User Connected')

    socket.on('message', (data) => {
        messages.push(data) //Guardamos el objeto en la "base"
        console.log('este es el log del array', messages)
        io.emit('messageLogs', messages) //Reenviamos instantaneamente los logs actualizados
    })

    socket.on('updateMessages', () => {
        io.emit('messageLogs', messages)
        // Emitir mensaje a todos los usuarios excepto al que se está conectando
        socket.broadcast.emit('newUserConnected')
    })




})