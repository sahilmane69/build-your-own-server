const net = require('net');

let clients = [];

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.username = "Anonymous"; // 👈 default name
    clients.push(socket);

    socket.write('Welcome to Sahil Chat Server\n');
    socket.write('Set name using: /name yourname\n');

    socket.on('data', (data) => {
        const message = data.toString().trim();

        // 👇 COMMAND: set name
        if (message.startsWith('/name')) {
            const parts = message.split(' ');
            const newName = parts[1];

            if (newName) {
                socket.username = newName;
                socket.write(`Name set to ${newName}\n`);
            } else {
                socket.write('Usage: /name yourname\n');
            }
            return;
        }

        console.log(`${socket.username}:`, message);

        // 👇 broadcast
        clients.forEach((client) => {
            if (client !== socket) {
                client.write(`${socket.username}: ${message}\n`);
            }
        });
    });

    socket.on('end', () => {
        clients = clients.filter(c => c !== socket);
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Chat server running on port 3000');
});