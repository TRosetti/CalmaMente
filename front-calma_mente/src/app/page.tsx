
import SideBar from '@/components/UI/SideBar'

export default async function Home() {    
    return(
        <div className='flex flex-row'>
            <SideBar />
            <h2>🎉 Home</h2>               
        </div>
    );
}