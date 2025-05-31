import { DeleteTaskDialog } from '@/components/Table-users/Index';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Users {
    id: number;
    name: string;
    type_user: string;
    email: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export const usersColumns = [
    {
        accessorKey: 'name',
        header: 'Nom',
    },
    {
        accessorKey: 'email',
        header: 'Adresse Mail',
    },
    {
        accessorKey: 'type_user',
        header: 'Type',
        cell: ({ row }) => {
            const typeUser = row.getValue('type_user') as string;
            return (
                <span
                    className={`rounded-full px-2 py-1 text-xs ${typeUser === 'admin' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                    {typeUser === 'admin' ? 'Admin' : 'Utilisateur'}
                </span>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Crée Le',
        cell: ({ row }) => {
            const date = row.getValue('created_at') as string;
            const formatedDate = format(date, 'dd-MM-yyyy');
            return formatedDate;
        },
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original as Users;
            const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
            const { delete: destroy, processing } = useForm();

            const handleDelete = () => {
                destroy(route('utilisateurs.destroy', user.id)),
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
                        user={user}
                    />
                </>
            );
        },
    },
];
