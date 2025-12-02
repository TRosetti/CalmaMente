import Image from "next/image";
import Link from "next/link";
import styles from './styles.module.css';

interface PostData {
  id: string;
  slug: string;
  imagem_url: string;
  imagem_alt?: string;
  categoria: string;
  data_publicacao: string;
  titulo: string;
  subtitulo: string;
  conteudo_html: string;
  
}

interface PostsListProps {
  posts: PostData[];
  titulo?: string;
}

export function PostList({ posts, titulo = ""}: PostsListProps) {


  return (
    <div className={` flex-col gap-32 align-center ${styles.postsContainer}`}>
      
      {titulo != '' && ( 
         <div className="flex-row justify-between width-fill flex-col-sm gap-16-sm text-center-sm">
          <h2>{titulo}</h2>
          <Link href={'/blog'} className=" flex-col align-center justify-center text-center border-1-preto px-16 py-8 border-radius-4 align-self-center display-none-sm">
            Outros Posts
          </Link>
        </div>
      ) }
     
     
      <div className={` grid-col-minmax-400 wrap gap-64-32  grid-col-minmax-fill-sm width-fill`}>      
        {posts.map((post, index) => (
          
          <article key={index} className={`${styles.postCard} flex-col gap-16`}>
            <Link href={`/blog/${post.slug}`}>
             <Image src={post.imagem_url} alt={post.imagem_alt ? post.imagem_alt : ("Post: " + post.titulo)} width={412} height={235} className={` ${styles.imagem} border-radius-8`} layout="responsive"/>
            </Link>
           
            <div className={`flex-row gap-8 align-center ${styles.meta}`}>
              <span>{post.categoria}</span>
              <p>{post.data_publicacao}</p>
            </div>

            <div className={`${styles.titulo} flex-col gap-4`} >
              <h3>
                <Link href={`/blog/${post.slug}`}>
                {post.titulo}
                </Link>
              </h3>
              <p>{post.subtitulo}</p>
            </div>
            
            <Link href={`/blog/${post.slug}`} className={`${styles.link} flex-row gap-8 align-center`}>
              Ler mais
              <Image src='/SetaSlide.svg' alt="seta"  width={8} height={12} style={{transform: "rotate(180deg)"}}/> 
            </Link>
          </article>
        ))}
      </div>


      {titulo != '' && ( 
         
        <Link href={'/blog'} className=" display-none border-1-preto px-16 py-8 border-radius-4 display-block-sm ">
          Outros Posts
        </Link>        
      ) }
    </div>
    
  );
}