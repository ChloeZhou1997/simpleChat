import {PrismaClient} from '@prisma/client';

const db = new PrismaClient();

let users = [{
	"userName":"chloe",
	"password":"654321",
	"message": 	[{
		role:"assistant",
		content: "Hi. I am a chatbot powered by openAI GPT, how can I help you :)"
	},
	{
		role:"user",
		content: "I am chloe, can you help me"
	}]
},
{
	"userName":"xyz",
	"password":"123456",
	"message": 	[{
		role:"assistant",
		content: "Hi. I am a chatbot powered by openAI GPT, how can I help you :)"
	}]
}]



main(); 