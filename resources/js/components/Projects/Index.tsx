import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AddNewProject, Projects } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarDays,
    Calendar as CalendarIcon,
    Clock,
    ClockAlert,
    Loader2,
    MoreVertical,
    PenLine,
    PlusCircle,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

interface AddNewProjectProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const AddNewProjectForm = ({ isOpen, setIsOpen }: AddNewProjectProps) => {
    const [isDateOpen, setIsDateOpen] = React.useState(false);
    const { data, setData, post, processing, reset, errors } = useForm<AddNewProject>({
        name: '',
        desc_prj: '',
        due_date: format(new Date(), 'dd-MM-yyyy'),
        status: 'en cours',
    });

    const statusOptions = [{ value: 'en cours', label: 'En cours' }];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: ({ props }) => {
                const { success } = props.flash as { success?: string };
                if (success) {
                    setIsOpen(false);
                    reset();
                }
            },
            preserveScroll: true,
        });
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild className="sr-only">
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Nouveau projet
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Créer un nouveau projet</AlertDialogTitle>
                        <AlertDialogDescription>Remplissez les détails de votre nouveau projet</AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nom du projet</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nom du projet"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="desc_prj">Description</Label>
                            <Textarea
                                id="desc_prj"
                                value={data.desc_prj}
                                onChange={(e) => setData('desc_prj', e.target.value)}
                                placeholder="Description du projet"
                                rows={3}
                                className={errors.desc_prj ? 'border-red-500' : ''}
                            />
                            {errors.desc_prj && <p className="text-sm text-red-500">{errors.desc_prj}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Date d'échéance</Label>
                            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full justify-start text-left font-normal', !data.due_date && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.due_date ? data.due_date : <span>Sélectionner une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(data.due_date)}
                                        onSelect={(value) => {
                                            if (value) {
                                                setData('due_date', format(value, 'dd-MM-yyyy'));
                                                setIsDateOpen(false);
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={processing}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                'Créer le projet'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

interface ProjectGridProps {
    projects: Projects[];
}

interface UpdateProjectProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    project: Projects;
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    const [isEditModale, setIsEditModale] = useState(false);
    const [projectData, setProjectData] = useState<Projects>({
        id: 0,
        created_by: 0,
        desc_prj: '',
        name: '',
        status: '',
        due_date: '',
        created_at: '',
        updated_at: '',
    });
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    // Function to get status badge color
    const getStatusColor = (status: string) => {
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

    const handleUpdateStatus = (id: number, status: string) => {
        router.put(route('update.status.project.admin', id), { status });
    };

    const handleDelete = (id: number) => {
        router.delete(route('projects.destroy', id));
    };

    return (
        <>
            {projects.length <= 0 ? (
                <div className="flex w-full flex-col items-center justify-center">
                    <img src={'/nodata.svg'} width={300} height={300} />
                    <p className="font-medium">Aucune données trouvée</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="overflow-hidden pb-0 transition-all duration-200 hover:translate-y-[-2px] hover:border-gray-300 hover:shadow-lg"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="line-clamp-1 text-xl font-semibold">{project.name || `Projet ${project.id}`}</h3>
                                        <p className="text-muted-foreground text-sm">Projet N° #{project.id}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${getStatusColor(project.status)} border font-medium`}>{project.status}</Badge>
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {project.status.toLowerCase() === 'annulé' ? null : (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setProjectData(project);
                                                                setIsEditModale(true);
                                                            }}
                                                        >
                                                            <PenLine className="mr-2 h-4 w-4" />
                                                            Modifier
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger className="cursor-pointer">
                                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                                Changer statut
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuSubContent>
                                                                {['En attente', 'En cours', 'Terminé', 'Annulé'].map((status) => (
                                                                    <DropdownMenuItem
                                                                        className="cursor-pointer"
                                                                        key={status}
                                                                        onClick={() => handleUpdateStatus(project.id, status)}
                                                                    >
                                                                        {status}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>
                                                    </>
                                                )}
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(project.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pb-4">
                                <p className="line-clamp-3 min-h-[60px] text-sm text-gray-600">
                                    {project.desc_prj || 'Aucune description disponible'}
                                </p>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        <span>Date d'échéance: {project.due_date ? formatDate(project.due_date) : 'Non définie'}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span>Créé le : {formatDate(project.created_at)}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <ClockAlert className="mr-2 h-4 w-4" />
                                        <span> échéance dans : {project.time_left}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="bg-muted border-t">
                                <div className="w-full px-0 py-2 text-center">
                                    <span className="text-xs">Dernière mise à jour : {formatDate(project.updated_at)}</span>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            <UpdateProjectForm project={projectData} isOpen={isEditModale} setIsOpen={setIsEditModale} />
        </>
    );
}

const UpdateProjectForm = ({ isOpen, setIsOpen, project }: UpdateProjectProps) => {
    const [isDateOpen, setIsDateOpen] = React.useState(false);
    const { data, setData, put, processing, reset, errors } = useForm({
        name: project?.name || '',
        desc_prj: project?.desc_prj || '',
        due_date: !project?.due_date ? format(new Date(), 'dd-MM-yyyy') : format(new Date(project.due_date), 'dd-MM-yyyy'),
    });

    React.useEffect(() => {
        if (project) {
            setData({
                name: project.name || '',
                desc_prj: project.desc_prj || '',
                due_date: !project.due_date ? format(new Date(), 'dd-MM-yyyy') : format(new Date(project.due_date), 'dd-MM-yyyy'),
            });
        }
    }, [project, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('projects.update', project.id), {
            onSuccess: ({ props }) => {
                const { success } = props.flash as { success?: string };
                if (success) {
                    setIsOpen(false);
                    reset();
                }
            },
            preserveScroll: true,
        });
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild className="sr-only">
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Modifier projet {project.name}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Modifier Votre projet</AlertDialogTitle>
                        <AlertDialogDescription>Remplissez les détails de votre projet</AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nom du projet</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nom du projet"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="desc_prj">Description</Label>
                            <Textarea
                                id="desc_prj"
                                value={data.desc_prj}
                                onChange={(e) => setData('desc_prj', e.target.value)}
                                placeholder="Description du projet"
                                rows={3}
                                className={errors.desc_prj ? 'border-red-500' : ''}
                            />
                            {errors.desc_prj && <p className="text-sm text-red-500">{errors.desc_prj}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Date d'échéance</Label>
                            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full justify-start text-left font-normal', !data.due_date && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.due_date ? data.due_date : <span>Sélectionner une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(data.due_date)}
                                        onSelect={(value) => {
                                            if (value) {
                                                setData('due_date', format(value, 'dd-MM-yyyy'));
                                                setIsDateOpen(false);
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={processing}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Modification...
                                </>
                            ) : (
                                'Modifier le projet'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};
