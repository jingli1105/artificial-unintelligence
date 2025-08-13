import Sidebar from "../components/Sidebar";
import ChatInterface from "../components/ChatInterface";

export default function Home() {
  return (
    <div className="flex min-h-screen overscroll-none">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </div>
      
      {/* Main content - Full width on mobile */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
}
