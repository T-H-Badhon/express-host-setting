import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the wrapped Express app written in TypeScript!');
});

app.get('/api/data', (req: Request, res: Response) => {
  res.json({ message: 'This is some data from the TypeScript Express app' });
});

export default app;

