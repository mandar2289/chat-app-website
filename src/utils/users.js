const users = []

// addUser, removeUser

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }
    // Check for existing user
    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })
    
    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }
    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id)=> {
    const user = users.find((user) => user.id === id)
    return user  
}

const getUsersInRoom = (room) => {
    //const usersInRoom = users.find((user) => user.room === room)
    const usersInRoom = []
    users.forEach((user) => {
        if (user.room === room.trim().toLowerCase()) {
            usersInRoom.push(user)
        }
    })
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

