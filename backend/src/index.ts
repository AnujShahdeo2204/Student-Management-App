import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Placeholder for chatbot endpoint
app.post('/api/chatbot', (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  // Future AI logic goes here
  res.json({
    reply: `I received your message: "${message}". The AI backend is ready to be hooked up!`,
  });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
