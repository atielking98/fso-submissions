import { NewPatient, Gender } from './types';

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(Gender).includes(param);
  };

const parseString = (value: unknown): string => {
    if (!value || !isString(value)) {
        throw new Error(`Incorrect or missing ${value}`);
    }
    return value;
};

const parseName = (name: unknown): string => {
    return parseString(name);
};

const parseSSN = (ssn: unknown): string => {
    return parseString(ssn);
};

const parseOccupation = (occupation: unknown): string => {
    return parseString(occupation);
};

const parseGender = (gender: unknown): Gender => {
	if (!gender || !isGender(gender)) {
		throw new Error(`Incorrect or missing gender: ${gender}`);
	}
	return gender;
};

const parseDateOfBirth = (date: unknown): string => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error(`Incorrect or missing dateOfBirth: ${date}`);
	}
	return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatient = (object: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(object.name),
    gender: parseGender(object.gender),
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    occupation: parseOccupation(object.occupation),
    ssn: parseSSN(object.ssn),
    entries: []
  };

  return newPatient;
};

export default toNewPatient;