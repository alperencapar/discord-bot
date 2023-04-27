const NodeCache = require("node-cache")
const db = require("./dbHandler")
const errorFileLogHandler = require("./errorFileLogHandler")

const cache = new NodeCache({ stdTTL: 600, checkperiod: 300 })

var models = []

// pull data from db
const getDataFromDatabase = async (Model, query, dataName) => {
	try {
		const data = {}

		// Veri tabanından verileri çekin ve önbelleğe kaydedin
		const records = await db.findAndSelect(Model, query)

		data[dataName] = records

		// update cache
		cache.set(dataName, data)

		const hasSameDataName = models.some(
			(model) => model.dataName === dataName
		)

		if (!hasSameDataName) {
			models.push({
				model: Model,
				query: query,
				dataName: dataName,
			})
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "dbCache")
	}
}

// update db
setInterval(async () => {
	for (const model of models) {
		await getDataFromDatabase(model.model, model.query, model.dataName)
	}
}, 120000)

// get cache info
const getRecords = async (Model, query, dataName) => {
	let data = cache.get(dataName)

	// Önbellekte veriler yoksa veri tabanından çekin ve önbelleğe kaydedin
	if (data == undefined) {
		await getDataFromDatabase(Model, query, dataName)
		data = cache.get(dataName)
	}

	return data
}

module.exports = {
	getRecords,
}
