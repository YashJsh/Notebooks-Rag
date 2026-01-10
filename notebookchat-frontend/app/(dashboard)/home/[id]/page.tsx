"use client"

import { Chat } from '@/components/chat';
import { Navbar } from '@/components/Navbar';
import { Upload } from '@/components/Upload';
import { useSpecificNotebook } from '@/hooks/useNotebookMutation';
import { Loader2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { MobileUploadModal } from '@/components/MobileUploadModal';
import { MobileUploadFab } from '@/components/MobileUploadFab';

const Notebook = () => {
    const {id} = useParams();
    const { data, isPending} = useSpecificNotebook(id as string);
    const [isMobileUploadOpen, setIsMobileUploadOpen] = useState(false);

    if (isPending) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2Icon className="h-6 w-6 animate-spin" />
        </div>
      );
    };

    return (
      <div className="flex flex-col h-screen overflow-hidden relative">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <Upload />
          <Chat notebookName={data?.notebook?.name!} totalSources={data?.resources!} />
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-1 overflow-hidden">
          <Chat notebookName={data?.notebook?.name!} totalSources={data?.resources!} />
        </div>
        
        
        <MobileUploadFab 
          onClick={() => setIsMobileUploadOpen(true)}
          className="md:hidden"
        />
        {/* Mobile Upload FAB */}
       
        {/* Mobile Upload Modal */}
        <MobileUploadModal
          isOpen={isMobileUploadOpen}
          onClose={() => setIsMobileUploadOpen(false)}
          notebookId={id as string}
        />
      </div>
    );
}

export default Notebook