const connection = require('../db/connection')
const jwt = require('jsonwebtoken')
const secretKey = process.env.CRYPTOKEY
const multer = require('multer')
const path = require('path')
const fs = require('fs')




//funtion to decrypt token
function decrypt(id) {
	try {
		const decoded = jwt.verify(id, secretKey)
		return decoded.id
	} catch (err) {
		console.error("Errore nella decodifica dell'id", err.message)
		return null
	}
}

// Configurazione di multer per il salvataggio delle immagini
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads/')
	},
	filename: function (req, file, cb) {
		// Genera un nome file unico usando timestamp
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + path.extname(file.originalname))
	}
})

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		// Accetta solo immagini
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return cb(new Error('Solo file immagine sono permessi!'), false)
		}
		cb(null, true)
	}
}).single('image')

//metodo index che restituisce tutti gli oggetti presenti nel db in ordine decrescente di like
function index(req, res) {
	const sql = 'SELECT * FROM properties ORDER BY `like` DESC'

	connection.query(sql, (err, result) => {
		if (err) {
			return res.status(500).json({
				error: 'something went wrong...'
			})
		}
		res.status(200).json({
			data: result,
			count: result.length
		})
	})
}

//metodo show che restituisce l'appartamento selezionato
function show(req, res) {
	const slug = req.params.slug
	if (!slug) {
		return res.status(400).json({ error: 'Slug is required' })
	}
	const sql = `SELECT properties.*, 
        			JSON_ARRAYAGG(services.name) AS services
					FROM properties
					LEFT JOIN properties_services ON properties.id = properties_services.id_property
					LEFT JOIN services ON properties_services.id_service = services.id
					WHERE properties.slug = ?
					GROUP BY properties.id`

	connection.query(sql, [slug], (err, result) => {
		if (err)
			return res.status(500).json({
				error: 'error server side'
			})
		if (result.length === 0)
			return res.status(404).json({
				error: 'Property not found'
			})
		const property = result[0]
		res.status(200).json({
			status: 'success',
			success: true,
			property
		})
	})
}

// metodo create per aggiungere nuovo appartamento
function create(req, res) {
	upload(req, res, function (err) {
		if (err) {
			return res.status(400).json({
				error: err.message
			})
		}

		const tokenOwner = req.params.owner
		const owner = decrypt(tokenOwner)


		// Modifica qui: salva solo il nome del file invece dell'URL completo
		const imagePath = req.file ? req.file.filename : null
		const sqlCheckSlug = `SELECT slug FROM properties WHERE slug LIKE ?`
		const sql = `INSERT INTO properties (id_user, name, rooms, beds, bathrooms, mq, address, email_owners, \`like\`, image, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0,? ,?)`

		const { name, rooms, beds, bathrooms, mq, address, email_owners } = req.body
		const slug = name.toLowerCase().replace(/\s+/g, '_')

		if (!name || !rooms || !beds || !bathrooms || !mq || !address) {
			return res.status(400).json({
				error: 'Dati mancanti'
			})
		}

		function generateUniqueSlug(baseSlug, existingSlugs) {
			const today = new Date()
			const dateSuffix = today.toISOString().slice(0, 10).replace(/-/g, '')
			let newSlug = `${baseSlug}_${dateSuffix}`

			// Controlla se esiste uno slug uguale o simile
			let counter = 1
			while (existingSlugs.includes(newSlug)) {
				newSlug = `${baseSlug}_${counter}`
				counter++
			}

			return newSlug
		}
		connection.query(sqlCheckSlug, [`${slug}%`], (err, results) => {
			if (err) {
				return res.status(500).json({
					error: 'Error checking slug availability.',
					details: err,
				})
			}

			// Ottieni tutti gli slug simili per generare uno slug unico
			const existingSlugs = results.map((property) => property.slug)
			const uniqueSlug = generateUniqueSlug(slug, existingSlugs)

			connection.query(
				sql,
				[owner, name, rooms, beds, bathrooms, mq, address, email_owners, imagePath, uniqueSlug],
				(err, result) => {
					if (err) {
						return res.status(500).json({
							error: 'Errore durante il salvataggio',
							err: err
						})
					}
					// Modifica qui: restituisci l'URL completo nella risposta
					const fullImagePath = imagePath ? `http://localhost:3000/uploads/${imagePath}` : null
					return res.status(201).json({
						success: true,
						imagePath: fullImagePath
					})
				}
			)
		})
	})

}

function likeUpdate(req, res) {
	const slug = req.params.slug
	if (!slug) {
		return res.status(400).json({ error: 'Slug is required' })
	}
	const sql = `UPDATE properties SET \`like\` = \`like\` + 1 WHERE slug = ?`
	connection.query(sql, [slug], (err, result) => {
		if (err)
			return res.status(500).json({
				error: 'Something went wrong...'
			})

		const selectSql = `SELECT \`like\` FROM properties WHERE slug = ?`
		connection.query(selectSql, [slug], (err, data) => {
			if (err) {
				return res.status(500).json({
					error: 'Error fetching updated like count'
				})
			}

			return res.status(200).json({
				success: true,
				message: 'Like updated',
				likes: data[0]
			})
		})
	})
}

module.exports = {
	index,
	show,
	create,
	likeUpdate,
	upload  //added x file img
}