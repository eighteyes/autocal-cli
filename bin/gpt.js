import * as fs from 'fs';

import * as path from 'path';

import { Configuration, OpenAIApi } from 'openai';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function handleMakePlan(yargs) {
  console.log(yargs);
  let key = process.env.OPENAI_API_KEY || yargs.config.openAIKey;
  const plan = yargs.value;
  if (typeof key == 'undefined') {
    return console.log(
      'No OpenAI Key Found. Pleasd add an OPENAI_API_KEY to your environment, or use `acal config openai <token>`. You can get an OpenAI API token from https://platform.openai.com/account/api-keys.'
    );
  }
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: fs.readFileSync(__dirname + '/prompt-system').toString(),
        },
        {
          role: 'user',
          content:
            fs.readFileSync(__dirname + '/prompt-user').toString() + plan,
        },
      ],
    });
    console.log(completion.data.choices);
    const gptPlan = completion.data.choices[0].message.content;
  } catch (e) {
    console.log(e);
  }
}
