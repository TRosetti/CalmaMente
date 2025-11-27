'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // 1. Chamar a Rota de API para limpar o cookie no navegador
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                // 2. Limpar o localStorage (dados de exibição)
                localStorage.removeItem('user_profile');

                // 3. Redirecionar para a página de login
                // O middleware garantirá que o cookie limpo resulte em redirecionamento
                router.push('/login');
            } else {
                alert('Falha ao encerrar a sessão. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro de rede durante o logout:', error);
            alert('Erro de rede. Não foi possível fazer o logout.');
        }
    };

    return (
        <button 
            onClick={handleLogout}
            style={{ 
                marginTop: '30px', 
                padding: '10px 20px', 
                backgroundColor: '#dc3545', // Cor vermelha para Logout
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
            }}
        >
            🚪 Fazer Logout
        </button>
    );
}