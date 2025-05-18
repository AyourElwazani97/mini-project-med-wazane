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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AddTaskForm, Flashes } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, PlusCircle } from 'lucide-react';
import React from 'react';

export const AddNewTask = ({ isOpen, setIsOpen }) => {
    const [isDateOpen, setIsDateOpen] = React.useState(false);
    const { data, setData, post, processing, reset, errors } = useForm<AddTaskForm>({
        nom_task: '',
        description: '',
        due_date: format(new Date(), 'dd-MM-yyyy'),
        is_completed: false,
        is_important: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: ({ props }) => {
                const { success, error } = props.flash as Flashes;
                if (success) {
                    setIsOpen(false);
                    reset();
                    return;
                }
            },
            preserveScroll: true,
        });
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
                <Button className="sr-only gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Nouvelle tâche
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ajouter une nouvelle tâche</AlertDialogTitle>
                        <AlertDialogDescription>Remplissez les détails de votre nouvelle tâche</AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nom_task">Nom de la tâche</Label>
                            <Input
                                id="nom_task"
                                value={data.nom_task}
                                onChange={(e) => setData('nom_task', e.target.value)}
                                placeholder="Nom de la tâche"
                                className={errors.nom_task ? 'border-red-500' : ''}
                            />
                            {errors.nom_task && <p className="text-sm text-red-500">{errors.nom_task}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Description (optionnelle)"
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Date d'échéance</Label>
                            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full justify-start text-left font-normal', !data.due_date && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon />
                                        {data.due_date ? data.due_date : <span>Date d'échéance</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={data.due_date}
                                        onSelect={(value) => {
                                            setData((prev) => ({
                                                ...prev,
                                                due_date: format(value, 'dd-MM-yyyy'),
                                            }));
                                            setIsDateOpen(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_important"
                                checked={data.is_important}
                                onCheckedChange={(checked) => setData('is_important', Boolean(checked))}
                            />
                            <Label htmlFor="is_important">Tâche importante</Label>
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};
