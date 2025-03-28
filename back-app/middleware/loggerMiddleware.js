const loggerMiddleware = (req, res, next) => {
    const now = new Date().toISOString();
    console.warn(`
       Date: ${now}
       Method: ${req.method}
       URL: ${req.originalUrl} 
    `);

    // Chiamata a next per proseguire con il ciclo di vita della richiesta
    next();
};

module.exports = loggerMiddleware;
