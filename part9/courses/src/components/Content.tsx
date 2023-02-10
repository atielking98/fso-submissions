import { CoursePartsProps, PartProps } from "../types";

const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

const Part = (props: PartProps) => {
    const part = props.part;
    switch (part.kind) {
        case "basic":
            return <div><p><b>{part.name}</b> {part.exerciseCount}</p> <p>{part.description}</p></div>;
        case "group":
            return <div><p><b>{part.name}</b> {part.exerciseCount}</p> <p>{part.groupProjectCount}</p></div>;
        case "background":
            return <div><p><b>{part.name}</b> {part.exerciseCount}</p> <p>{part.description} {part.backroundMaterial}</p></div>;
        case "special":
            return <div><p><b>{part.name}</b> {part.exerciseCount}</p> <p>{part.description}</p> <p><em>Requirements:</em> {part.requirements.join(", ")}</p></div>;
        default:
            return assertNever(part);
    }
};

const Content = (props: CoursePartsProps) => {
    const courseParts = props.courseParts
    return (
        <div>
            {courseParts.map(part => <Part key={part.name} part={part}/>)}
        </div>
    );
};
    

export default Content;