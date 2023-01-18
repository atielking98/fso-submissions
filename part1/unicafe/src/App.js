import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine =({text, value, moreText=""}) => {
  return (
    <tr>
      <td>
        {text}
      </td>
      <td>
        {value}{moreText}
      </td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, all, totalScore}) => {
  if (all === 0) {
    return (
      <><p>No feedback has been given</p></>
    )
  }
  return (
    <>
      <h1>Statistics</h1>
      <table>
        <tbody>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value ={neutral} />
      <StatisticLine text="bad" value ={bad} />
      <StatisticLine text="all" value ={all} />
      <StatisticLine text="average" value ={bad} />
      <StatisticLine text="positive" value={good / all * 100} moreText={"%"} />
      </tbody>
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(all + 1)
    setTotalScore(totalScore + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(all + 1)
    setTotalScore(totalScore - 1)
  }

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />

      <Statistics good={good} neutral={neutral} bad={bad} all={all} totalScore={totalScore}/>
    </div>
  )
}

export default App