import * as fs from 'fs';

import * as path from 'path';

import { Configuration, OpenAIApi } from 'openai';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { writeNewPlan } from './io.js';
import readline from 'readline';

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
    const gptPlan = completion.data.choices[0].message.content
      .split('\n')
      .map((line) => line.trim());

    if (gptPlan.indexOf("I'm sorry") > -1) {
      throw new Error('Unsuitable Plan.');
    }

    // Create a new array of the lines in the plan from the start line to the end line
    const start = gptPlan.slice(
      gptPlan.indexOf('= START =') + 1,
      gptPlan.indexOf('= END =')
    );
    // Join the lines of the new array with new line characters
    console.log(start.join('\n'));

    // remove title from start, save as title
    const title = start.splice(0, 1)[0];
    const fileName = title.replace(/ /g, '_').toLowerCase() + '.acr';

    // remove items from start until we hit a #
    while (start[0].indexOf('#') == -1) {
      start.splice(0, 1);
    }

    // confirm saving the file using readline
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Save plan to ' + fileName + '? [y/n]', (answer) => {
      if (answer == 'y') {
        // save file to config directory
        writeNewPlan(fileName, start.join('\n'));
        console.log(`Plan saved to ${fileName}`);
      } else {
        console.log('Plan not saved.');
      }
      rl.close();
    });
  } catch (e) {
    console.log(e);
  }
}
