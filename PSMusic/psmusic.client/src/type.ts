import type { ReactNode } from 'react';

export interface NavItem {
    icon: ReactNode;
    label: string;
    active?: boolean;
    live?: boolean;
}

export interface Playlist {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    tag: string;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    imageUrl: string;
    premium?: boolean;
}