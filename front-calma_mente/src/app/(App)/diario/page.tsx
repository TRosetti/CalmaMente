'use client'
import SideBar from '@/components/UI/SideBar'
import DiarioEmocional from '@/components/DiarioEmocional';


export default function Diario() {

    return(
        <main className='flex-row'>
            <SideBar pagina='/diario'/>
            <DiarioEmocional />
     
        </main>
    )
}





