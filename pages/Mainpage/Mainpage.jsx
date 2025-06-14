import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Chatlist from "./Chatsection/Chatlist";
import Chatbox from "./Chatsection/Chatbox";
import "../../src/Css/Mainpage/Mainchat/Mainchat.css";

function Mainpage() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(() => localStorage.getItem('currentroom') || "Dev Circle");
  const [userId, setUserId] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);

    // Always set room from localStorage or default
    const storedRoom = localStorage.getItem('currentroom');
    if (storedRoom) setRoom(storedRoom);
    else setRoom("Dev Circle");

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save room to localStorage whenever it changes
  useEffect(() => {
    if (room) localStorage.setItem('currentroom', room);
  }, [room]);

  return (
    <div className="Main-content">
      <Sidebar />
      {/* ... */}
      <Chatlist
        username={username}
        setUsername={setUsername}
        room={room}
        setRoom={setRoom}
        userId={userId}
        setUserId={setUserId}
        openChat={openChat}
        setOpenChat={setOpenChat}
      />
      <Chatbox
        username={username}
        room={room}
        userId={userId}
        openChat={openChat}
        setOpenChat={setOpenChat}
      />
    </div>
  );
}
export default Mainpage;