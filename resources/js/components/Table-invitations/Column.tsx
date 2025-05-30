import { DeleteTaskDialog } from '@/components/Table-tasks/Index';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Task } from '@/types/task';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';

export const inviationColumns = [
    {
        accessorKey: 'nom_ref',
        header: "Nom de L'inviation",
    },
    {
        accessorKey: 'date_expiration',
        header: "Date D'éxpiration",
        cell: ({ row }) => {
            const date = row.getValue('date_expiration') as string;
            return format(date, 'dd-MM-yyyy');
        },
    },
    {
        accessorKey: 'isExpired',
        header: 'Status',
        cell: ({ row }) => {
            const isExpired = row.getValue('isExpired') as boolean;
            return isExpired ? <Badge variant={'destructive'}>Expiré</Badge> : <Badge variant={'default'}>Valid</Badge>;
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
