import { like, deleteBlog, create } from '../reducers/blogReducer'
import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'
import Blog  from './Blog'
import { createNotification } from '../reducers/notificationReducer'
import { initializeBlogs } from '../reducers/blogReducer'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


const Blogs = ({user}) => {
    const dispatch = useDispatch()
    const blogFormRef = useRef()
    const blogs = useSelector((state) => state.blogs)

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    const createBlog = async (blog) => {
        dispatch(create(blog))
        blogFormRef.current.toggleVisibility()
        const message = `a new blog '${blog.title}' by ${blog.author} added`
        notify(message)
    }
    
      const removeBlog = (id) => {
        console.log(blogs)
        const blog = blogs.find((blog) => blog.id === id)
        const ok = window.confirm(
          `remove '${blog.title}' by ${blog.author}?`
        )
    
        if (!ok) {
          return
        }
    
        dispatch(deleteBlog(id))
        const message = `Blog ${blog.title} successfully deleted`
        notify(message)
      }
    
      const likeBlog = async (id) => {
        console.log(blogs)
        const toLike = blogs.find((b) => b.id === id)
        const liked = {
          ...toLike,
          likes: (toLike.likes || 0) + 1,
          user: toLike.user.id
        }
        const message = `Blog ${liked.title} successfully liked`
        dispatch(like(liked))
        notify(message)
      }
    
      const notify = (message, type = 'info') => {
        dispatch(createNotification({"message": message, "type": type}, 5000))
      }

    return (
        <div>
            <Togglable buttonLabel="create new" ref={blogFormRef}>
                <NewBlogForm onCreate={createBlog} />
            </Togglable>    

            {blogs.map((blog) => (
                <Blog
                key={blog.id}
                blog={blog}
                likeBlog={likeBlog}
                removeBlog={removeBlog}
                user={user}
                />
            ))}
        </div>
    )
}


export default Blogs