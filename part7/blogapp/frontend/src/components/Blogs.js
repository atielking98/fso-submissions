import { create } from '../reducers/blogReducer'
import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'
import { createNotification } from '../reducers/notificationReducer'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
    BrowserRouter as Router,
    Link,
  } from "react-router-dom"


const Blogs = ({blogs, user}) => {
    const dispatch = useDispatch()
    const blogFormRef = useRef()

    const createBlog = async (blog) => {
        dispatch(create(blog))
        blogFormRef.current.toggleVisibility()
        const message = `a new blog '${blog.title}' by ${blog.author} added`
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
            <ul>
            {blogs.map((blog) => (
                <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
            ))}
            </ul>
        </div>
    )
}


export default Blogs