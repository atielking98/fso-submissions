import express from 'express';
import cors from 'cors';

const app = express();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

const PORT = 3001;

const router = express.Router();
router.get('/ping', (_req, res) => {
	res.send('pong');
});

app.use('/api', router);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});