import { getAuthPayload } from '@/lib/auth';
import SideBar from '@/components/UI/SideBar'
import LogoutButton from '@/components/UI/LogoutButton';
import { redirect } from 'next/navigation'; 

export default async function ConfigPage() {
    const user = await getAuthPayload(); 
    
    if (!user) {

        redirect('/login'); 
        
    
    }

    
    return(
        <div className='flex flex-row bg-white '>
            <SideBar />
          
            <div style={{ border: '1px solid #ccc', width: '100%' }} className='p-8'>
                  <h2>🎉 Bem-vindo ao Sistema!</h2>
                <h3>Detalhes do Usuário Logado:</h3>
                <p>
                    **E-mail:** {user.email}
                </p>
                <p>
                    **ID (UUID):** {user.id}
                </p>
                <p>
                    **Papel (Role):** {user.role}
                </p>
                <LogoutButton /> 
            </div>
            
            
        </div>
    );
}