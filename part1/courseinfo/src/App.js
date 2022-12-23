const part1 = 'Fundamentals of React'
const exercises1 = 10
const part2 = 'Using props to pass data'
const exercises2 = 7
const part3 = 'State of a component'
const exercises3 = 14

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

const Content = () => {
  return (
    <div>
      <Part name={part1} exercises={exercises1}/> 
      <Part name={part2} exercises={exercises2}/> 
      <Part name={part3} exercises={exercises3}/> 
    </div>
  )
}

const Total = () => {
  return (
    <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
  )
}


const App = () => {
  // const-definitions
  const course = 'Half Stack application development'

  return (
    <div>
      <Header course={course} />
      <Content/>
      <Total/>
    </div>
  )
}

export default App