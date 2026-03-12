import { Server } from "socket.io";

let id = 1;
let connectedUsersCount = 0;

export const createSocket = (httpServer) => {
    const io = new Server(httpServer, {
        // ניתן להוסיף הגדרות נוספות על השרת
        // cors: { origin: '*', methods: ['GET', 'POST'] }
    });

    // כשלקוח מתחבר לשרת
    // socket - נתוני הלקוח שהתחבר כרגע
    io.on('connection', (socket) => {
        connectedUsersCount++;
        // גם לכולם וגם ללקוח שהתחבר עכשיו (כדי שלא יפספס את האירוע)
        socket.emit('update users count', connectedUsersCount);
        io.emit('update users count', connectedUsersCount);

        // ניתן להוסיף נתונים על היוזר הנוכחי בצורה כזו לסוקט
        socket.userId = id++;
        console.log(`user ${socket.userId} connected successfully`);

        // שליחת אירוע לקליינט הנוכחי שהתחבר
        // בשם שאנחנו בחרנו
        // הקליינט יקבל את המידע רק אם הוא רשום לאירוע
        socket.emit('user connected', { userId: socket.userId });

        // עדכון פרטי הלקוח (שם + צבע) ושמירתם על ה-socket
        socket.on('update_user_details', ({ name, color }) => {
            socket.userName = name || 'unknown';
            socket.color = color || '#000000';
        });

        socket.on('new message', (message) => {
            // שליחת הודעה לכולם עם הפרטים השמורים מהסוקט
            io.emit('send message', {
                by: socket.userName || 'unknown',
                color: socket.color || '#000000',
                msg: message
            });
        });

        socket.on('disconnect', () => {
            connectedUsersCount--;
            io.emit('update users count', connectedUsersCount);

            const leavingUser = socket.userName || 'unknown';
            socket.broadcast.emit('user left', {
                userName: leavingUser,
                color: socket.color || '#000000'
            });
            console.log(`${leavingUser} disconnected`);
        });
    });
};