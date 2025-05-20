import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react';
import { type FormEventHandler, useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Connexion" />
            <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
                <div className="h-full w-full max-w-7xl px-6 lg:px-8">
                    <div className="relative isolate flex items-center justify-center pt-14 pb-20 lg:pt-20">
                        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                            <div
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                                style={{
                                    clipPath:
                                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                }}
                            ></div>
                        </div>
                        <form className="flex w-[320px] flex-col gap-6 rounded-lg border p-4 md:w-xl" onSubmit={submit}>
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold">Connexion</h2>
                                <p className="text-muted-foreground mt-1 text-sm">Veuillez vous connecter à votre compte</p>
                            </div>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Adresse email</Label>
                                    <div className="relative">
                                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@exemple.com"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Mot de passe</Label>
                                    </div>
                                    <div className="relative">
                                        <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Mot de passe"
                                            className="pl-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            <span className="sr-only">{showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}</span>
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Se connecter
                                </Button>
                            </div>

                            <div className="text-muted-foreground text-center text-sm">
                                Vous n'avez pas de compte?{' '}
                                <TextLink href={route('register')} tabIndex={5}>
                                    S'inscrire
                                </TextLink>
                            </div>
                        </form>
                    </div>
                </div>
                <footer className="absolute bottom-0 mt-24 w-full border-t border-[#19140035] py-8 dark:border-[#3E3E3A]">
                    <div className="text-center">
                        <p className="text-sm text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                            © {new Date().getFullYear()} TaskFlow - Projet scolaire par MOHAMED WAZANE
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
