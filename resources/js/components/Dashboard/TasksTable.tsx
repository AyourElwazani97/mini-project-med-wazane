'use client';

import { Badge } from '@/components/ui/badge';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User } from '@/types';
import { format } from 'date-fns';
import { AlertCircle, Calendar, CheckSquare, Clock, TrendingUp, UserIcon } from 'lucide-react';

interface ProjectTask {
    id: number;
    description: string;
    status: string;
    due_date: Date | string;
    user?: User;
}

interface TasksTableProps {
    tasks: ProjectTask[];
    title?: string;
    showProject?: boolean;
}

export default function TasksTable({ tasks, title = 'Tâches Récentes', showProject = false }: TasksTableProps) {
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'en_attente':
                return 'En attente';
            case 'en_cours':
                return 'En cours';
            case 'terminé':
                return 'Terminé';
            default:
                return status;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'terminé':
                return {
                    className:
                        'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 dark:from-emerald-950/50 dark:to-green-950/50 dark:text-emerald-400 dark:border-emerald-800 shadow-sm',
                    icon: '✓',
                };
            case 'en_cours':
                return {
                    className:
                        'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 dark:from-blue-950/50 dark:to-cyan-950/50 dark:text-blue-400 dark:border-blue-800 shadow-sm',
                    icon: '⚡',
                };
            case 'en_attente':
                return {
                    className:
                        'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 dark:from-amber-950/50 dark:to-yellow-950/50 dark:text-amber-400 dark:border-amber-800 shadow-sm',
                    icon: '⏸',
                };
            default:
                return {
                    className:
                        'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 dark:from-gray-950/50 dark:to-slate-950/50 dark:text-gray-400 dark:border-gray-800 shadow-sm',
                    icon: '○',
                };
        }
    };

    const formatDate = (dateString: string | Date) => {
        return format(new Date(dateString), 'dd-MM-yyyy');
    };

    const isOverdue = (dueDate: string | Date) => {
        return new Date(dueDate) < new Date();
    };

    const getPriorityConfig = (task: ProjectTask) => {
        const overdue = isOverdue(task.due_date) && !['terminé', 'completed'].includes(task.status.toLowerCase());
        const inProgress = ['en_cours', 'in_progress'].includes(task.status.toLowerCase());

        if (overdue) {
            return {
                label: 'Urgente',
                className: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-300 shadow-lg shadow-red-500/25 animate-pulse',
                icon: AlertCircle,
            };
        }
        if (inProgress) {
            return {
                label: 'Normale',
                className: 'bg-gradient-to-r from-orange-400 to-amber-400 text-white border-orange-300 shadow-md shadow-orange-400/25',
                icon: TrendingUp,
            };
        }
        return {
            label: 'Basse',
            className: 'bg-gradient-to-r from-slate-400 to-gray-400 text-white border-slate-300 shadow-sm',
            icon: Clock,
        };
    };

    const completedTasks = tasks.filter((task) => task.status === 'terminé').length;
    const inProgressTasks = tasks.filter((task) => task.status === 'en_cours').length;
    const pendingTasks = tasks.filter((task) => task.status === 'en_attente').length;

    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background relative flex-1 overflow-hidden rounded-xl border shadow-lg md:min-h-min">
            <div className="flex h-full flex-col">
                {/* Enhanced Header */}
                <div className="border-border from-muted/80 via-muted/50 to-muted/80 border-b bg-gradient-to-r px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 border-primary/20 rounded-lg border p-2">
                            <CheckSquare className="text-primary h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-foreground text-lg font-bold tracking-tight">{title}</h2>
                            <div className="mt-1 flex items-center gap-4">
                                <span className="text-muted-foreground text-sm">
                                    {tasks.length} tâche{tasks.length > 1 ? 's' : ''} au total
                                </span>
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-muted-foreground">{completedTasks} terminées</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        <span className="text-muted-foreground">{inProgressTasks} en cours</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                        <span className="text-muted-foreground">{pendingTasks} en attente</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Table */}
                <div className="relative flex-1 overflow-hidden">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                    {tasks.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="p-8 text-center">
                                <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                    <CheckSquare className="text-muted-foreground/50 h-8 w-8" />
                                </div>
                                <h3 className="text-foreground mb-2 text-lg font-semibold">Aucune tâche</h3>
                                <p className="text-muted-foreground max-w-sm text-sm">
                                    Aucune tâche n'a été trouvée pour le moment. Créez votre première tâche pour commencer.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-96 overflow-auto">
                            <Table>
                                <TableHeader className="from-muted/40 via-muted/20 to-muted/40 border-border/50 sticky top-0 border-b bg-gradient-to-r backdrop-blur-md">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-muted-foreground px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase">
                                            Tâche
                                        </TableHead>
                                        <TableHead className="text-muted-foreground px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase">
                                            Statut
                                        </TableHead>
                                        <TableHead className="text-muted-foreground px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase">
                                            Assigné à
                                        </TableHead>
                                        <TableHead className="text-muted-foreground px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase">
                                            Échéance
                                        </TableHead>
                                        <TableHead className="text-muted-foreground px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase">
                                            Priorité
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-border/50 divide-y">
                                    {tasks.map((task, index) => {
                                        const statusConfig = getStatusBadge(task.status);
                                        const priorityConfig = getPriorityConfig(task);
                                        const PriorityIcon = priorityConfig.icon;
                                        const overdue = isOverdue(task.due_date) && !['terminé', 'completed'].includes(task.status.toLowerCase());

                                        return (
                                            <TableRow
                                                key={task.id}
                                                className={`group hover:from-muted/30 transition-all duration-200 hover:bg-gradient-to-r hover:to-transparent ${
                                                    overdue ? 'bg-red-50/30 dark:bg-red-950/10' : ''
                                                }`}
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <TableCell className="px-6 py-5">
                                                    <div className="flex items-center justify-start gap-4">
                                                        <div className="border-muted-foreground/20 from-muted/50 to-muted/30 mt-1 flex h-8 w-8 items-center justify-center rounded-lg border-2 bg-gradient-to-br text-sm font-bold shadow-sm">
                                                            {statusConfig.icon}
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center justify-start gap-2">#{task.id}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-5">
                                                    <Badge variant="outline" className={`${statusConfig.className} border px-3 py-1 font-semibold`}>
                                                        {getStatusDisplay(task.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-5">
                                                    {task.user ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <div className="from-primary/20 to-primary/10 text-primary border-primary/20 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-gradient-to-br text-sm font-bold shadow-sm">
                                                                    {task.user.name?.charAt(0).toUpperCase() || <UserIcon className="h-4 w-4" />}
                                                                </div>
                                                                <div className="border-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 bg-green-500"></div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-foreground text-sm font-semibold">{task.user.name}</span>
                                                                <span className="text-muted-foreground text-xs">{task.user.email}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <div className="from-muted to-muted/50 text-muted-foreground border-muted-foreground/20 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-gradient-to-br">
                                                                <UserIcon className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-muted-foreground text-sm font-medium">Non assigné</span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`rounded-lg p-2 ${overdue ? 'bg-red-100 dark:bg-red-950/50' : 'bg-muted/50'}`}
                                                        >
                                                            <Calendar
                                                                className={`h-4 w-4 ${overdue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span
                                                                className={`text-sm font-medium ${
                                                                    overdue ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                                                                }`}
                                                            >
                                                                {formatDate(task.due_date)}
                                                            </span>
                                                            {overdue && (
                                                                <Badge variant="destructive" className="w-fit animate-pulse text-xs shadow-md">
                                                                    En retard
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-5">
                                                    <Badge
                                                        className={`${priorityConfig.className} flex w-fit items-center gap-1 px-3 py-1 font-semibold`}
                                                    >
                                                        <PriorityIcon className="h-3 w-3" />
                                                        {priorityConfig.label}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
