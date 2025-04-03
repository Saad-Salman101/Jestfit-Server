class WebSockets {
  constructor() {
    this.rooms = {}; // { roomId: { createdAt, clients: [{ userId, clientIds: [] }] } }
  }

  connection(client) {
    console.log("New client connected:", client.id);

    const createRoomIfNotExists = (roomId) => {
      if (!this.rooms[roomId]) {
        this.rooms[roomId] = {
          id: roomId,
          createdAt: Date.now(),
          clients: [],
        };
        console.log(`Room ${roomId} created`);
      }
    };

    const addClientToRoom = (roomId, userId, clientId) => {
      if (this.rooms[roomId]) {
        const userInRoom = this.rooms[roomId].clients.find(
          (client) => client.userId === userId
        );

        if (userInRoom) {
          if (!userInRoom.clientIds.includes(clientId)) {
            userInRoom.clientIds.push(clientId);
            console.log(`Client ${clientId} added to room ${roomId} for user ${userId}`);
          }
        } else {
          this.rooms[roomId].clients.push({ userId, clientIds: [clientId] });
          console.log(`User ${userId} with client ${clientId} added to room ${roomId}`);
        }

        // Emit updated user count
        this.emitUserCount(roomId);
      }
    };

    const getClientsInRoom = (roomId) => {
      return this.rooms[roomId] ? this.rooms[roomId].clients : [];
    };

    const removeClientFromRoom = (roomId, clientId) => {
      if (this.rooms[roomId]) {
        this.rooms[roomId].clients = this.rooms[roomId].clients
          .map((client) => {
            client.clientIds = client.clientIds.filter((id) => id !== clientId);
            return client;
          })
          .filter((client) => client.clientIds.length > 0);

        console.log(`Client ${clientId} removed from room ${roomId}`);

        if (this.rooms[roomId].clients.length === 0) {
          delete this.rooms[roomId];
          console.log(`Room ${roomId} deleted as it's empty.`);
        } else {
          this.emitUserCount(roomId); // Emit updated user count
        }
      }
    };

    // Emit the number of users in a room
    this.emitUserCount = (roomId) => {
      const userCount = this.rooms[roomId] ? this.rooms[roomId].clients.length : 0;
      console.log(roomId, "<=== room id");
      client.to(roomId).emit("userCount", userCount);
    };

    client.on("joinRoom", ({ roomID, userID }) => {
      console.log(`Client ${client.id} joining room ${roomID} with userId ${userID}`);
      createRoomIfNotExists(roomID);
      client.join(roomID);
      addClientToRoom(roomID, userID, client.id);

      const clients = getClientsInRoom(roomID);
      console.log(`Clients in room ${roomID}:`, JSON.stringify(clients, null, 2));

      client.to(roomID).emit("userJoined", { userID, clients });
    });

    client.on("getRoomData", (roomId) => {
      if (this.rooms[roomId]) {
        console.log(this.rooms[roomId], "<=== my nigga");
        client.emit("roomData", this.rooms[roomId]);
        client.to(roomId).emit("roomData", { rooms: this.rooms[roomId] });
      } else {
        client.emit("roomData", { error: "Room does not exist." });
      }
    });

    client.on("leaveRoom", () => {
      for (let roomId in this.rooms) {
        removeClientFromRoom(roomId, client.id);
      }
    });

    client.on("disconnect", () => {
      console.log(`Client ${client.id} disconnected.`);
      for (let roomId in this.rooms) {
        removeClientFromRoom(roomId, client.id);
      }
    });
  }
}

module.exports = WebSockets;
