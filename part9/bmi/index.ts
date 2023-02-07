import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.post('/exercises', (req, res) => {
  console.log(req.body);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
  const { daily_exercises, target } = req.body;
  if ( !daily_exercises || !(daily_exercises instanceof Array) || !target || isNaN(Number(target))) {
    res.status(400).send({ error: 'parameters missing'});
  }
  const exercisesParsed = [];
  for (let i = 0; i < daily_exercises.length; i++) {
    if (isNaN(Number(daily_exercises[i]))) {
        res.status(400).send({ error: 'malformmated parameters'});
    } else {
        exercisesParsed.push(Number(daily_exercises[i]));
    }
  }
  const result = calculateExercises(exercisesParsed, Number(target));
  res.json(result);
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    if (isNaN(height) || isNaN(weight)) {
        res.send({error: "malformatted parameters"});
    }
    console.log(height);
    console.log(weight);
    const BmiString = calculateBmi(height, weight);
    res.send({weight: weight, height: height, bmi: BmiString});
  });

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});