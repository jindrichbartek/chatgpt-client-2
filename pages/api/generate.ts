// pages/api/generate.ts
import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from 'next';

const configuration = new Configuration({
 apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generate(req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid prompt',
      },
    });
    return;
  }

  try {
    const completion: any  = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0
    });

    if (completion?.data?.choices?.length ?? 0 > 0) { 
      res.status(200).json({ result: completion.data.choices[0].message.content }); 
    } else {
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }

  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

export default generate;

