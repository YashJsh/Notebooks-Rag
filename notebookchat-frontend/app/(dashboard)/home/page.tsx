"use client"

import {
  Plus,
  MoreVertical,
  FileText,
  Clock,
  Loader2Icon,
} from 'lucide-react';
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateNotebook, useDeleteNotebook, useGetNotebooks } from '@/hooks/useNotebookMutation';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { formatTime } from '@/utils/time-format';
import { useRouter } from 'next/navigation'; // 1. Import Router

export default function Dashboard() {
  const [notebookTitle, setNotebookTitle] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const router = useRouter(); // 2. Initialize Router
  const { mutate: deleteNotebook } = useDeleteNotebook();

  const { data, isPending } = useGetNotebooks();
  const { mutate: createNotebook, isPending: isCreating } = useCreateNotebook();
  

  const handleCreate = () => {
    if (!notebookTitle.trim()) return;

    createNotebook({ name: notebookTitle }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNotebookTitle("");
        toast(`Notebook Created Successfully`);
      }
    });
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Your Notebooks</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {/* 1. Create New Notebook Card */}
          <button onClick={() => {
            setIsCreateOpen(true)
          }}
            className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-6 hover:border-primary hover:bg-muted/20 transition-all duration-200 h-[220px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">New Notebook</h3>
              <p className="text-sm text-muted-foreground">Start from scratch or upload</p>
            </div>
          </button>

          {/* 2. Existing Notebook Cards */}
          {data?.map((notebook) => (
            <Card
              key={notebook.id}
              // 3. Add onClick handler and cursor-pointer
              onClick={() => router.push(`/home/${notebook.id}`)}
              className="group relative flex flex-col justify-between overflow-hidden transition-all hover:shadow-md hover:border-primary/50 h-[220px] cursor-pointer"
            >

              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-chart-1" />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* 4. Stop Propagation prevents the card click from firing when opening menu */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    {/* Stop Propagation on content just to be safe */}
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      {/* <DropdownMenuItem onClick={() => console.log("Rename clicked")}>
                        Rename
                      </DropdownMenuItem> */}
                      <DropdownMenuItem onClick={() => deleteNotebook(notebook.id)} className="text-destructive focus:text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardTitle className="line-clamp-2 text-lg leading-tight">
                  {notebook.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-0 flex-1">
                {/* Spacer or extra details */}
              </CardContent>

              <CardFooter className="p-5 pt-0 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 mt-auto h-12">
                <span className="flex items-center gap-1">
                  {notebook.resources} Source
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(notebook.createdAt)}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Notebook</DialogTitle>
              <DialogDescription>
                Give your new notebook a name to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Advanced Calculus Notes"
                  value={notebookTitle}
                  onChange={(e) => setNotebookTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!notebookTitle || isCreating}>
                {isCreating ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Notebook"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}