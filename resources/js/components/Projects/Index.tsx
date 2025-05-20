import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AddNewProject } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, PlusCircle } from 'lucide-react';
import React from 'react';

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

    const statusOptions = [
        { value: 'en cours', label: 'En cours' },
        { value: 'en attente', label: 'En attente' },
        { value: 'terminé', label: 'Terminé' },
        { value: 'annulé', label: 'Annulé' },
    ];

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
            <AlertDialogTrigger asChild className='sr-only'>
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
