export const calculateBmi = (height: number, weight: number): string => {
    const heightMetersSquared = Math.pow(height / 100, 2);
    const BMI = weight / heightMetersSquared;
    let BmiString;
    if (BMI < 16.0) {
        BmiString = "Underweight (Severe thinness)";
    } else if (BMI <= 16.9) {
        BmiString = "Underweight (Moderate thinness)";
    } else if (BMI <= 18.4) {
        BmiString = "Underweight (Mild thinness)";
    } else if (BMI <= 24.9) {
        BmiString = "Normal range";
    } else if (BMI <= 29.9) {
        BmiString = "Overweight (Pre-obese)";
    } else if (BMI <= 34.9) {
        BmiString = "Obese (Class I)";
    } else if (BMI <= 39.9) {
        BmiString = "Obese (Class II)";
    } else {
        BmiString = "Obese (Class III)";
    }
    return BmiString;
};
interface BmiValues {
    height: number;
    weight: number;
  }  

const parseArguments = (args: Array<string>): BmiValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');
  
    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
      return {
        height: Number(args[2]),
        weight: Number(args[3])
      };
    } else {
      throw new Error('Provided values were not numbers!');
    }
  };
  
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(`Calculated BMI for height ${height} and weight ${weight}, the result is: `, calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
