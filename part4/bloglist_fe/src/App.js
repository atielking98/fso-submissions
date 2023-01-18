import { useState, useEffect } from 'react'
import blogService from './services/blogs'

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

const Filter = ({newSearch, handleSearchChange}) => {
  return (
    <div>
        filter shown with:<input value={newSearch} onChange={handleSearchChange}></input>
    </div>
  )
}

const Form = ({addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange,
   newURL, handleURLChange, newLikes, handleLikesChange}) => {
  return (
    <form onSubmit={addBlog}>
        <div>
          title: <input value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
          author: <input value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
          url: <input value={newURL} onChange={handleURLChange} />
        </div>
        <div>likes: <input value={newLikes} onChange={handleLikesChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Blog =({blog, deleteBlog}) => {
  return (
    <li>
      <span><b>{blog.title}</b></span> by <span>{blog.author}</span> URL:<a id="url" target="_blank" rel="noopener noreferrer" href={blog.url}>{blog.url}</a> <span>{blog.likes} likes</span><button onClick={deleteBlog}>Delete</button>
    </li>
  )
}

const Blogs = ({blogsToShow, deleteBlog}) => {
  return (
    <ul>
      {blogsToShow.map(blog => <Blog key={blog.title} blog={blog} deleteBlog={deleteBlog}/>)}
    </ul>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([]) 
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')
  const [newLikes, setNewLikes] = useState(0)
  const [messageSuccess, setMessageSuccess] = useState(null)
  const [messageError, setMessageError] = useState(null)
  const [newSearch, setNewSearch] = useState('')

  
  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  }
  
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

  const deleteBlog = (event) => {
    const title = event.target.parentElement.children[0].textContent;
    const toDeleteId = blogs.find(blog => blog.title === title).id;
    if (window.confirm(`Delete ${title}?`)) {
      blogService
        .deleteBlog(toDeleteId)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== toDeleteId))
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
          setMessageSuccess(
            `Changed ${returnedBlog.title}'s info!`
          )
          setTimeout(() => {
            setMessageSuccess(null)
          }, 5000)
        })
        .catch(() => {
          setMessageError(
            `Person '${foundBlog.title}' was already removed from server`
          )
          setTimeout(() => {
            setMessageError(null)
          }, 5000)
          setBlogs(blogs.filter(blog => blog.id !== foundBlog.id))
        })
      }
    } else {
      blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessageSuccess(
          `Added ${returnedBlog.title}'s info!`
        )
        setTimeout(() => {
          setMessageSuccess(null)
        }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewURL('')
        setNewLikes(0)
      })
      .catch(error => {
        // this is the way to access the error message
        console.log(error.response.data.error)
        setMessageError(
          error.response.data.error
        )
        setTimeout(() => {
          setMessageError(null)
        }, 5000)
      })
    }
  }

  const blogsToShow = blogs.filter(blog => blog.title.toLowerCase().includes(newSearch.toLowerCase()))

  return (
    <div>
      <h2>Bloglist</h2>
      <Notification message={messageSuccess} messageClass="success"/>
      <Notification message={messageError} messageClass="error"/>
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange}/>
      <h2>Add a New Blog</h2>
      <Form addBlog={addBlog} newTitle={newTitle} 
        handleTitleChange={handleTitleChange} newAuthor={newAuthor} 
        handleAuthorChange={handleAuthorChange} newURL={newURL} handleURLChange={handleURLChange}
        newLikes={newLikes} handleLikesChange={handleLikesChange}/>
      <h2>Blogs</h2>
      <Blogs deleteBlog={deleteBlog} blogsToShow={blogsToShow}/>
    </div>
  )
}

export default App