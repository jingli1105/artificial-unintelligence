import { Clock, Folder, Plus } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-16 bg-slate-800/40 min-h-screen p-6 border-r border-slate-800/40">
      
      <nav>
        <ul className="space-y-10 flex flex-col items-center">
          <li>
            <Plus className="h-4 w-4 text-slate-300"/>
          
          </li>
          <li>
          <Folder className="h-4 w-4 text-slate-300"/>
          </li>
          <li>
          <Clock className="h-4 w-4 text-slate-300"/>
          </li>
         
        </ul>
      </nav>
    </aside>
  );
}