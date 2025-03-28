const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({ error: 'Sorry can\'t find that!' });
}

module.exports = notFoundMiddleware;