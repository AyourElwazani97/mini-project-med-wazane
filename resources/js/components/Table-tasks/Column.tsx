import { DeleteTaskDialog } from '@/components/Table-tasks/Index';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Task } from '@/types/task';
import { useForm } from '@inertiajs/react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export const taskColumns = [
    {
        accessorKey: 'nom_task',
        header: 'Nom de la tâche',
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            return <div className="max-w-[200px] truncate">{description || 'Aucune description'}</div>;
        },
    },
    {
        accessorKey: 'due_date',
        header: 'Échéance',
        cell: ({ row }) => {
            const date = row.getValue('due_date') as string;
            return date ? new Date(date).toLocaleDateString() : 'Non définie';
        },
    },
    {
        accessorKey: 'is_completed',
        header: 'Statut',
        cell: ({ row }) => {
            const isCompleted = row.getValue('is_completed') as boolean;
            return (
                <span className={`rounded-full px-2 py-1 text-xs ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {isCompleted ? 'Terminée' : 'En cours'}
                </span>
            );
        },
    },
    {
        accessorKey: 'is_important',
        header: 'Important',
        cell: ({ row }) => {
            const isImportant = row.getValue('is_important') as boolean;
            return (
                <span className={`rounded-full px-2 py-1 text-xs ${isImportant ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {isImportant ? 'Important' : 'Standard'}
                </span>
            );
        },
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
            const task = row.original as Task;
            const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
            const { delete: destroy, processing } = useForm();

            const handleDelete = () => {
                destroy(route('tasks.destroy', task.id)),
                    {
                        onSuccess: () => {
                            setIsDeleteModalOpen(false);
                        },
                    };
            };

            return (
                <>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => (window.location.href = route('tasks.edit', task.id))}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => setIsDeleteModalOpen(true)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DeleteTaskDialog
                        handleDelete={handleDelete}
                        isOpen={isDeleteModalOpen}
                        processing={processing}
                        setIsOpen={setIsDeleteModalOpen}
                        task={task}
                    />
                </>
            );
        },
    },
];
