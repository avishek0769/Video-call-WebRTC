import { createContext, useMemo } from "react";
import { io } from "socket.io-client"

export const SocketContext = createContext(null)

function SocketProvider({children}) {
    const socket = useMemo(() => io("https://xbsmsrft-3000.inc1.devtunnels.ms"), [])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
