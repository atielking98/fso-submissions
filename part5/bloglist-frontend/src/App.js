import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const Notification = ({ message, messageClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={messageClass}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')
  const [newLikes, setNewLikes] = useState(0)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [messageError, setErrorMessage] = useState(null)
  const [messageSuccess, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()
  
  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
      console.log('these are the blogs')
      console.log(blogs)
    })  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log(user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  }

  const handleURLChange = (event) => {
    setNewURL(event.target.value);
  }

  const handleLikesChange = (event) => {
    setNewLikes(event.target.value);
  }

  const likeBlog = (event) => {
    console.log(event.target.parentElement.parentElement)
    const title = event.target.parentElement.parentElement.children[0].children[0].textContent
    const foundBlog = blogs.find(blog => blog.title === title)
    console.log(foundBlog.id)
    console.log(foundBlog)
    const blogObject = {
      title: foundBlog.title,
      author: foundBlog.author,
      url: foundBlog.url,
      likes: foundBlog.likes + 1,
      user: foundBlog.user.id
    }
    console.log(blogObject)
    console.log('liked!')
    blogService
      .update(foundBlog.id, blogObject)
      .then(() => {
        setBlogs(blogs.map(blog => {
          if (blog.title === title) {
            return {...blogObject, user: foundBlog.user}
          } else {
            return blog
          }
        }))
      })
      .catch(error => {
        // this is the way to access the error message
        console.log(error.response.data.error)
        setErrorMessage(
          error.response.data.error
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = (event) => {
    const title = event.target.parentElement.children[0].children[0].textContent
    const toDeleteId = blogs.find(blog => blog.title === title).id;
    if (window.confirm(`Delete ${title}?`)) {
      blogService
        .deleteBlog(toDeleteId)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== toDeleteId))
        })
        .catch(error => {
          // this is the way to access the error message
          console.log(error.response.data.error)
          setErrorMessage(
            error.response.data.error
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const addBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
      likes: newLikes
    }
    const foundBlog = blogs.find(blog => blog.title === newTitle);
    if (foundBlog) {
      if(window.confirm(`${newTitle} is already added to bloglist, replace the old blog info with new info?`)) {
        blogService
        .update(foundBlog.id, blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.map(blog => blog.id !== foundBlog.id ? blog : returnedBlog))
          setSuccessMessage(
            `Changed ${returnedBlog.title}'s info!`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(() => {
          setErrorMessage(
            `Person '${foundBlog.title}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setBlogs(blogs.filter(blog => blog.id !== foundBlog.id))
        })
      }
    } else {
      blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setSuccessMessage(
          `Added ${returnedBlog.title}'s info!`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewURL('')
        setNewLikes(0)
      })
      .catch(error => {
        // this is the way to access the error message
        console.log(error.response.data.error)
        setErrorMessage(
          error.response.data.error
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
    blogFormRef.current.toggleVisibility()
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logOut = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <Notification message={messageSuccess} messageClass="success"/>
      <Notification message={messageError} messageClass="error"/>
      { user === null ?
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable> :
        <div>
          <h2>blogs</h2>
          <h3>{ user.username } logged in</h3>
          <button onClick={logOut}>log out</button>
          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog user={user} blogUsername={blog.user.username} likeBlog={likeBlog} deleteBlog={deleteBlog} key={blog.id} blog={blog} />
          )}
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm 
              addBlog={addBlog} 
              newTitle={newTitle} 
              handleTitleChange={handleTitleChange} 
              newAuthor={newAuthor} 
              handleAuthorChange={handleAuthorChange} 
              newURL={newURL} 
              handleURLChange={handleURLChange}
              newLikes={newLikes} 
              handleLikesChange={handleLikesChange}
            />
          </Togglable>
        </div>
      }
    </div>
  )
}

export default App
