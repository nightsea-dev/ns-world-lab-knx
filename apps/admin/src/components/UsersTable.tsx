import { useEffect, useState } from 'react'
import { User } from "@ns-lab-klx/types"
import { API } from "@ns-lab-klx/logic"
import { _use_state } from "@ns-lab-klx/ui"


const commonStyles = {
    border: '1px solid #ccc',
    padding: '8px',
}
    , tableHead = (
        <thead>
            <tr>
                <th style={commonStyles}>Name</th>
                <th style={commonStyles}>Email</th>
                <th style={commonStyles}>Job Title</th>
            </tr>
        </thead>
    )



export const UsersTable = () => {

    const [state, _set_state] = _use_state({
        users: [] as User[]
        , selectedUser: undefined as undefined | User
    })
        // , [selectedUser, setSelectedUser] = useState<User | null>(null)

        , _onUserClick = (selectedUser: User) => {
            _set_state({
                selectedUser
            })
            // setSelectedUser(user)
        }


    useEffect(() => {
        API.fetchUsers(25)
            .then(users => {
                _set_state({
                    users
                    // .map((user) => ({
                    //     // why the [user:any] ???
                    //     // data.map((user: any) => ({
                    //     /**
                    //      * * why the [uuid]
                    //      */
                    //     uuid: user.id,
                    //     name: user.name,
                    //     email: user.email,
                    //     job: user.job,
                    // }))
                })
            })
            .catch(console.error)
    })




    return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            {tableHead}
            {/* <thead>
                <tr>
                    <th style={commonStyles}>Name</th>
                    <th style={commonStyles}>Email</th>
                    <th style={commonStyles}>Job Title</th>
                </tr>
            </thead> */}
            <tbody>
                {state.users.map(user => {
                    const {
                        name
                        , email
                        , job
                    } = user
                    return (
                        <tr
                            onClick={() => _onUserClick(user)}
                            style={{
                                backgroundColor:
                                    state.selectedUser?.uuid === user.uuid ? 'lightgray' : 'white',
                            }}
                        >{[
                            name
                            , email
                            , job
                        ].map((v, i) => (
                            <td
                                key={[v, i].join("|")}
                                style={commonStyles}>{v}</td>
                        ))}
                            {/* 
                            <td style={commonStyles}>{user.name}</td>
                            <td style={commonStyles}>{user.email}</td>
                            <td style={commonStyles}>{user.job}</td> 
                            */}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
