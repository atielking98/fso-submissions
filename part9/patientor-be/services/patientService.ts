import patients from '../data/patients';
import { Patient, NewEntry, Entry, NonSensitivePatient, NewPatient } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p=> p.id === id);
  console.log(patients);
  return patient;
};


const getNonSensitivePatients = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const addPatient = (patient: NewPatient): Patient => {
    const id = uuid();
    const newPatient = {
        id: id,
        ...patient
      };
    patients.push(newPatient);
    return newPatient;
};

const addPatientEntry = (patientId: Patient['id'], entry: NewEntry): Entry | undefined => {
	const patient = findById(patientId);
  const entryId = uuid();
	if (!patient) {
		return undefined;
	}
	const newEntry = { ...entry, id: entryId } as Entry;
	patient.entries.push(newEntry);
	return newEntry;
};

export default {
  findById,
  getPatients,
  getNonSensitivePatients,
  addPatient,
  addPatientEntry
};