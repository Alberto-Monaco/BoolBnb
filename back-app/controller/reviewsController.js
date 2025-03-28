const connection = require('../db/connection.js')


// Metodo per mostrare le recensioni relative ad un appartamento
function reviewsShow(req, res) {


	const slug = req.params.slug

	const sqlShow = `SELECT * FROM reviews WHERE id_property=(SELECT id FROM properties WHERE slug = ?) ORDER BY date_review DESC`


	connection.query(sqlShow, [slug], (err, result) => {
		if (err) {
			return res.status(500).json({
				error: 'Something went wrong... '
			})
		}
		res.status(200).json({
			reviews: result,
			count: result.length
		})
	})
}

// Metodo per aggiungere una recensione
function reviewCreate(req, res) {

	const sql = `INSERT INTO reviews (id_property, name, text_review, nights, date_review) VALUES (?, ?, ?, ?, ?)`
	const sqlShow = `SELECT * FROM reviews WHERE id_property=? ORDER BY date_review DESC`
	const sqlIdProperty = 'SELECT id FROM properties WHERE slug = ?'

	const slug = req.params.slug
	const date = new Date()

	const { text_review, nights, name } = req.body
	console.log(req.body);
	console.log({ slug, sql });


	if (!name || !text_review || !nights)
		return res.status(400).json({
			error: 'Some fields are missing!'
		})

	if (name.length < 3 || name.length > 250) {
		return res.status(400).json({
			error: 'Name must be between 3 and 250 characters!'
		})
	}
	if (!Number(nights) || nights <= 0) {
		return res.status(400).json({
			error: 'Nights must be a positive number!'
		})
	}
	if (!Number(nights) || nights > 255) {
		return res.status(400).json({
			error: 'Nights must be lower than 255!'
		})
	}
	if (text_review.length < 10) {
		return res.status(400).json({
			error: 'Your review must be longer...'
		})
	}
	if (text_review.length > 1000) {
		return res.status(400).json({
			error: 'Your review must be shorter...'
		})
	}
	connection.query(sqlIdProperty, [slug], (err, result) => {
		if (err) {
			return res.status(500).json({
				error: 'Something went wrong while fetching property ID.',
				details: err,
			});
		}

		if (result.length === 0) {
			return res.status(404).json({
				error: 'Property not found!',
				err
			});
		}

		const idProperty = result[0].id;



		connection.query(sql, [idProperty, name, text_review, nights, date], (err, result) => {
			if (err) {
				res.status(500).json({
					err: 'Something went wrong...2',
					err
				})
			} else {
				connection.query(sqlShow, [idProperty], (err, result) => {
					if (err) {
						return res.status(500).json({
							error: 'Something went wrong...3 '
						})
					}
					res.status(200).json({
						reviews: result,
						success: true,
						message: 'Review added successfully'
					})
				})
			}
		})
	})
}

module.exports = {
	reviewsShow,
	reviewCreate
}
