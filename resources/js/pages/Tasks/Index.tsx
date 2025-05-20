import { taskColumns } from '@/Components/Table-tasks/Column';
import { DataTable } from '@/Components/Table-tasks/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Flashes, Tasks } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes Tâches',
        href: '/tasks',
    },
];

interface TaskListProps {
    tasks: Tasks[];
}

const Index = ({ tasks }: TaskListProps) => {
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
            <Head title="Mes Tâches" />
            <DataTable data={tasks} columns={taskColumns} />
        </AppLayout>
    );
};

export default Index;
