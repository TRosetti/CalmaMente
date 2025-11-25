import { getAuthPayload } from '@/lib/auth'; 
import AppointmentClientPage from '@/components/Consultas/AppointmentPage';

export default async function ConsultasPage() {    
    const user = await getAuthPayload(); 

    
    if (!user) {

        return <div>Erro: Acesso Negado ou Sessão Inválida.</div>;
    }

    return (
        <AppointmentClientPage 
            userId={user.id}             
        />
    );
}