import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface Users {
    id: number;
    name: string;
    type_user: string;
    email: string;
    created_at: Date | string;
    updated_at: Date | string;
}

interface DeleteUserDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    user: Users;
    processing: boolean;
    handleDelete: () => void;
}

// Composant de dialogue de suppression de tâche
export function DeleteTaskDialog({ isOpen, setIsOpen, user, processing, handleDelete }: DeleteUserDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>Cette action supprimera définitivement l'utilisateur "{user.name}". Voulez-vous continuer ?</DialogDescription>
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
