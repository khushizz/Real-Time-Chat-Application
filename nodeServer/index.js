const { Server } = require("socket.io");

const io = new Server(8000, {                     //Cross-Origin Requests: Your frontend and backend are seen as different origins by the browser. CORS allows safe communication between them.
    cors: {
        origin: "http://127.0.0.1:5500", // Allow requests from this origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

//Node server which will handle socketIo connections


const users = {};

io.on('connection', socket =>{      //sbko listen karega
    socket.on('new-user-joined', name =>{     // particular connection ko listen karega
        console.log("New user", name)
        
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);       //sbko bta dega ki user join hogayah with name
        
    });

    socket.on('send', message => {      //kisi ne msg bheja toh sbko msg recieve krwa do
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})

    });

    socket.on('disconnect', message => {      //koi chor k chala jaye toh disconnect event fire krwa do
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
});

})