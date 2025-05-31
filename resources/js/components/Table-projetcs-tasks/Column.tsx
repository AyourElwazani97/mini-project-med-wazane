import { DeleteTaskDialog } from '@/components/Table-projetcs-tasks/Index';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Auth, User } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface projectTasks {
    id: number;
    description: string;
    status: string;
    due_date: Date | string;
    user: User;
}

export const taskColumns = [
    {
        accessorKey: 'id',
        header: 'N° Tâche',
        cell: ({ row }) => {
            const id = row.getValue('id') as string;
            return <span>#{id}</span>;
        },
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
            return date ? format(date, 'dd-MM-yyyy') : 'Non définie';
        },
    },
    {
        accessorKey: 'user',
        header: 'Utilisateur',
        cell: ({ row }) => {
            const user = row.getValue('user');
            return user.name;
        },
    },
    {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;

            // Map status to display text and colors
            const statusConfig = {
                en_attente: {
                    text: 'En attente',
                    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                },
                en_cours: {
                    text: 'En cours',
                    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                },
                terminé: {
                    text: 'Terminé',
                    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                },
            };

            const currentStatus = statusConfig[status as keyof typeof statusConfig] || {
                text: status,
                color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            };

            return (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${currentStatus.color}`}>
                    {currentStatus.text}
                </span>
            );
        },
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
            const task = row.original as projectTasks;
            const auth = usePage().props.auth as Auth;
            const isAdmin = auth.user.type_user === 'admin';
            const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
            const { delete: destroy, processing } = useForm();

            const handleDelete = () => {
                destroy(route('projecttasks.destroy', task.id), {
                    onSuccess: () => {
                        setIsDeleteModalOpen(false);
                    },
                    preserveScroll: true,
                    preserveState: true,
                });
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
                            {isAdmin && (
                                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => setIsDeleteModalOpen(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DeleteTaskDialog
                        handleDelete={handleDelete}
                        isOpen={isDeleteModalOpen}
                        processing={processing}
                        setIsOpen={setIsDeleteModalOpen}
                    />
                </>
            );
        },
    },
];
