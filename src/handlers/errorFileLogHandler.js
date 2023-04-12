const fs = require("fs")

module.exports = async (err, ...args) => {
	const fileLocation = "src/logs/errors.txt"

	let dateTime = new Date().toLocaleString("tr-TR", {
		timeZone: "Turkey",
	})

	let fileData = `${dateTime} \t *** \t ${err}\npath: ${args[0]}\nargs: ${args[1]}\n\n`

	fs.appendFileSync(fileLocation, fileData)
}
