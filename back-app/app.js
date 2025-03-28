const express = require('express')
const app = express()
const routers = require('./routers/router')
const cors = require('cors')
const port = process.env.PORT
const host = process.env.HOST
const path = require('path')

// Import middleware
const notFound = require('./middleware/notFound')
const loggerMiddleware = require('./middleware/loggerMiddleware')

// Usa il middleware di CORS
app.use(cors())

/* Middleware per il logging
Posizionato prima delle rotte per loggare ogni richiesta
*/
app.use('/', loggerMiddleware)

// Parsing dei JSON
app.use(express.json())

app.use('/api', routers)

// Servi i file statici dalla cartella public
app.use(express.static('public'))

// Configura il middleware per servire i file statici
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// Gestione delle rotte non trovate (deve venire dopo le tue route)
app.use(notFound)

// Middleware di gestione degli errori
app.use((err, req, res, next) => {
	console.log(err.stack)
	res.status(500).send({
		message: 'Something went wrong!',
		error: err.message
	})
})

// Avvio del server
app.listen(port, () => {
	console.log(`Server is running on http://${host}:${port}`)
})
