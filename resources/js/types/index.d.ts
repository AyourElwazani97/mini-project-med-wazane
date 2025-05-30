import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    user_type: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Tasks {
    id: number;
    nom_task: string;
    description?: string | null;
    due_date?: Date | string | null; // More flexible typing
    is_completed: boolean;
    is_important: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface AddTaskForm {
    nom_task: string;
    description?: string;
    due_date?: string | null;
    is_completed: boolean;
    is_important: boolean;
    [key: string]: any;
}

export interface Flashes {
    error?: string | string[] | null;
    success?: string | string[] | null;
    data?: string | string[] | null;
}

export interface AddNewProject {
    name: string;
    desc_prj: string;
    due_date: string;
    status?: string;
    [key: string]: any;
}

export interface Projects {
    id: number;
    created_by: number;
    desc_prj: string;
    name: string;
    status: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    time_left?: string;
}

export interface EachProject {
    id: number;
    created_by: number;
    desc_prj: string;
    name: string;
    status: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    time_left?: string;
}

export interface Users {
    is_linked: boolean,
    id: number,
    name: string,
    email: string,
    [key: string]: any;
}

export interface UserProjectAssignment {
    id: number;
    project_id: number;
    projects: Projects; // Singular - one project per assignment
}

export interface Inviations {
    id: number;
    nom_ref: string;
    date_expiration: string;
}

export interface AddInvForm {
    nom_ref: string;
    date_expiration: string;
    [key: string]: any;
}
