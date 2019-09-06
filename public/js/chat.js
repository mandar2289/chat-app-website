const socket = io()

//Elements 
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $locationButton = document.querySelector('#shareLocation')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })
const autoscroll = () => {
        // New message element
        const $newMessage = $messages.lastElementChild

        // Height of the new message
        const newMessageStyles = getComputedStyle($newMessage)
        const newMessageMargin = parseInt(newMessageStyles.marginBottom)
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

        // Visible height
        const visibleHeight = $messages.offsetHeight

        // Height of messages container
        const containerHeight = $messages.scrollHeight

        // How far have I scrolled?
        const scrollOffset = $messages.scrollTop + visibleHeight

        if (containerHeight - newMessageHeight <= scrollOffset) {
            	$messages.scrollTop = $messages.scrollHeight
        }
    
}
socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
// server (emit) -> client (receive) --acknowledgement --> server
// client (emit) -> server (receive) --acknowledgement --> client
socket.on('locationMessage', (locationMessage) => {
    console.log(locationMessage)
    const html = Mustache.render(locationMessageTemplate, {
        username: locationMessage.username,
        url: locationMessage.url,
        createdAt: moment(locationMessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })
    console.log(users)
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // disable 
    $messageFormButton.setAttribute('disabled', 'disabled')
    // const inputText = document.querySelector('input').value
    const inputText = e.target.elements.message.value
    socket.emit('inputAdded', inputText, (error) => {
        // enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
           return console.log(error)
        }
        console.log('message delivered')
    })   
})
document.querySelector('#shareLocation').addEventListener('click', () => {
    
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
       //console.log(position.coords.latitude)
            socket.emit('sendLocation', {
            longitude: position.coords.longitude, 
            latitude: position.coords.latitude
        }, (error) => {
            if (error) {
                return console.log('Error while sharing a location')
            }
            console.log('Location shared!')
            $locationButton.removeAttribute('disabled')
        })
        
    })
})

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})