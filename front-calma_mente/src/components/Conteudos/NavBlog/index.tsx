import Link from 'next/link'
import styles from './styles.module.css'

type CategoriaNav = {
  nome: string;
  slug: string;
}

type Props = {
  categoria?: string;
  categorias: CategoriaNav[];
}
export default async function NavBlog({categoria = "todos", categorias}:Props){

  return(
  <nav className={`container flex-row gap-8 py-0 grid-col-2-sm ${styles.navBlog}`}>
    <Link href="/blog" className={`py-8 px-16 border-radius-4 text-center bg-branco ${categoria === "todos" ? styles.ativo : ''}`}>
      Todos posts
    </Link>
    {categorias.map((cat) => (
      <Link key={cat.slug} href={`/blog/${cat.slug}`} className={`py-8 px-16 border-radius-4 text-center bg-branco  ${categoria === cat.slug ? styles.ativo : ''}`}>
        {cat.nome}
      </Link>
    ))} 

  </nav>
  )
   
}