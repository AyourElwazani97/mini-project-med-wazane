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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AddInvForm, Flashes, Inviations } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, PlusCircle } from 'lucide-react';
import React from 'react';

interface DeleteInvDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    invitation: Inviations;
    processing: boolean;
    handleDelete: () => void;
}

interface AddNewInvProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const AddNewInvitation = ({ isOpen, setIsOpen }: AddNewInvProps) => {
    const [isDateOpen, setIsDateOpen] = React.useState(false);
    const { data, setData, post, processing, reset, errors } = useForm<AddInvForm>({
        nom_ref: '',
        date_expiration: format(new Date(), 'dd-MM-yyyy'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('invitations.store'), {
            onSuccess: ({ props }) => {
                const { success } = props.flash as Flashes;
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
                    Nouvelle invitation
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ajouter une nouvelle invitation</AlertDialogTitle>
                        <AlertDialogDescription>Remplissez les détails de votre nouvelle invitation</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nom_ref">Nom de l'invitation</Label>
                            <Input
                                id="nom_ref"
                                value={data.nom_ref}
                                autoComplete="nom_ref"
                                onChange={(e) => setData('nom_ref', e.target.value)}
                                placeholder="Nom de l'invitation"
                                className={errors.nom_ref ? 'border-red-500' : ''}
                            />
                            {errors.nom_ref && <p className="text-sm text-red-500">{errors.nom_ref}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Date d'éxpiration</Label>
                            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full justify-start text-left font-normal', !data.date_expiration && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon />
                                        {data.date_expiration ? data.date_expiration : <span>Date d'éxpiration</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={data.date_expiration}
                                        onSelect={(value: string) => {
                                            setData((prev) => ({
                                                ...prev,
                                                date_expiration: format(value, 'dd-MM-yyyy'),
                                            }));
                                            setIsDateOpen(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date_expiration && <p className="text-sm text-red-500">{errors.date_expiration}</p>}
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

// Composant de dialogue de suppression de tâche
export function DeleteInvDialog({ isOpen, setIsOpen, invitation, processing, handleDelete }: DeleteInvDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>Cette action supprimera définitivement l'invitation "{invitation.nom_ref}". Voulez-vous continuer ?</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Annuler
                    </Button>
                    <Button variant="destructive" disabled={processing} onClick={handleDelete}>
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Suppression...
                            </>
                        ) : (
                            'Supprimer'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
