import { Badge } from '@/components/ui/badge';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Projects } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, CheckSquare, Clock, FolderOpen, User, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de Bord',
        href: '/dashboard',
    },
];

interface DashboardProps {
    total_users: number;
    total_projects: number;
    total_tasks: number;
    projects: Projects[];
}

export default function Dashboard({ total_users, total_projects, total_tasks, projects }: DashboardProps) {
    const stats = [
        {
            title: 'Utilisateurs',
            value: total_users,
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-950/50',
            borderColor: 'border-blue-200 dark:border-blue-800',
        },
        {
            title: 'Projets',
            value: total_projects,
            icon: FolderOpen,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
            borderColor: 'border-emerald-200 dark:border-emerald-800',
        },
        {
            title: 'Tâches',
            value: total_tasks,
            icon: CheckSquare,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-950/50',
            borderColor: 'border-purple-200 dark:border-purple-800',
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'terminé':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'en cours':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'en attente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'annulé':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de Bord" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`relative h-20 w-full overflow-hidden rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-lg ${stat.bgColor} ${stat.borderColor}`}
                        >
                            <div className="relative z-10 flex h-full items-center justify-between p-4">
                                <div className="flex flex-col justify-center">
                                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                                    <p className="text-foreground text-2xl font-bold">{stat.value.toLocaleString()}</p>
                                </div>
                                <div className={`rounded-full p-2 ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/10" />
                        </div>
                    ))}
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background relative flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="flex h-full flex-col">
                        {/* Header */}
                        <div className="border-border bg-muted/50 border-b px-6 py-4">
                            <div className="flex items-center gap-2">
                                <FolderOpen className="text-muted-foreground h-5 w-5" />
                                <h2 className="text-foreground text-lg font-semibold">Projets Récents</h2>
                                <span className="text-muted-foreground ml-auto text-sm">
                                    {projects.length} projet{projects.length > 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-auto">
                            {projects.length === 0 ? (
                                <div className="flex h-full items-center justify-center">
                                    <div className="text-center">
                                        <FolderOpen className="text-muted-foreground/50 mx-auto h-12 w-12" />
                                        <h3 className="text-foreground mt-4 text-lg font-medium">Aucun projet</h3>
                                        <p className="text-muted-foreground mt-2 text-sm">Commencez par créer votre premier projet.</p>
                                    </div>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-muted/30 sticky top-0 backdrop-blur-sm">
                                        <TableRow className="border-border border-b hover:bg-transparent">
                                            <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                Projet
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                Statut
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                Échéance
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                Temps restant
                                            </TableHead>
                                            <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                                Créé le
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-border divide-y">
                                        {projects.map((project) => (
                                            <TableRow key={project.id} className="group hover:bg-muted/50 transition-colors duration-150">
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="text-foreground group-hover:text-primary font-medium transition-colors">
                                                            {project.name}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <Badge variant={'outline'} className={`${getStatusBadge(project.status)} border font-medium`}>
                                                        {project.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-foreground flex items-center gap-2 text-sm">
                                                        <Calendar className="text-muted-foreground h-4 w-4" />
                                                        {formatDate(project.due_date)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    {project.time_left ? (
                                                        <div className="text-foreground flex items-center gap-2 text-sm">
                                                            <Clock className="text-muted-foreground h-4 w-4" />
                                                            {project.time_left}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                        <User className="h-4 w-4" />
                                                        {format(project.created_at, 'dd-MM-yyyy HH:mm:ss')}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
