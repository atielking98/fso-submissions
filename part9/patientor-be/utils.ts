import { NewPatient, NewEntry, Gender, HospitalEntry, Entry, BaseEntry, OccupationalHealthcareEntry, HealthCheckEntry, HealthCheckRating } from './types';

const assertNever = (value: never): never => {
	throw new Error(
		`Unhandled discriminated union member: ${JSON.stringify(value)}`
	);
};

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

  const isHealthCheckRating = (param: any): param is HealthCheckRating => {
	return Object.values(HealthCheckRating).includes(Number(param));
};

const isBaseEntry = (param: any): param is BaseEntry => {
	const v = param as BaseEntry;
	// if (!isString(v.id)) {
	// 	return false;
	// }
	if (!isString(v.date) || !isDate(v.date)) {
		return false;
	}
	if (!isString(v.description)) {
		return false;
	}
	if (!isString(v.specialist)) {
		return false;
	}
	if (typeof (v.diagnosisCodes) === 'undefined') {
		return true;
	}
	return Array.isArray(v.diagnosisCodes) && v.diagnosisCodes.every(dc => typeof (dc) === 'string');
};

const isEntry = (param: any): param is Entry => {
	if (!isBaseEntry(param)) {
		return false;
	}
	const v = param as Entry;
	switch (v.type) {
		case 'HealthCheck':
			return isHealthCheckRating(v.healthCheckRating);
		case 'Hospital':
			if (typeof (v.discharge) !== 'object') {
				return false;
			}
			const { date, criteria } = v.discharge;
			return isString(date) && isDate(date) && isString(criteria);
		case 'OccupationalHealthcare':
			if (!isString(v.employerName)) {
				return false;
			}
			if (typeof (v.sickLeave) === 'undefined') {
				return true;
			}
			const { startDate, endDate } = v.sickLeave;
			return (isString(startDate) && isDate(startDate)
				&& isString(endDate) && isDate(endDate)
			);
		default:
			return assertNever(v);
	}
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

const _extract_BaseEntry = (obj: BaseEntry): BaseEntry => {
	return {
		id: obj.id,
		description: obj.description,
		date: obj.date,
		specialist: obj.specialist,
		diagnosisCodes: obj.diagnosisCodes
	};
};

const _extract_HealthCheckEntry = (obj: HealthCheckEntry): HealthCheckEntry => {
	return {
		..._extract_BaseEntry(obj),
		type: obj.type,
		healthCheckRating: obj.healthCheckRating,
	};
};

const _extract_OccupationalHealthCareEntry = (obj: OccupationalHealthcareEntry): OccupationalHealthcareEntry => {
	const o: OccupationalHealthcareEntry = {
		..._extract_BaseEntry(obj),
		type: obj.type,
		employerName: obj.employerName,
	};
	if (obj.sickLeave) {
		o.sickLeave = {
			startDate: obj.sickLeave.startDate,
			endDate: obj.sickLeave.endDate
		};
		return o;
	}
	return o;
};

const _extract_HospitalEntry = (obj: HospitalEntry): HospitalEntry => {
	return {
		..._extract_BaseEntry(obj),
		type: obj.type,
		discharge: {
			date: obj.discharge.date,
			criteria: obj.discharge.criteria
		},
	};
};

const _extract_Entry = (obj: Entry): Entry => {
	switch (obj.type) {
		case 'HealthCheck':
			return _extract_HealthCheckEntry(obj);
		case 'Hospital':
			return _extract_HospitalEntry(obj);
		case 'OccupationalHealthcare':
			return _extract_OccupationalHealthCareEntry(obj);
		default:
			return assertNever(obj);
	}
};

const parseEntry = (entry: any): Entry => {
	if (!entry || !isEntry(entry)) {
		throw new Error(`Malformed entry: ${JSON.stringify(entry)}`);
	}
	return _extract_Entry(entry);
};

const parseEntries = (entries: any): Array<Entry> => {
	if (!entries || !Array.isArray(entries)) {
		throw new Error(`Malformed entries: ${JSON.stringify(entries)}`);
	}
	return entries.map(v => parseEntry(v));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatient = (object: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(object.name),
    gender: parseGender(object.gender),
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    occupation: parseOccupation(object.occupation),
    ssn: parseSSN(object.ssn),
    entries: parseEntries(object.entries),
  };

  return newPatient;
};

const toNewEntry = (obj: Record<string, unknown>): NewEntry => {
	return parseEntry(obj);
};

export {
	toNewPatient,
	toNewEntry,
};