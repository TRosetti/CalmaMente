// lib/conteudos-cache.ts
// import { unstable_cache as unstableCache } from 'next/cache';
import { supabase } from '@/lib/supabase';


export const getPublishedConteudos = async () => { // CHAME DIRETAMENTE
    
    // A função deve estar definida para buscar dados:
    const { data, error } = await supabase
        .from('posts_conteudo')
        .select('*')
        .eq('status', true)
        .order('data_publicacao', { ascending: false });

    if (error) {
        console.error("ERRO SUPABASE em getPublishedConteudos:", error);
        throw error;
    }

    return data ?? [];
}

export const getLimitedConteudo = async () => {
    const { data, error } = await supabase
        .from('posts_conteudo')
        .select('*')
        .eq('status', true)
        .order('data_publicacao', { ascending: false })
        .limit(3);

    if (error) throw error;
    return data ?? [];
}


// Conteudo por slug:
export const getConteudoBySlug = async  (slug: string) => {
    const { data, error } = await supabase
        .from('posts_conteudo')
        .select('*')
        .eq('slug', slug)
        .eq('status', true)
        .single();
    if (error) throw error;
    return data;
}
// Conteudo por categoria:
export const getConteudoByCategory =  async (categoria: string) => {
    const { data, error } = await supabase
        .from('posts_conteudo')
        .select('*')
        .eq('categoria', categoria)
        .eq('status', true)
        .order('data_publicacao', { ascending: false });
    if (error) throw error;
    return data ?? [];
}

