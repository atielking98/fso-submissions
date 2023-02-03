import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Recommend from './components/Recommend'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useQuery, useApolloClient } from '@apollo/client'

import { ALL_AUTHORS, MY_INFO, FILTERED_BOOKS, ALL_BOOKS } from './queries'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return <div style={{ color: 'red' }}>{errorMessage}</div>
}

const App = () => {
  const pastToken = localStorage.getItem('library-user-token')
  const [token, setToken] = useState(pastToken ? pastToken : null)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [recommendedGenre, setRecommendedGenre] = useState('')
  const [recommendedBooks, setRecommendedBooks] = useState(null)
  const [filteredGenre, setFilteredGenre] = useState('')
  const [filteredBooks, setFilteredBooks] = useState(null)
  const [genresList, setGenresList] = useState([])
  const [allBooks, setAllBooks] = useState([])
  const client = useApolloClient()

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const myInfo = useQuery(MY_INFO)

  

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  useEffect(() => {
    /* If there's no filter, just show allBooks */
    if (filteredGenre === '') {
      setFilteredBooks(allBooks)
    }
    else {
      const getFiltered = async (genre, client) => {
        const result = await client.query({
          query: FILTERED_BOOKS,
          variables: { genre },
          fetchPolicy: "network-only"
        })
        setFilteredBooks(result.data.allBooks)
      }
      getFiltered(filteredGenre, client)
    }
  }, [filteredGenre, client, allBooks])

  useEffect(() => {
    /* If there's no filter, just show allBooks */
    if (recommendedGenre === '') {
      // console.log('no recommended genre to filter')
      setRecommendedBooks(allBooks)
    }
    else {
      const getFiltered = async (genre, client) => {
        const result = await client.query({
          query: FILTERED_BOOKS,
          variables: { genre },
          fetchPolicy: "network-only"
        })
        setRecommendedBooks(result.data.allBooks)
      }
      getFiltered(recommendedGenre, client)
    }
  }, [token, recommendedGenre, client, allBooks, page])

  useEffect(() => {
    if (myInfo && myInfo.data && myInfo.data.me) {
      if (myInfo.data.me.favouriteGenre !== '') {
        setRecommendedGenre(myInfo.data.me.favouriteGenre)
      }
    }
  }, [myInfo])

  useEffect(() => {
    let allGenres = []
    if (resultBooks && resultBooks.data && resultBooks.data.allBooks) {
      const books = resultBooks.data.allBooks
      setAllBooks(books)
      for (let i = 0, numBooks = books.length; i < numBooks; i++) {
        const book = books[i]
        for (let j = 0, numGenres = book.genres.length; j < numGenres; j++) {
          const genre = book.genres[j]
          /* add their genres to the list if it's unique */
          if (!allGenres.includes(genre)) {
            allGenres.push(genre)
          }
        }
      }
    }
    allGenres.push("all genres")
    setGenresList(allGenres)
  }, [resultBooks])

  if (resultAuthors.loading || resultBooks.loading || myInfo.loading) {
    return <div>loading...</div>
  }

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} authors={resultAuthors.data.allAuthors}  />

      <Books show={page === 'books'} books={filteredBooks} setGenreFilter={setFilteredGenre} genresList={genresList}/>

      <NewBook show={page === 'add'} setError={notify} />

      <Recommend show={page === 'recommend'} genre={recommendedGenre} books={recommendedBooks}/>

    </div>
  )
}

export default App
