import { Chat } from '@/components/chat';
import { Navbar } from '@/components/Navbar';
import { Upload } from '@/components/Upload';

const Notebook = () => {
    return <div className="flex flex-col h-screen overflow-hidden">
    <div className="flex flex-1 overflow-hidden">
      <Upload/>
      <Chat/>
    </div>
  </div>;
}

export default Notebook