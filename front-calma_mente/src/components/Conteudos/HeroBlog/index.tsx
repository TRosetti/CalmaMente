import styles from './styles.module.css'
import Image from 'next/image'
import Link from 'next/link'

interface PostData {
  id: string;
  slug: string;
  imagem_url: string;
  imagem_alt: string;
  categoria: string;
  data_publicacao: string;
  titulo: string;
  subtitulo: string;
  conteudo_html: string;
}

interface ultimoPost {
  post: PostData;
}

export default function HeroBlog({ post }: ultimoPost){


    return(
      <section id="Hero ">
        <div className={`flex-col gap-32 ${styles.hero}`}>
          <div className={`${styles.titulo} flex-col gap-8`}>
            <h1>Conteudos</h1>
            <p>Onde o Autoconhecimento Encontra a Tranquilidade. <br /> Guias e artigos práticos para nutrir a sua mente, cultivar o equilíbrio emocional e construir uma vida mais serena.</p>
          </div>
          <div className={`flex-row flex-col-lg gap-64 align-center ${styles.heroConteudo}`}>
            <div className={`${styles.heroImgConainer}`}>
             <Link href={`/conteudos/${post.slug}`}>
              <Image src={post.imagem_url} alt={post.imagem_alt} width={550} height={314} layout="responsive" priority={true} className="border-radius-8" />
             </Link>
             
            </div>
            
            <article className={`flex-col gap-16 ${styles.texto}`}>
                <div className={`flex-row gap-8 align-center ${styles.meta}`}>
                <span>{post.categoria}</span>
                <p>{post.data_publicacao}</p>
              </div>
              <div className="flex-col gap-4" >
                <h2>
                 
                  <Link href={`/conteudos/${post.slug}`}> 
                    {post.titulo}
                  </Link>
              </h2>
                <p>{post.subtitulo}</p>
              </div>
              
              <Link href={`/conteudos/${post.slug}`} className="flex-row gap-8 align-center">
                Ler mais
                <Image src='/SetaSlide.svg' alt="seta"  width={8} height={12} style={{transform: "rotate(180deg)"}}/> 
              </Link>
            </article>
            
            
          </div>
        </div>
      </section>
      
 
    )
   
}