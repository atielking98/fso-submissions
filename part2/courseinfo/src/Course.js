const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )}
    <Total sum={parts.map(part => part.exercises).reduce((prev, next) => prev + next)} />
  </>

const Course = ({course}) => 
  <>
    <Header course={course.name}/>
    <Content parts={course.parts}/>
  </>

export default Course