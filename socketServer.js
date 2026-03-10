import { Server } from "socket.io";

let id = 1;


export const createSocket = (httpServer) => {
    const io = new Server(httpServer, {
        // ניתן להוסיף הגדרות נוספות על השרת
        // cors: { origin: '*', methods: ['GET', 'POST'] }
    });

    // כשלקוח מתחבר לשרת
    // socket - נתוני הלקוח שהתחבר כרגע
    io.on('connection', (socket) => {
        console.log('user connected successfully');

        // שליחת אירוע לקליינט הנוכחי שהתחבר
        // בשם שאנחנו בחרנו
        // הקליינט יקבל את המידע רק אם הוא רשום לאירוע
        socket.emit('user connected', { userId: id++ });
    });
};