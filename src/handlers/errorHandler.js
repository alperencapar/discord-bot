module.exports = () => {
	process.on("unhandledRejection", (reason, promise) => {
		console.log(`unhandledRejection: ${reason}`)
	})

	process.on("uncaughtException", (err, origin) => {
		console.log(`uncaughtException: ${err}`)
	})
}
