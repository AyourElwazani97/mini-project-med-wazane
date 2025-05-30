import { inviationColumns } from '@/Components/Table-invitations/Column';
import { DataTable } from '@/Components/Table-invitations/data-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Flashes, Inviations } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes Invitations',
        href: '/invitations',
    },
];

interface InviationListProps {

    invitations:Inviations[]
}

const Index = ({ invitations }: InviationListProps) => {
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
    console.log(invitations)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Tâches" />
            <DataTable data={invitations} columns={inviationColumns} />
        </AppLayout>
    );
};

export default Index;
