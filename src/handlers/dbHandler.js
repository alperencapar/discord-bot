module.exports = {
	findRecord: async (Model, query) => {
		let record = await Model.findOne(query)
		return record
	},

	createRecord: async (Model, data, save = true) => {
		let record = new Model(data)

		if (save) await record.save()
		return record
	},

	findOneAndRemoveRecord: async (Model, query) => {
		await Model.findOneAndRemove(query)
	},

	findAndSelect: async (Model, query, selectParameter) => {
		const records = await Model.find(query).select(selectParameter)
		return records
	},
}
