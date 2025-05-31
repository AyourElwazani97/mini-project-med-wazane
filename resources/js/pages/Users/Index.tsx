import { taskColumns } from '@/Components/Table-users/Column';
import { DataTable } from '@/Components/Table-users/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Flashes } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Liste Utilisateurs',
        href: '/utilisateurs',
    },
];

interface Users {
    id: number;
    name: string;
    type_user: string;
    email: string;
    created_at: Date | string;
    updated_at: Date | string;
}

interface UsersListProps {
    users: Users[];
}

const Index = ({ users }: UsersListProps) => {
    const { flash } = usePage().props as { flash?: Flashes };
    React.useEffect(() => {
        if (flash) {
            if (flash.success) {
                toast.success(flash.success);
                router.reload({
                    only: ['flash'],
                });
            }
            if (flash.error) {
                toast.error(flash.error);
                router.reload({
                    only: ['flash'],
                });
            }
        }
    }, [flash]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Liste Utilisateurs" />
            <DataTable data={users} columns={taskColumns} />
        </AppLayout>
    );
};

export default Index;
