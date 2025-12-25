import { Chat } from "@/components/chat";
import { Navbar } from "@/components/Navbar";
import { Upload } from "@/components/Upload";

export default function Page() {
  return <div className="flex flex-col h-screen overflow-hidden">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Upload/>
      <Chat/>
    </div>
  </div>;
}