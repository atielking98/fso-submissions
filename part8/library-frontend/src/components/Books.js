const Books = (props) => {
  const filterBooks = async (event) => {
    event.preventDefault()
    const buttonName = event.target.textContent
    if (buttonName === 'all genres') {
      props.setGenreFilter('')
    } else {
      props.setGenreFilter(buttonName)
    }
  }
  if (!props.show) {
    return null
  }
  const books = props.books
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {books.map((b) => {
            const genreString = b.genres.join(", ")
            return (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td>{genreString}</td>
            </tr>
            )
            })}
        </tbody>
      </table>
      {props.genresList.map((genre) => <button onClick={filterBooks}>{genre}</button>)}
    </div>
  )
}

export default Books
