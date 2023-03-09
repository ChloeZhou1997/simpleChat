// @ts-nocheck
import { db } from '$lib/database'

export const handle =  async ({ event, resolve }) => {
		  // get cookies from browser
			const session = event.cookies.get('session')

			if (!session) {

				console.log("from hooks.server.js: there's no session stored");
				// if there is no session load page as normal
				return await resolve(event)
			}
		
			// find the user based on the session
			const user = await db.user.findUnique({
				where: { userAuthToken: session },
				select: { userName: true, message: true },
			})
		
			// if `user` exists set `events.local`
			if (user) {
				event.locals.user = {
					name: user.userName,
					message: user.message,
				}
			}

			console.log("from hooks.server.js: we are handling hooks.server");

			// load page as normal
			return await resolve(event)
	}