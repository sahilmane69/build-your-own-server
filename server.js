const net = require('net');
let clients = [];
const server = net.createServer((socket) => {
    socket.username = "Anonymous";
    clients.push(socket);
    socket.write('Welcome\n');
    socket.on('data', (data) => {
        const msg = data.toString().trim();
        const parts = msg.split(':');
        const type = parts[0];
        const value = parts.slice(1).join(':');
        if (type === 'NAME') {
            if (!value) return socket.write('Usage: NAME:yourname\n');
            socket.username = value;
            return socket.write(`Name set to ${value}\n`);
        }
        if (type === 'MESSAGE') {
            if (!value) return socket.write('Usage: MESSAGE:yourmessage\n');
            clients.forEach((client) => {
                if (client !== socket) {
                    client.write(`${socket.username}: ${value}\n`);
                }
            });
            return;
        }
        if (type === 'MSG') {
            const targetUser = parts[1];
            const privateMessage = parts.slice(2).join(':');
            if (!targetUser || !privateMessage) {
                return socket.write('Usage: MSG:user:message\n');
            }
            let found = false;
            clients.forEach((client) => {
                if (client.username === targetUser) {
                    client.write(`(Private) ${socket.username}: ${privateMessage}\n`);
                    found = true;
                }
            });
            if (!found) {
                socket.write(`User ${targetUser} not found\n`);
            } else {
                socket.write(`(You -> ${targetUser}): ${privateMessage}\n`);
            }
            return;
        }
        socket.write('Invalid\n');
    });
    socket.on('end', () => {
        clients = clients.filter(c => c !== socket);
    });
});
server.listen(3000, () => {
    console.log('Server running on 3000');
});