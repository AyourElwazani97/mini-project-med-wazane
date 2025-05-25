import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EachProject, Flashes, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface ProjectUser {
    created_at: string;
    updated_at: string;
    id: number;
    project_id: number;
    user_id: number;
    users: User;
}
interface PageProps {
    flash?: Flashes;
    project: EachProject & {
        project_users: ProjectUser[];
    };
    allUsers: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Detail Projets',
        href: '/admin/projects',
    },
];

const Index = () => {
    const { flash, project, allUsers } = usePage().props as PageProps;

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

    const handleAddUser = (userId: number) => {
        router.put(
            route('assign.users.project.admin', project.id),
            {
                user_id: userId,
            },
            {
                onError: (errors) => {
                    toast.error('Erreur');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Détail Projets" />
            <div className="rounded-lg p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">{project.name}</h2>
                <p className="mb-4">{project.desc_prj}</p>

                <div className="mb-8">
                    <h3 className="mb-2 text-lg font-medium">Membres du projet</h3>
                    {project.project_users.length === 0 ? (
                        <p className="text-muted">Aucun membre pour le moment</p>
                    ) : (
                        <div className="space-y-2">
                            {project.project_users.map(({ users }) => (
                                <div key={users.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <span>{users.name}</span>
                                    <Button variant={'destructive'} size={'icon'} onClick={() => handleAddUser(users.id)}>
                                        <Trash2 />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="mb-2 text-lg font-medium">Ajouter de nouveaux membres</h3>
                    {allUsers.length === 0 ? (
                        <p className="text-muted">Aucun utilisateur disponible à ajouter</p>
                    ) : (
                        <div className="space-y-2">
                            {allUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <span>Utilisateur : {user.name}</span>
                                    <Button size={'icon'} onClick={() => handleAddUser(user.id)}>
                                        <Plus />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
