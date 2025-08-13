import Sidebar from "../components/Sidebar";
import ChatInterface from "../components/ChatInterface";

export default function Home() {
  return (
    <div className="flex min-h-screen overscroll-none">
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
}
