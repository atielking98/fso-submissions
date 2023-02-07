interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
  }

export const calculateExercises = (exerciseHours: Array<number>, targetDailyHours: number): Result => {
    const periodLength = exerciseHours.length;
    let trainingDays = 0;
    let totalHours = 0;
    for (let i = 0; i < exerciseHours.length; i++) {
        if (exerciseHours[i] > 0) {
            trainingDays += 1;
            totalHours += exerciseHours[i];
        }
    }
    const avgDailyTime = totalHours / periodLength;
    const success = avgDailyTime >= targetDailyHours;
    let rating;
    let ratingDescription;
    if (avgDailyTime < 0.5 * targetDailyHours) {
        rating = 1;
        ratingDescription = "pick up the pace!";
    } else if (avgDailyTime < targetDailyHours) {
        rating = 2;
        ratingDescription = "not too bad but could be better...";
    } else {
        rating = 3;
        ratingDescription = "target reached! way to go!";
    }
    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription,
        target: targetDailyHours,
        average: avgDailyTime
    };
};

interface ExerciseValues {
    hoursArray: Array<number>;
    targetDailyHours: number;
  }  

const parseArgumentsExercise = (args: Array<string>): ExerciseValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    const hoursArray = [];
    for (let i = 3; i < args.length; i++) {
        if (isNaN(Number(args[i]))) {
            throw new Error('Provided array value not a number.');
        }
        hoursArray.push(Number(args[i]));
    }
    if (isNaN(Number(args[2]))) {
        throw new Error('Target daily hours value not a number.');
    } 
    const targetDailyHours = Number(args[2]);

    return {
        hoursArray: hoursArray, 
        targetDailyHours: targetDailyHours
    }; 
  };
  
  try {
    const { hoursArray, targetDailyHours } = parseArgumentsExercise(process.argv);
    console.log(calculateExercises(hoursArray, targetDailyHours));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }