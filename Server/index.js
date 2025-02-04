import { Server } from "socket.io"

const io = new Server(3001, {
    cors: true
})

io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on("join-user", (({ roomId }) => {
        io.to(roomId).emit("user-joined", { socketId: socket.id })
        socket.join(roomId)
    }))

    socket.on("user-joined-confirm:server", ({ user2Id, socketId }) => {
        setTimeout(() => {
            io.to(user2Id).emit("user-joined-confirm:client", socketId)
        }, 1000);
    })

    socket.on("streamData1:server", ({ streamData, sendTo, isLastChunk }) => {
        io.to(sendTo).emit("streamData1:client", { streamData, isLastChunk })
    })

    socket.on("call-user", ({ to, offer }) => {
        console.log(`User --> ${socket.id} is trying to call ${to}`)
        io.to(to).emit("incoming-call", { from: socket.id, offer })
    })

    socket.on("call-accepted", ({ to, answer }) => {
        console.log(`Call is accepted by ${socket.id}`)
        io.to(to).emit("call-accepted-confirm", { from: socket.id, answer })
    })

    socket.on("peer-nego-needed", ({ to, offer }) => {
        console.log("peer-nego-needed", offer.type);
        io.to(to).emit("peer-nego-incoming", { from: socket.id, offer });
    });

    socket.on("peer-nego-done", ({ to, ans }) => {
        console.log("peer-nego-done", ans.type);
        io.to(to).emit("peer-nego-final", { from: socket.id, ans });
    });
    
    socket.on("connection-success", (to)=>{
        io.to(to).emit("connection-success");
    })
})