import { router, useForm } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FiltreUtilisateursModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const FiltreUtilisateursModal = ({ isOpen, setIsOpen }: FiltreUtilisateursModalProps) => {
    const [isStartDateOpen, setIsStartDateOpen] = React.useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const { data, setData } = useForm({
        type_utilisateur: '',
        date_debut: null,
        date_fin: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('utilisateurs.index'),
            {
                type: data.type_utilisateur || null,
                start_date: data.date_debut || null,
                end_date: data.date_fin || null,
            },
            {
                preserveState: true,
                onStart: () => {
                    setIsLoading(true);
                },
                onSuccess: () => {
                    setIsOpen(false);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    const resetFilters = () => {
        setData({
            type_utilisateur: '',
            date_debut: null,
            date_fin: null,
        });
        router.get(
            route('utilisateurs.index'),
            {},
            {
                preserveState: true,
                onStart: () => {
                    setIsLoading(true);
                },
                onSuccess: () => {
                    setIsOpen(false);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Filtrer les utilisateurs</DialogTitle>
                        <DialogDescription>Appliquez des filtres pour affiner votre recherche</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type_utilisateur">Type d'utilisateur</Label>
                            <Select value={data.type_utilisateur} onValueChange={(value) => setData('type_utilisateur', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">Utilisateur</SelectItem>
                                    <SelectItem value="admin">Administrateur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <div className="grid gap-2">
                                <Label>Date de début</Label>
                                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn('w-full justify-start text-left font-normal', !data.date_debut && 'text-muted-foreground')}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {data.date_debut || <span>Sélectionner une date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={data.date_debut ? parse(data.date_debut, 'dd-MM-yyyy', new Date()) : undefined}
                                            onSelect={(date: string) => {
                                                if (date) {
                                                    setData('date_debut', format(date, 'dd-MM-yyyy'));
                                                    setIsStartDateOpen(false);
                                                }
                                            }}
                                            locale={fr}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="grid gap-2">
                                <Label>Date de fin</Label>
                                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn('w-full justify-start text-left font-normal', !data.date_fin && 'text-muted-foreground')}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {data.date_fin || <span>Sélectionner une date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={data.date_fin ? parse(data.date_fin, 'dd-MM-yyyy', new Date()) : undefined}
                                            onSelect={(date: string) => {
                                                if (date) {
                                                    setData('date_fin', format(date, 'dd-MM-yyyy'));
                                                    setIsEndDateOpen(false);
                                                }
                                            }}
                                            locale={fr}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={resetFilters} disabled={isLoading}>
                            Réinitialiser
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                'Appliquer les filtres'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
