import { Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import {
    BrowserRouter as Router,
    Link,
  } from "react-router-dom"

const Users = () => {
    const users = useSelector((state) => state.users)
    if (!users) {
        return null
    }
    return (
        <div>
            <h2>Users</h2>
            <Table striped>
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                    <tr key={user.id}>
                        <td>
                        <Link to={`/users/${user.id}`}>
                            {user.name}
                        </Link>
                        </td>
                        <td>
                        {user.blogs.length}
                        </td>
                    </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Users