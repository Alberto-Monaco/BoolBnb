const connection = require('../db/connection')
const jwt = require('jsonwebtoken')
const secretKey = process.env.CRYPTOKEY

function encryptid(id) {
    const token = jwt.sign({ id }, secretKey)
    return token
}
function decrypt(id) {
    try {
        const decoded = jwt.verify(id, secretKey)
        return decoded.id
    } catch (err) {
        console.error('Errore nella decodifica dell\'id', err.message)
        return null
    }
}


// method LogIn to check if the user is present in the db

function logIn(req, res) {
    const email = req.body.email
    const password = req.body.password
    // verify if the email and the password are present
    if (!email || !password)
        return res.status(400).json({
            error: 'Fill all camps correctly'
        })

    const sql = `SELECT * FROM users WHERE email = ? `

    connection.query(sql, [email], (err, result) => {
        if (err)
            return res.status(500).json({
                error: 'Something went wrong...'
            })
        // verify if the user email is present in the db
        if (result.length === 0)
            return res.status(404).json({
                error: 'Nessun utente registrato con questa mail'
            })
        //verify if the password is correct
        if (result[0].password !== password)
            return res.status(404).json({ error: 'Password errata' })
        const user = result[0]
        // const id = encryptid(user.id)
        const tokenId = encryptid(user.id)
        const tokenPassword = encryptid(user.password)


        console.log(tokenId);

        // return the user
        res.status(200).json({
            status: 'success',
            success: true,
            user: { ...user, id: tokenId, password: tokenPassword }
        })
    })
}
// method registration to add a new user in the db
function registration(req, res) {
    const insertSql = `INSERT INTO users (name, surname, user_name, password, email, phone, type) VALUES (?, ?, ?, ?, ?, ?, ?)`
    const checkSql = `SELECT * FROM users WHERE email = ? OR user_name = ?`

    const { name, surname, userName, password, email, phone } = req.body
    const type = req.body.type.toUpperCase()
    console.log(encryptid(name));

    console.log(decrypt(encryptid(name)));



    // verify if the email or the userName are already in use
    connection.query(checkSql, [email, userName], (err, result) => {
        if (err)
            return res.status(500).json({
                error: 'something went wrong...',
                message: err
            })
        if (result.length > 0)
            if (result[0]?.email === email)
                return res.status(400).json({
                    error: 'Email already in use'
                })
        if (result[0]?.userName === userName)
            return res.status(400).json({
                error: 'Username already in use'
            })

        //veryfing if name, surname and userName are at least 3 characters long
        if (name.length < 3 || surname.length < 3 || userName.length < 3)
            return res.status(400).json({
                error: 'Name, surname and userName must be at least 3 characters long'
            })
        //verify correct password format
        if (password.length < 8 || /[^a-zA-Z0-9]/.test(password))
            return res.status(400).json({
                error: 'Password must be at least 8 characters long and contain only letters and numbers'
            })

        /*
        verify correct email format
        the email must have at least 1 character before the @, at least 1 charcter after @ and 2 characters after the last dot 
        */
        if (!/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
            return res.status(400).json({
                error: 'Email incorrect'
            })
        //verify correct phone format national or international
        if (
            (phone.length === 10 && !/^[0-9]{10}$/.test(phone)) ||
            (phone.length !== 10 && !/^\+[0-9]{12,15}$/.test(phone))
        )
            return res.status(400).json({
                error: 'Phone number incorrect'
            })
        // Verify if the type is UI or UP
        if (type !== 'UI' && type !== 'UP')
            return res.status(400).json({
                error: 'Type must be UI or UP'
            })

        connection.query(insertSql, [name, surname, userName, password, email, phone, type], (err, result) => {
            if (err)
                return res.status(500).json({
                    error: 'something went wrong...'
                })
            return res.status(201).json({
                status: 'success',
                success: true
            })
        })
    })
}

module.exports = {
    logIn,
    registration
}