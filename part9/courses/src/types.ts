export interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }

  export interface CoursePartInfo extends CoursePartBase {
    description: string;
  }
  
export interface CoursePartBasic extends CoursePartInfo {
    kind: "basic"
  }
  export interface CoursePartSpecial extends CoursePartInfo {
    requirements: string[];
    kind: "special"
  }
  
export interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
  }
  
export interface CoursePartBackround extends CoursePartInfo {
    backroundMaterial: string;
    kind: "background"
  }
  
export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackround | CoursePartSpecial;

export interface CoursePartsProps {
    courseParts: CoursePart[]
}
export interface PartProps {
    part: CoursePart
}