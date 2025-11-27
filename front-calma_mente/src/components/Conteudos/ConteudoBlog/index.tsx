import styles from "./styles.module.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from "@/components/UI/Button";

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

interface postEscolhido {
  post: PostData;
}

export default function ConteudoBlog({ post }: postEscolhido) {


  return (
    <section id="ConteudoBlog">
      <div dangerouslySetInnerHTML={{ __html: post.conteudo_html }}  className={`container flex-col gap-32 ${styles.ConteudoBlog}` }>      
      </div>
      {/* <div className={`container flex-col gap-32 ${styles.ConteudoBlog}` }>    
             
      </div> */}
    </section>
  );
}
