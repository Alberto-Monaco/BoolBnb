const connection = require('../db/connection.js')
const jwt = require('jsonwebtoken')
const secretKey = process.env.CRYPTOKEY

function encryptid(id) {
    const token = jwt.sign({ id }, secretKey)
    return token
}

function searchUrl(req, res) {


    const location = req.query.location
    const beds = req.query.beds
    const rooms = req.query.rooms
    const mq = req.query.mq
    const bathrooms = req.query.bathrooms
    const filters = []
    const params = []




    if (location) {
        filters.push('address LIKE ?')
        params.push(`%${location}%`)
    }
    if (beds) {
        filters.push('beds>=?')
        params.push(beds)
    }
    if (rooms) {
        filters.push('rooms>=?')
        params.push(rooms)
    }
    if (mq) {
        filters.push('mq>=?')
        params.push(mq)
    }
    if (bathrooms) {
        filters.push('bathrooms>=?')
        params.push(bathrooms)
    }
    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')} order by \`like\` desc` : ''
    const sql = `SELECT * FROM boolbnb.properties ${whereClause}`
    console.log(params);





    connection.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: 'Something went wrong... ',
                err: err
            })
        }
        const cryptoResultId = result.map(item => ({
            ...item,
            id_user: encryptid(item.id_user)
        }));
        res.status(200).json({
            properties: cryptoResultId,
            count: cryptoResultId.length
        })
    })


}

module.exports = {
    searchUrl
}