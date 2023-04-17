const errorFileLogHandler = require("./errorFileLogHandler")

module.exports = () => {
	process.on("unhandledRejection", (reason, promise) => {
		console.log(`unhandledRejection: ${reason}`)
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(reason, ErrFileLocation, "errorHandler")
	})

	process.on("uncaughtException", (err, origin) => {
		console.log(`uncaughtException: ${err}`)
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(err, ErrFileLocation, "errorHandler")
	})
}
