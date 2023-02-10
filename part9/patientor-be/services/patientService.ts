import patients from '../data/patients';
import { Patient, NonSensitivePatient, NewPatient } from '../types';
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

export default {
  findById,
  getPatients,
  getNonSensitivePatients,
  addPatient
};