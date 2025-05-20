import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes Projects',
        href: '/projects',
    },
];
const Index = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Projects" />
            <div className="flex w-full justify-start gap-2 p-2">
                <div>
                    <Input type="text" placeholder="Filtrer par Nom"></Input>
                </div>
                <Button variant="outline" size="icon">
                    <SlidersHorizontal />
                </Button>
            </div>
            <div className="min-h-8/12 w-full"></div>
        </AppLayout>
    );
};

export default Index;
