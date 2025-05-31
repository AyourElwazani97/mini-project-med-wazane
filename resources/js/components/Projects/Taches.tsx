import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Flashes, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import * as React from 'react';

interface AddTaskDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    users: User[];
    project_id: number;
}

export const AddTaskModale = ({ isOpen, setIsOpen, users, project_id }: AddTaskDialogProps) => {
    const [isDateOpen, setIsDateOpen] = React.useState(false);

    const { data, setData, reset, post, processing, errors } = useForm({
        description: '',
        date_echeance: format(new Date(), 'yyyy-MM-dd'),
        user_id: users[0]?.id || 0,
        project_id: project_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projecttasks.store'), {
            onSuccess: ({ props }) => {
                const { success } = props.flash as Flashes;
                if (success) {
                    setIsOpen(false);
                    reset();
                }
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Créer une nouvelle tâche</AlertDialogTitle>
                        <AlertDialogDescription>Remplissez les détails de la tâche à assigner</AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Décrivez la tâche..."
                                className="min-h-[120px]"
                                required
                            />
                            {errors.description && <p className="text-destructive text-sm font-medium">{errors.description}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label>Date d'échéance</Label>
                            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full justify-start text-left font-normal', !data.date_echeance && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.date_echeance ? format(new Date(data.date_echeance), 'dd-MM-yyyy') : <span>Choisir une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(data.date_echeance)}
                                        onSelect={(date: string) => {
                                            if (date) {
                                                setData('date_echeance', format(date, 'yyyy-MM-dd'));
                                                setIsDateOpen(false);
                                            }
                                        }}
                                        fromDate={new Date()} // Only allow dates from today onward
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date_echeance && <p className="text-destructive text-sm font-medium">{errors.date_echeance}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label>Assigné à</Label>
                            <Select value={data.user_id.toString()} onValueChange={(value) => setData('user_id', parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un utilisateur" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && <p className="text-destructive text-sm font-medium">{errors.user_id}</p>}
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
                                    Traitement en cours...
                                </>
                            ) : (
                                'Créer la tâche'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};
