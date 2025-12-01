import SideBar from '@/components/UI/SideBar'
import DiarioEmocional from '@/components/DiarioEmocional';
import { getAuthPayload } from '@/lib/auth';
import { redirect } from 'next/navigation'; 

export default async function Diario() {
   const user = await getAuthPayload(); 

     
       if (!user) {
   
        redirect('/login'); 
           
       }
   
    return(
        <main className='flex-row'>
            <SideBar pagina='/diario'/>
            <DiarioEmocional id_usuario={user.id}/>
     
        </main>
    )
}





