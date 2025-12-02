import { getAuthPayload } from '@/lib/auth'; 
import HomePage from '@/components/HomePage';
import SideBar from '@/components/UI/SideBar'

export default async function Home() {   
    const user = await getAuthPayload(); 

    
    if (!user) {

        return <div>Erro: Acesso Negado ou Sessão Inválida.</div>;
    }
 
    return(
        <div className='flex flex-row'>
            <SideBar />
            <HomePage userId={user.id}/>            
        </div>
    );
}