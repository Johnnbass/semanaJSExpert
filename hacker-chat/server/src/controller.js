export default class Controller {
    #users = new Map();
    #rooms = new Map();

    constructor({ socketServer }) {
        this.socketServer = socketServer;
    }

    onNewConnection(socket) {
        const { id } = socket;
        console.log('conection stablish with', id);
        const userData = { id, socket };
        this.#updateGlobalUserData(id, userData);

        socket.on('data', this.#onSocketData(id));
        socket.on('error', this.#onSocketClosed(id));
        socket.on('end', this.#onSocketClosed(id));
    }

    async joinRoom(socketId, data) {
        const userData = JSON.parse(data);
        console.log(`${userData.userName} joined!`[socketId]);
        const { roomId } = userData;
        const users  = this.#joinUserOnRoom(roomId, users);

        const user = this.#updateGlobalUserData(socketId, userData);
    }

    #joinUserOnRoom(roomId, user) {
        const usersOnRoom = this.#rooms.get(roomId) ?? new Map();
        usersOnRoom.set(user.id, user);
        this.#rooms.set(roomId, usersOnRoom);

        return usersOnRoom;
    }

    #onSocketClosed(id) {
        return data => {
            console.log('onSocketClosed', data.toString());
        }
    }

    #onSocketData(id) {
        return data => {
            console.log('onSocketData', data.toString());
        }
    }

    #updateGlobalUserData(socketId, userData) {
        const users = this.#users;
        const user = users.get(socketId) ?? {};

        const updatedUserData = {
            ...user,
            ...userData
        }

        users.set(socketId, updatedUserData);

        return users.get(socketId);
    }
}