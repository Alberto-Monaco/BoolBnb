const connection = require('../db/connection')

function sendMessage(req, res) {
	// Validazione dei dati in ingresso
	const { id_property, email, text_message } = req.body
	if (!id_property || !email || !text_message) {
		return res.status(400).json({
			success: false,
			error: 'All fields are required'
		})
	}
	// Validazione formato email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email || email.length > 255)) {
		return res.status(400).json({
			success: false,
			error: 'Invalid email format'
		})
	}
	// Controllo lunghezza del messaggio
	if (text_message.length < 10 || text_message.length > 1000) {
		return res.status(400).json({
			success: false,
			error: 'Message must be between 10 and 1000 characters'
		})
	}
	// Query SQL per inserire il messaggio
	const sql = `INSERT INTO messages (id_property, email, text_message) VALUES (?, ?, ?)`

	// Eseguiamo la query
	connection.query(sql, [id_property, email, text_message], (err, result) => {
		if (err) {
			return res.status(500).json({
				success: false,
				error: 'Error sending message',
				details: 'something went wrong...'
			})
		}
		return res.status(201).json({
			success: true,
			message: 'message sent successfully',
			affectedRows: result.affectedRows
		})
	})
}

module.exports = {
	sendMessage
}
