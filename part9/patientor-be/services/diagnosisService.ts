import diagnosisData from '../data/diagnoses.json';
import { Diagnosis } from '../types';


const getDiagnoses = (): Diagnosis[] => {
  return diagnosisData;
};

const addDiagnosis = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnosis
};