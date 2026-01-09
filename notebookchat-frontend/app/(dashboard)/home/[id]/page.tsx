"use client"

import { Chat } from '@/components/chat';
import { Navbar } from '@/components/Navbar';
import { Upload } from '@/components/Upload';
import { useSpecificNotebook } from '@/hooks/useNotebookMutation';
import { Loader2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';

const Notebook = () => {
    const {id} = useParams();
    const { data, isPending} = useSpecificNotebook(id as string);

    if (isPending) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2Icon className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    return <div className="flex flex-col h-screen overflow-hidden">
    <div className="flex flex-1 overflow-hidden">
      <Upload/>
      <Chat notebookName={data?.name!} totalSources={10}/>
    </div>
  </div>;
}

export default Notebook