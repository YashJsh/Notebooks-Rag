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
      <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Upload (desktop only) */}
        <aside className="hidden md:flex max-w-1/4 flex-shrink-0 border-r border-border">
        <Upload />
        </aside>
    
        {/* Chat takes remaining space */}
        <main className="flex-1 min-w-0">
          <Chat
            notebookName={data?.notebook?.name!}
            totalSources={data?.resources!}
            notebookId = {id as string}
          />
        </main>
    
        {/* Mobile Upload FAB */}
        <MobileUploadFab
          onClick={() => setIsMobileUploadOpen(true)}
          className="md:hidden"
        />
    
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