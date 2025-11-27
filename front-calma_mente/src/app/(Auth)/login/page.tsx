'use client'
import styles from './page.module.css';
// import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import Loading from '@/components/UI/Loading';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visualizarSenha, setVisualizarSenha] = useState(false);
    const [isLoading, setIsLoading] = useState(false);    
    const router = useRouter();

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {                
                const data = await response.json();
                
                
                if (data.user) {
                    
                    localStorage.setItem('user_profile', JSON.stringify({
                        id: data.user.id,
                        email: data.user.email,                        
                        tipo: data.user.role 
                    }));
                }
                
                // window.location.href = "/"; // Redireciona
                router.push("/");
            } else {
                const errorData = await response.json();
                alert(errorData.error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro de rede. Tente novamente.');

            setIsLoading(false);
        }
    };

    return(
        <section id="Login" className={`${styles.login} flex-row justify-between flex-col-md`}>    
        {isLoading && ( <Loading /> )} 
        
            <div className={`${styles.logo} width-fill flex-col align-center justify-center`}>                
                <img src='https://jsgxzgxxiquwllivbnyp.supabase.co/storage/v1/object/public/Imagens/logo-calmamente.png' alt='Logo' />
            </div>
            <div className={`${styles.form} width-fill flex-col align-center justify-center`}>
                <div className={`${styles.formContainer} width-fill flex-col gap-32`}>
                    <div>
                        <h1 className=''>Login</h1>
                        <p>Faça login para acessar nosso sistema.</p>
                    </div>   
        
                    <form action="" onSubmit={handleSubmit} className='flex-col gap-16' method="post">
                        <label htmlFor="email" className='width-fill flex-row justify-between align-center gap-16 '>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: '24px'}}>
                                <path d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM20 6V6.511L12 12.734L4 6.512V6H20ZM4 18V9.044L11.386 14.789C11.5611 14.9265 11.7773 15.0013 12 15.0013C12.2227 15.0013 12.4389 14.9265 12.614 14.789L20 9.044L20.002 18H4Z" fill="#8282C6"/>
                            </svg>
                            <input type="email" name="email" id="email" placeholder='email@calmamente.com.br' className='width-fill' onChange={(e) => setEmail(e.target.value)}/>
                        </label>
                        <label htmlFor="password" className='width-fill flex-row justify-between align-center gap-16 '>
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"  >
                                <path d="M12 2C9.243 2 7 4.243 7 7V9H6C4.897 9 4 9.897 4 11V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V11C20 9.897 19.103 9 18 9H17V7C17 4.243 14.757 2 12 2ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V9H9V7ZM18.002 20H13V17.722C13.595 17.375 14 16.737 14 16C14 14.897 13.103 14 12 14C10.897 14 10 14.897 10 16C10 16.736 10.405 17.375 11 17.722V20H6V11H18L18.002 20Z" fill="#8282C6"/>
                            </svg>
                
                            
                            <input type={visualizarSenha ? 'text' : 'password'} name="password" id="password" placeholder='Senha' className='width-fill' onChange={(e) => setPassword(e.target.value)} />                            
                            
                        
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setVisualizarSenha(!visualizarSenha)} className={!visualizarSenha ? styles.displayNone : ''}>
                                <path d="M14.0003 12C12.9053 12 12.0003 11.095 12.0003 10C12.0003 9.646 12.1033 9.317 12.2683 9.027C12.1783 9.02 12.0923 9 12.0003 9C11.2063 9.00524 10.4463 9.32299 9.88478 9.88447C9.3233 10.4459 9.00555 11.206 9.00031 12C9.00031 13.642 10.3583 15 12.0003 15C13.6413 15 15.0003 13.642 15.0003 12C15.0003 11.908 14.9803 11.822 14.9733 11.732C14.6833 11.897 14.3543 12 14.0003 12Z" fill="#8282C6"/>
                                <path d="M12.0003 5C4.36729 5 2.07329 11.617 2.05229 11.684L1.94629 12L2.05129 12.316C2.07329 12.383 4.36729 19 12.0003 19C19.6333 19 21.9273 12.383 21.9483 12.316L22.0543 12L21.9493 11.684C21.9273 11.617 19.6333 5 12.0003 5ZM12.0003 17C6.64929 17 4.57629 13.154 4.07429 12C4.a57829 10.842 6.65229 7 12.0003 7C17.3513 7 19.4243 10.846 19.9263 12C19.4223 13.158 17.3483 17 12.0003 17Z" fill="#8282C6"/>
                            </svg>
                            
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setVisualizarSenha(!visualizarSenha)} className={visualizarSenha ? styles.displayNone : ''} >
                                <path d="M11.9997 19C12.9457 19 13.8097 18.897 14.5977 18.719L12.8407 16.962C12.5677 16.983 12.2907 17 11.9997 17C6.64874 17 4.57573 13.154 4.07373 12C4.45068 11.1588 4.95978 10.3833 5.58173 9.70297L4.18373 8.30497C2.64573 9.97197 2.06273 11.651 2.05173 11.684C1.98276 11.8893 1.98276 12.1116 2.05173 12.317C2.07273 12.383 4.36673 19 11.9997 19ZM11.9997 4.99997C10.1627 4.99997 8.65373 5.39597 7.39573 5.98097L3.70673 2.29297L2.29273 3.70697L20.2927 21.707L21.7067 20.293L18.3877 16.974C21.0017 15.023 21.9347 12.359 21.9487 12.317C22.0177 12.1116 22.0177 11.8893 21.9487 11.684C21.9267 11.617 19.6327 4.99997 11.9997 4.99997ZM16.9717 15.558L14.6917 13.278C14.8817 12.888 14.9997 12.459 14.9997 12C14.9997 10.359 13.6407 8.99997 11.9997 8.99997C11.5407 8.99997 11.1117 9.11797 10.7227 9.30897L8.91473 7.50097C9.90725 7.16038 10.9504 6.99097 11.9997 6.99997C17.3507 6.99997 19.4237 10.846 19.9257 12C19.6237 12.692 18.7597 14.342 16.9717 15.558Z" fill="#8282C6"/>
                            </svg>
                            

                           
                        </label>                                                                  
                        <input type="submit" value="Entrar" className='py-8 px-16 border-radius-4 color-branco'/>       
                        <hr style={{borderColor: '#8282C6'}}/>
                        <Link href={'/cadastro'}  className={styles.cadastro}>Abrir uma conta</Link>             
                    </form>
                    
                    
                </div>
            </div>   
            
        </section>
    )
}