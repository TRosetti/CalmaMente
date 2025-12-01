import styles from './page.module.css'
import SideBar from "@/components/UI/SideBar";

import HeroBlog from "@/components/Conteudos/HeroBlog";
import NavBlog from "@/components/Conteudos/NavBlog";
import { PostList } from "@/components/Conteudos/PostList";
import { categoriasFormatadas } from "@/data/categoriasBlog";
import { getPublishedConteudos } from "@/lib/conteudos-cache";

export default async function PaginaConteudos() {
  


  let posts = [];

  try {
    posts = await getPublishedConteudos();
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
    return <div>Não foi possível carregar os posts.</div>;
  }
  
  
  // ✅ Formate a data junto com a categoria
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

  const heroPost = formattedPosts[0]; // Pega o primeiro post para o hero
  const otherPosts = formattedPosts.slice(1); // Pega os outros posts para a lista



  const categoriasParaNav = Object.keys(categoriasFormatadas)
  .map(slug => ({
    nome: categoriasFormatadas[slug as keyof typeof categoriasFormatadas] || slug,
    slug: slug
  }));

  return (
    <main className="flex-row">
      <SideBar pagina='/conteudos'/>
      <div className={`${styles.app} p-8 bg-gray-50 min-h-screen w-full`}>
      
        <HeroBlog post={heroPost}/>
        <NavBlog categorias={categoriasParaNav} />
        <PostList posts={otherPosts}/>
      

    
      </div>  
    </main>
    
  );
}
