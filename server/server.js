// calling our dependices/
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

// creating a new openAI configuration, using our API KEY
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex',
  });
});
// listens to a POST request and receives a response from CODEX
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // the model of AI we are using
      prompt: `${prompt}`, // the prompt we receive from our client-side
      temperature: 0, // higher value means the model will take more risks
      max_tokens: 3000, // the max number of tokens to generate in completion.
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, //number between -2 to 2. Positive values allow the mode to decrease the likelihood to repeat the same line verbatim
      presence_penalty: 0, // number between -2 to 2. Positive values increases the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () => {
  console.log('Server is listening on port http://localhost:5000');
});
