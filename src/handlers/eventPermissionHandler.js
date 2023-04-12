module.exports = {
	userHasPermission: async (user, neededPermissions) => {
		for (const permission of neededPermissions) {
			if (!user.permissions.has(permission)) {
				return false
			}
		}
		return true
	},
	checkMissingPermission: async (user, neededPermissions) => {
		if (!neededPermissions) return

		const missingPermissions = user.permissions.missing(neededPermissions)

		return missingPermissions
	},
}
