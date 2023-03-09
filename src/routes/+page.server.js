// @ts-nocheck
import { Configuration, OpenAIApi } from "openai";
import { SECRETE_API_KEY } from "$env/static/private";
import bcrypt from 'bcrypt';
import { db } from '$lib/database';

let message = [
	{
		role:"assistant",
		content: "Hi. I am a chatbot powered by openAI GPT, how can I help you :)"
	}
];

let userName;

const configuration = new Configuration({
	organization: "org-0NKblXKpoZsQ5ZRbpOPQR4ne",
  apiKey: SECRETE_API_KEY,
});

const openai = new OpenAIApi(configuration);


/** @type {import('./$types').PageServerLoad} */
export function load( {locals} ) {

	if ( locals.user ) {
		userName = locals.user.name;
		message = locals.user.message;
		}

  return {message,userName};
}

/** @type {import('./$types').Actions} */
export const actions = {
	register: async ({ cookies,request }) => {

		const data = Object.fromEntries(await request.formData());
		const username = data.username;
		const password = data.password;

		if (username.toString() === "" || !/\S/.test(username.toString())){
			return { success : false };
		}

		const user = await db.user.findUnique({
			where: { userName : username },
		})

		if (user) {
			return { success: false }
		}

		console.log("message is", message);

		message = [
			{
				role:"assistant",
				content: "Hi. I am a chatbot powered by openAI GPT, how can I help you :)"
			}
		];

		const newUser = await db.user.create(
					{
						data:{
							userName: username,
							passwordHash: await bcrypt.hash(password, 10),
							userAuthToken: crypto.randomUUID(),
							message : message
						}
					}
				)

		cookies.set('session', newUser.userAuthToken, {
			// send cookie for every page
			path: '/',
			// server side only cookie so you can't use `document.cookie`
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			sameSite: 'strict',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30,
		})

		return {success : true}
	},
	login: async ({ cookies, request }) => {
		const data = Object.fromEntries(await request.formData());
		const username = data.username;
		const password = data.password; 

		if(!username || !password){
			return {success: false}
		}

		const user = await db.user.findUnique({ where: { userName : username } })

		if (!user) {
			return { sucess: false };
		}

		const userPassword = await bcrypt.compare(password, user.passwordHash)

		if (!userPassword) {
			return { sucess: false }
		}

		const authenticatedUser = await db.user.update({
			where: { userName: user.userName },
			data: { userAuthToken: crypto.randomUUID() },
		})

		cookies.set('session', authenticatedUser.userAuthToken, {
			// send cookie for every page
			path: '/',
			// server side only cookie so you can't use `document.cookie`
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			sameSite: 'strict',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30,
		})

		console.log("from page.server.js: log in member", username, "the local.user is:", userName,"~~~~~");

		console.log(user.message);

		message = user.message;
	
		// redirect the user
		return { success: true };
	},

	logout: async ({ cookies }) => {
	
		cookies.set('session', '', {
      path: '/',
      expires: new Date(0),
    })
		console.log("from page.server.js: user is logging out!!!!!!");
		
		return { success: false }
	},

	createPost: async ({request}) => {
		const data = Object.fromEntries(await request.formData());
		const content = data.body

		if (content.toString() === "" || !/\S/.test(content.toString())){
			return;
		}

		message.push({role:"user",content:content.toString()})

		const completion = await openai.createChatCompletion(
			{model :  "gpt-3.5-turbo",
			messages : message})

		message.push(completion.data.choices[0].message)

		try {await db.user.update({
			where: { userName: userName },
			data: { message: message },
		})} catch(e) {
			console.log(e);
		}
		
		console.log("from page.server.js: new message was pushed into the databse;")
	},

	resetList: async ({request}) => {
		message = [
			{
				role:"assistant",
				content: "Hi. I am a chatbot powered by openAI GPT, how can I help you :)"
			}]

		await db.user.update({
			where: { userName: userName },
			data: { message: message },
		})

		console.log("from page.server.js: new message was cleared from the database!")
	}
}