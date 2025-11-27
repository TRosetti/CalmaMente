import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Tarja } from "@/components/Tarja";
import { Footer } from "@/components/Footer";
import styles from './page.module.css';
import Link from "next/link";
import Image from "next/image";
import { categoriasFormatadas } from "@/data/categoriasBlog";

import ConteudoBlog from "@/components/Conteudos/ConteudoBlog";
import { PostList } from "@/components/Conteudos/PostList";
import { getPostBySlug, getLimitedPost } from "@/lib/conteudos-cache";

interface PostPageProps {
  
  params: Promise<{
    categoria: string;
    post: string;
  }>;
}


export default async function PostPage({ params }: PostPageProps) {
  
  const { categoria, post } = await params;

  const fullSlug = `${categoria}/${post}`;

  const categoriasValidas = Object.keys(categoriasFormatadas);

  if (!categoriasValidas.includes(categoria)) {
    return notFound();
  }
  
  let postData = [];
  
  try {
    postData = await getPostBySlug(fullSlug);
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
    return <div>Não foi possível carregar os posts.</div>;
  }
  

  const foundPost = {
    ...postData,
    categoria: categoriasFormatadas[postData.categoria as keyof typeof categoriasFormatadas] || postData.categoria,
    
    data_publicacao: new Date(postData.data_publicacao).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
  };


  let outrosPosts = [];
  
  try {
    outrosPosts = await getLimitedPost();
  } catch (err) {
    console.error('Erro ao buscar posts relacionados:', err);
    return <div>Não foi possível carregar os posts.</div>;
  }

  
  // ✅ Garante que outrosPosts seja um array antes de usar .map()
  const tresPostsRelacionados = (outrosPosts || []).map(p => ({
    ...p,
    categoria: categoriasFormatadas[p.categoria as keyof typeof categoriasFormatadas] || p.categoria,
    data_publicacao: new Date(p.data_publicacao).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
  }));
  

  return (
    <div className={styles.app}>
      <Tarja />
      <Header />
      <main className="">
        <div className="container flex-col gap-32">
          <div className={`${styles.nav} flex-row gap-8 align-center`}>
            <Link href='/blog'>Blog</Link>
            <Image src="/dropdownNav.svg" alt="seta" width={9} height={16} style={{transform: "rotate(-90deg)"}}/>
            <Link href={`/blog/${categoria}`}>{foundPost.categoria}</Link>
          </div>
          <div className={`${styles.titulo} flex-col gap-8`}>
            <div className={`flex-row gap-8 align-center ${styles.meta}`}>
              <span>{foundPost.categoria}</span>
              <p>{foundPost.data_publicacao}</p>
            </div>
            <h1>{foundPost.titulo}</h1>
            <p>{foundPost.subtitulo}</p>
          </div>
          <Image src={foundPost.imagem_url} alt={foundPost.imagem_alt ? foundPost.imagem_alt : ("Post" + foundPost.titulo)} width={550} height={314} layout="responsive" priority={true} className="border-radius-8" />
        </div>

        <ConteudoBlog post={foundPost}/>
        <PostList posts={tresPostsRelacionados} titulo="Veja também"/>
      </main>
      <Footer />
    </div>
  );
}