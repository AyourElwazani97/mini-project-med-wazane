import { AddNewProjectForm } from '@/components/Projects/Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Projects } from '@/types';
import { Head } from '@inertiajs/react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes Projects',
        href: '/admin/projects',
    },
];

interface ProjectListProps {
    projects: Projects[];
}
const Index = ({ projects }: ProjectListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Projects" />
            <div className="flex w-full justify-start gap-2 p-2">
                <div>
                    <Input type="text" placeholder="Filtrer par Nom"></Input>
                </div>
                <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
                    <Plus />
                </Button>
                <Button variant="outline" size="icon">
                    <SlidersHorizontal />
                </Button>
            </div>
            <div className="min-h-8/12 w-full"></div>
            <AddNewProjectForm isOpen={isOpen} setIsOpen={setIsOpen} />
        </AppLayout>
    );
};

export default Index;
