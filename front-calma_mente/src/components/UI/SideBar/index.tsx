'use client';
import styles from './styles.module.css';
import Link from "next/link";
import Image from 'next/image';
import { useState } from 'react';

interface Props {
    pagina?: string;
}

const NAVIGATION_ITEMS = [
    
    { name: 'Calendário', href: '/calendario', Icon: './SideBar/calendario.svg', pageKey: 'calendario' },
    { name: 'Diário Emocional', href: '/diario', Icon: './SideBar/diario.svg', pageKey: 'diario' },
    { name: 'Conteúdos', href: '/conteudos', Icon: './SideBar/conteudos.svg', pageKey: 'conteudos' }, 
    { name: 'Jardim', href: '/jardim', Icon: './SideBar/jardim.svg', pageKey: 'jardim' },    
];

export default function SideBar({pagina = '/'}: Props){
    const [fechado, setFechado] = useState(true);

    return(
        <nav className={`${styles.sideBar} ${fechado ? styles.fechado : ''} flex-col bg-violet-400`}>
            <div className={`${styles.links} flex-col gap-8`}>

                <Link href={'/'} className={`${pagina == '/' ? styles.ativo: ''}`}>

                    <Image src={'./SideBar/home.svg'} alt="Home" width={30} height={30} className={styles.svg}/>
                    
                    <div className={`${styles.apenasTelaCheia} `}>
                        Home
                    </div>

                </Link>
                <hr className='border-violet-500'/>

                {NAVIGATION_ITEMS.map((item) => {                    
                    
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href} 
                            className={`${pagina == item.href ? styles.ativo: ''}`}
                        >
                           
                            <Image src={item.Icon} alt={item.name}  width={30} height={30} className={styles.svg}/>

                                                        
                            <span className={`${styles.apenasTelaCheia}`}>
                                {item.name}
                            </span>

                        </Link>
                    );
                })}
                <hr className='border-violet-500'/>
            </div>
            <div className={`config flex-col gap-8`}>
                <hr className='border-violet-500'/>
                <Link href={"/config"} className={`${pagina == '/config' ? styles.ativo: ''}`}>
                    <Image src={'./SideBar/config.svg'} alt="config" width={30} height={30} className={styles.svg}/>
                    <div className={`${styles.apenasTelaCheia}`}>
                        Configuração
                    </div>
                </Link>
                <hr className='border-violet-500'/>
                <div className={`flex-row justify-between`}>
                   

                <button className={styles.sair} onClick={() => setFechado(!fechado)}>

                    <svg width="25" height="25" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/3000/svg" className={styles.svg}>
                        <path d="M16 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 0 16 0ZM2 2H5V16H2V2ZM7 16V2H16V16H7Z" fill="white"/>
                    </svg>
                </button>
                </div>
            </div>
        </nav>
    )
}