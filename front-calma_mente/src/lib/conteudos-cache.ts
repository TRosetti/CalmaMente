// lib/conteudos-cache.ts
import { unstable_cache as unstableCache } from 'next/cache';
import { supabase } from '@/lib/supabase';

// Lista de Conteudos publicados, ordenados
export const getPublishedConteudos = unstableCache(
    async () => {
        const { data, error } = await supabase
            .from('conteudo')
            .select('*')
            .eq('status', true)
            .order('data_publicacao', { ascending: false });

        if (error) throw error;
        return data ?? [];
    },
    ['contuedos:list'],                 // chave estável
    { tags: ['contuedos'], revalidate: false } // 👈 sem TTL; invalida por evento
);

export const getLimitedConteudo = unstableCache(
    async () => {
        const { data, error } = await supabase
            .from('conteudo')
            .select('*')
            .eq('status', true)
            .order('data_publicacao', { ascending: false })
            .limit(3);

        if (error) throw error;
        return data ?? [];
    },
    [`conteudo:list:limited:3`],
    { tags: ['conteudo', `contuedos:limited:3`], revalidate: false }
);

// Conteudo por slug:
export const getConteudoBySlug = (slug: string) => unstableCache(
    async () => {
        const { data, error } = await supabase
            .from('conteudo')
            .select('*')
            .eq('slug', slug)
            .eq('status', true)
            .single();
        if (error) throw error;
        return data;
    },
    [`conteudo:${slug}`],
    { tags: ['conteudos', `conteudo:${slug}`], revalidate: false }
)();

// Conteudo por categoria:
export const getConteudoByCategory = (categoria: string) => unstableCache(
    async () => {
        const { data, error } = await supabase
            .from('conteudo')
            .select('*')
            .eq('categoria', categoria)
            .eq('status', true)
            .order('data_publicacao', { ascending: false });
        if (error) throw error;
        return data ?? [];
    },
    [`conteudo:list:category:${categoria}`],
    {
        tags: ['conteudos', `conteudo:category:${categoria}`],
        revalidate: false,
    }
)();

