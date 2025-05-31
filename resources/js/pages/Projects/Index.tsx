import { ProjectGridEachUser } from '@/components/Projects/Index';
import { taskColumns } from '@/components/Table-projetcs-tasks-users/Column';
import { DataTable } from '@/components/Table-projetcs-tasks-users/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Flashes, UserProjectAssignment } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes Projects',
        href: '/projects',
    },
];
interface Tasks {
    id: number;
    description: string;
    status: string;
    due_date: Date | string;
}
interface ProjectGridEachUserProps {
    assignments?: UserProjectAssignment[];
    tasks?: Tasks[];
}

const Index = ({ assignments, tasks }: ProjectGridEachUserProps) => {
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
            <Head title="Mes Projects" />
            <div className="h-full w-full p-2">
                <ProjectGridEachUser assignments={assignments} />
            </div>
            <div className="border-t-2 border-dashed"></div>
            <DataTable columns={taskColumns} data={tasks} />
        </AppLayout>
    );
};

export default Index;
