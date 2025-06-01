import { Badge } from '@/components/ui/badge';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User } from '@/types';
import { format } from 'date-fns';
import { Calendar, CheckSquare, Clock, User as UserIcon } from 'lucide-react';

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

export default function TasksTable({ tasks, title = "Tâches Récentes", showProject = false }: TasksTableProps) {
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
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
            case 'en_cours':
                return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'terminé':
                return '✓';
            case 'en_cours':
                return '⏳';
            case 'en_attente':
                return '⏸';
            default:
                return '○';
        }
    };

    const formatDate = (dateString: string | Date) => {
        return format(new Date(dateString), 'dd-MM-yyyy');
    };

    const formatDateTime = (dateString: string | Date) => {
        return format(new Date(dateString), 'dd-MM-yyyy HH:mm');
    };

    const isOverdue = (dueDate: string | Date) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background relative flex-1 overflow-hidden rounded-xl border md:min-h-min">
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-border bg-muted/50 border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="text-muted-foreground h-5 w-5" />
                        <h2 className="text-foreground text-lg font-semibold">{title}</h2>
                        <span className="text-muted-foreground ml-auto text-sm">
                            {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-hidden">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                    {tasks.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <CheckSquare className="text-muted-foreground/50 mx-auto h-12 w-12" />
                                <h3 className="text-foreground mt-4 text-lg font-medium">Aucune tâche</h3>
                                <p className="text-muted-foreground mt-2 text-sm">Aucune tâche n'a été trouvée pour le moment.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-auto max-h-96">
                            <Table>
                                <TableHeader className="bg-muted/30 sticky top-0 backdrop-blur-sm">
                                    <TableRow className="border-border border-b hover:bg-transparent">
                                        <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                            Tâche
                                        </TableHead>
                                        <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                            Statut
                                        </TableHead>
                                        <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                            Assigné à
                                        </TableHead>
                                        <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                            Échéance
                                        </TableHead>
                                        <TableHead className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                                            Priorité
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-border divide-y">
                                    {tasks.map((task) => (
                                        <TableRow key={task.id} className="group hover:bg-muted/50 transition-colors duration-150">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded border border-muted-foreground/30 bg-muted/30 text-xs font-medium">
                                                        {getStatusIcon(task.status)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="text-muted-foreground text-xs mt-1">
                                                            #{task.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge variant={'outline'} className={`${getStatusBadge(task.status)} border font-medium`}>
                                                    {getStatusDisplay(task.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                {task.user ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                                                            {task.user.name?.charAt(0).toUpperCase() || <UserIcon className="h-4 w-4" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-foreground text-sm font-medium">{task.user.name}</span>
                                                            <span className="text-muted-foreground text-xs">{task.user.email}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full">
                                                            <UserIcon className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-muted-foreground text-sm">Non assigné</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className={`h-4 w-4 ${isOverdue(task.due_date) ? 'text-red-500' : 'text-muted-foreground'}`} />
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm ${isOverdue(task.due_date) ? 'text-red-600 font-medium' : 'text-foreground'}`}>
                                                            {formatDate(task.due_date)}
                                                        </span>
                                                        {isOverdue(task.due_date) && task.status.toLowerCase() !== 'terminé' && task.status.toLowerCase() !== 'completed' && (
                                                            <Badge variant={'destructive'} className="text-xs w-fit mt-1">
                                                                En retard
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                {isOverdue(task.due_date) && task.status.toLowerCase() !== 'terminé' && task.status.toLowerCase() !== 'completed' ? (
                                                    <Badge variant={'destructive'} className="font-medium">
                                                        Urgente
                                                    </Badge>
                                                ) : task.status.toLowerCase() === 'en cours' || task.status.toLowerCase() === 'in_progress' ? (
                                                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 font-medium">
                                                        Normale
                                                    </Badge>
                                                ) : (
                                                    <Badge variant={'secondary'} className="font-medium">
                                                        Basse
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}