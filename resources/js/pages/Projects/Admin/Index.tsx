import { AddNewProjectForm, ProjectGrid } from '@/components/Projects/Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Flashes, Projects, Users } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes Projets',
        href: '/admin/projects',
    },
];

interface ProjectListProps {
    projects: Projects[];
}
const Index = ({ projects }: ProjectListProps) => {
    const [isOpen, setIsOpen] = useState(false);
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
            <Head title="Mes Projets" />
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
            <div className="min-h-8/12 w-full p-2">
                <ProjectGrid projects={projects} />
            </div>
            <AddNewProjectForm isOpen={isOpen} setIsOpen={setIsOpen} />
        </AppLayout>
    );
};

export default Index;
