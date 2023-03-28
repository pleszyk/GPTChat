import { Configuration, OpenAIApi } from 'openai'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'

dotenv.config()
const configuration = new Configuration({
  apiKey: process.env.API_KEY
});
const openai = new OpenAIApi(configuration);

const app = express()
app.use(express())
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 4000;

app.post('/', async (req, res) => {
  const { message } = req.body
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: message,
  });
  res.json({
    message: response.data.choices[0].message.content,
  })
})

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})