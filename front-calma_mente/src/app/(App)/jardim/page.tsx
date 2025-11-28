import Jardim from '@/components/Jardim'
import SideBar from '@/components/UI/SideBar'

export default function JardimPage() {
    return(
        <main className='flex-row'>
            <SideBar pagina='/jardim'/>
            <Jardim />
        </main>
    )
}

