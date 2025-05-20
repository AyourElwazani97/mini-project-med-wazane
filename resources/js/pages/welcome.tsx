import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden">
                <div className="w-full max-w-7xl px-6 lg:px-8">
                    <div className="relative isolate pt-14 pb-20 lg:pt-20">
                        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                            <div
                                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                                style={{
                                    clipPath:
                                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                }}
                            ></div>
                        </div>

                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">Gérez vos tâches et projets efficacement</h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                                TaskFlow est une plateforme intuitive de gestion de tâches et de projets conçue pour les étudiants et les enseignants.
                                Organisez votre travail, collaborez avec vos camarades et suivez votre progression en temps réel.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href={route('register')}
                                    className="bg-primary flex items-center gap-2 rounded-sm border border-[#19140035] px-6 py-3 text-sm font-semibold shadow-sm hover:opacity-90 dark:border-[#3E3E3A]"
                                >
                                    Commencer maintenant
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="border-b border-transparent text-sm leading-6 font-semibold hover:border-current"
                                >
                                    Déjà inscrit? Se connecter <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <footer className="mt-24 border-t border-[#19140035] py-8 dark:border-[#3E3E3A]">
                        <div className="text-center">
                            <p className="text-sm text-[#1b1b18]/70 dark:text-[#EDEDEC]/70">
                                © {new Date().getFullYear()} TaskFlow - Projet scolaire par MOHAMED WAZANE
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
