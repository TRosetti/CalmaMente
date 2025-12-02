
// import { Hero } from "@/components/Hero";
import styles from './page.module.css'
import HeroBlog from "@/components/Conteudos/HeroBlog";
import NavBlog from "@/components/Conteudos/NavBlog";
import { PostList } from "@/components/Conteudos/PostList";
import { categoriasFormatadas } from "@/data/categoriasBlog";

import { notFound } from "next/navigation";
import { getConteudoByCategory } from "@/lib/conteudos-cache";
import SideBar from "@/components/UI/SideBar";

interface CategoriaPageProps {
  params: Promise<{
    categoria: string ;
  }>;
}



export default async function PaginaBlogCategoria({params}:CategoriaPageProps ) {

  const { categoria } = await params;

  const categoriasValidas = Object.keys(categoriasFormatadas);
  if (!categoriasValidas.includes(categoria)) {
    return notFound();
  }

  let posts = [];

  try {
    posts = await getConteudoByCategory(categoria);
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
    return <div>Não foi possível carregar os posts.</div>;
  }



  const formattedPosts = posts.map(post => {
    const dataObj = new Date(post.data_publicacao);
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    return {
      ...post,
      categoria: categoriasFormatadas[post.categoria as keyof typeof categoriasFormatadas] || post.categoria,
      data_publicacao: dataFormatada // Sobrescreve a data com o formato desejado
    };
  });
  
  // Crie a lista de categorias para o NavBlog
  const categoriasParaNav = Object.keys(categoriasFormatadas)
  .map(slug => ({
    nome: categoriasFormatadas[slug as keyof typeof categoriasFormatadas] || slug,
    slug: slug
  }));
    
  // ✅ Separe os posts da lista filtrada
  const heroPost = formattedPosts[0];
  const otherPosts = formattedPosts.slice(0);


  return (
    <main className="flex-row">
      <SideBar pagina='/conteudos'/>
      <div className={`${styles.app} p-8 bg-gray-50 min-h-screen w-full flex-col gap-32`}>
      
        <HeroBlog post={heroPost}/>
        <NavBlog categorias={categoriasParaNav} />
        <PostList posts={otherPosts}/>
      

    
      </div>  
    </main>  
  );
}
