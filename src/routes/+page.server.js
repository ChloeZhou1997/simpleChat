// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { Configuration, OpenAIApi } from "openai";
import { SECRETE_API_KEY } from "$env/static/private";


let message = [
	{
		role:"assistant",
		content: "I am a helpful assistant powered by GPT"
	}
];

const configuration = new Configuration({
	organization: "org-0NKblXKpoZsQ5ZRbpOPQR4ne",
  apiKey: SECRETE_API_KEY,
});

const openai = new OpenAIApi(configuration);


/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  return {message};
}

/** @type {import('./$types').Actions} */
export const actions = {
	createPost: async ({request}) => {
		const data = Object.fromEntries(await request.formData());
		const content = data.body
		message.push({role:"user",content:content.toString()})

		const completion = await openai.createChatCompletion(
			{model :  "gpt-3.5-turbo",
			messages : message}
		)

		message.push(completion.data.choices[0].message)
	}

}