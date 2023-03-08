export const load = async ( {locals} ) => {

	if (!locals.user) {
		console.log("from layout.server.js: the local.user is undefined")
	} else {
		console.log("from layout.server.js : return the user info", locals.user.name, "to backend");
	}

		return {
			user: locals.user
		}
	}