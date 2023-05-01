const NodeCache = require("node-cache")
const db = require("./dbHandler")
const errorFileLogHandler = require("./errorFileLogHandler")

const cache = new NodeCache({ stdTTL: 1500, checkperiod: 900 })

var models = []

// pull data from db
const getDataFromDatabase = async (Model, query = {}, dataName) => {
	try {
		const data = {}

		// Veri tabanından verileri çekin ve önbelleğe kaydedin
		let records
		records = await db.findAndSelect(Model, query)

		data[dataName] = records

		if (records) {
			cache.set(dataName, data[dataName])
		}

		//for auto refesh

		const hasSameDataName = models.some(
			(model) => model.dataName === dataName
		)

		if (!hasSameDataName) {
			models.push({
				model: Model,
				dataName: dataName,
			})
		}
	} catch (error) {
		const ErrFileLocation = __dirname + __filename
		errorFileLogHandler(error, ErrFileLocation, "dbCache")
	}
}

const refreshCache = async (Model, query = {}, dataName) => {
	await getDataFromDatabase(Model, query, dataName)
}

// update db
setInterval(async () => {
	for (const model of models) {
		await refreshCache(model.model, {}, model.dataName)
	}
}, 600000)

// get cache info
const getRecords = async (Model, query = {}, dataName) => {
	let data = cache.get(dataName)

	// Önbellekte veriler yoksa veri tabanından çekin ve önbelleğe kaydedin
	if (data == undefined) {
		await getDataFromDatabase(Model, query, dataName)
		data = cache.get(dataName)
		if (!data) return null
	}
	return data
}

module.exports = {
	getRecords,
	refreshCache,
}
