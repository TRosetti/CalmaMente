'use client'
import styles from './styles.module.css'
import React, { useState, useEffect } from 'react';
import AppointmentCard from './AppointmentCard';
import ScheduleForm from './ScheduleForm';
import MyAppointments from './MyAppointments';
import { AvailableAppointment, AppointmentItem, AppointmentAPIResponse, DoctorAPIResponse } from '@/types/appointment';
import { OccupiedSlotAPIResponse } from '@/types/appointment';

interface AppointmentClientPageProps {
    userId: string;
}

const API_DOCTORS_URL = 'http://localhost:8081/medicos';
const API_APPOINTMENTS_URL = 'http://localhost:8081/agendamentos';

const mapStatus = (apiStatus: string): AppointmentItem['status'] => {
    switch (apiStatus.toLowerCase()) {
        case 'confirmado':
            return 'Confirmada';
        case 'pendente':
            return 'Pendente';
        case 'cancelado':
            return 'Cancelada';
        default:
            return 'Pendente';
    }
};

const formatDate = (isoDate: string): string => {
    try {
        const date = new Date(isoDate);

        const datePart = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
        }).format(date).replace('.', '');

        const timePart = new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        }).format(date);

        return `${datePart}, ${timePart}h`;

    } catch (e) {
        console.error("Erro ao formatar data:", e);
        return isoDate.split('T')[0];
    }
};


const AppointmentPage: React.FC<AppointmentClientPageProps> = ({ userId }) => {

    const API_USER_APPOINTMENTS_URL = `http://localhost:8081/agendamentos/meus/${userId}`;

    // --- ESTADOS PARA CONSULTAS DISPONÍVEIS (Médicos/Serviços) ---
    const [availableAppointments, setAvailableAppointments] = useState<AvailableAppointment[]>([]);
    const [loadingAvailable, setLoadingAvailable] = useState(true);
    const [errorAvailable, setErrorAvailable] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<AvailableAppointment | null>(null);


    // --- ESTADOS PARA CONSULTAS DO USUÁRIO (Minhas Consultas) ---
    const [userAppointments, setUserAppointments] = useState<AppointmentItem[]>([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [errorUser, setErrorUser] = useState<string | null>(null);


    const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]); // Armazena a lista de dataHora ocupados


    // BUSCAR MÉDICOS DISPONÍVEIS (Serviços)
    useEffect(() => {
        const fetchAvailableDoctors = async () => {
            try {
                const response = await fetch(API_DOCTORS_URL);
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data: DoctorAPIResponse[] = await response.json();

                const mappedAppointments: AvailableAppointment[] = data.map(item => ({
                    id: item.id,
                    specialty: item.especialidade,
                    doctor: `Dr(a) ${item.usuario.nome}`,
                    price: item.especialidade === "Psiquiatria" ? 180.00 : 150.00,
                }));

                setAvailableAppointments(mappedAppointments);
            } catch (err) {
                console.error("Erro ao buscar serviços:", err);
                setErrorAvailable("Não foi possível carregar os serviços disponíveis. Tente novamente mais tarde.");
            } finally {
                setLoadingAvailable(false);
            }
        };

        fetchAvailableDoctors();
    }, []);


    //  BUSCAR CONSULTAS DO USUÁRIO
    useEffect(() => {
        const fetchUserAppointments = async () => {
            try {

                if (!userId) return;

                const response = await fetch(API_USER_APPOINTMENTS_URL);
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                const data: AppointmentAPIResponse[] = await response.json();

                const mappedUserAppointments: AppointmentItem[] = data.map(app => ({
                    id: app.id,
                    date: formatDate(app.dataHora),
                    doctor: app.profissional.nome,
                    status: mapStatus(app.status),
                }));

                setUserAppointments(mappedUserAppointments);
            } catch (err) {
                console.error("Erro ao buscar consultas do usuário:", err);
                setErrorUser("Não foi possível carregar suas consultas agendadas.");
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserAppointments();
    }, [userId])

    const handleScheduleSubmit = async (data: { date: string, time: string }) => {

        if (!selectedAppointment || !userId) {
            alert("Erro: Dados de médico ou paciente ausentes.");
            return;
        }

        const { date, time } = data;
        const profissionalId = selectedAppointment.id;
        const dataHora = `${date}T${time}:00`;

        const appointmentData = {
            dataHora: dataHora,
            status: "confirmado", // Ou "AGENDADO", dependendo da sua regra de negócio
            descricao: `Consulta de ${selectedAppointment.specialty} agendada por ${userId}`,
            paciente: {
                id: userId // Usando o ID do paciente logado
            },
            profissional: {
                id: profissionalId
            }
        };

        // URL para o POST
        const API_APPOINTMENTS_URL = 'http://localhost:8081/agendamentos';

        try {
            const response = await fetch(API_APPOINTMENTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // ⚠️ Adicione o header de Autorização/Bearer Token aqui se for necessário!
                },
                body: JSON.stringify(appointmentData),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`✅ Agendamento de ${selectedAppointment.specialty} confirmado para ${data.date} às ${data.time}.`);

                // 1. Limpa o formulário de agendamento
                setSelectedAppointment(null);

                // 2. Atualiza a lista de "Minhas Consultas"
                // Você pode criar uma função para re-executar o useEffect de fetchUserAppointments
                // ou adicionar o novo agendamento à lista localmente.
                // Para simplicidade, vamos apenas re-executar a busca:
                window.location.reload(); // Recarrega a página para atualizar as listas (solução mais simples)
                // Ou, melhor: 
                // fetchUserAppointments(); // Se você extrair a lógica de busca para uma função reutilizável

            } else {
                const errorText = await response.text();
                alert(`❌ Falha ao agendar. Status: ${response.status}. Detalhes: ${errorText.substring(0, 100)}...`);
                console.error("Erro na resposta da API:", errorText);
            }
        } catch (error) {
            console.error("Erro de rede ao agendar:", error);
            alert("Ocorreu um erro de rede. Verifique a conexão com a API.");
        }
    };

    const fetchOccupiedSlots = async (medicoId: string, startDate: string, endDate: string) => {

        // As datas 'inicio' e 'fim' devem ser no formato ISO (YYYY-MM-DDT00:00:00)
        const API_OCCUPIED_URL = `http://localhost:8081/agendamentos/ocupados/${medicoId}`;

        try {
            const response = await fetch(
                `${API_OCCUPIED_URL}?inicio=${startDate}&fim=${endDate}`
            );

            if (!response.ok) {
                throw new Error(`Erro ao buscar ocupados: ${response.status}`);
            }

            const data: OccupiedSlotAPIResponse[] = await response.json();

            // 2. Usando o tipo correto no map
            const occupiedTimes: string[] = data.map((app) => app.dataHora);

            setOccupiedSlots(occupiedTimes);

        } catch (error) {
            console.error("Erro ao buscar horários ocupados:", error);
            setOccupiedSlots([]); // Limpa em caso de erro
        }
    }


    useEffect(() => {
        if (selectedAppointment) {

            // --- CÁLCULO DA DATA INÍCIO ---
            const today = new Date();
            const startYear = today.getFullYear();
            const startMonth = String(today.getMonth() + 1).padStart(2, '0');
            const startDay = String(today.getDate()).padStart(2, '0');

            // Formato: YYYY-MM-DDT00:00:00 (Início do dia)
            const startDateString = `${startYear}-${startMonth}-${startDay} 00:00:00`;


            // --- CÁLCULO DA DATA FIM ---
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30); // 30 dias à frente

            const endYear = futureDate.getFullYear();
            const endMonth = String(futureDate.getMonth() + 1).padStart(2, '0');
            const endDay = String(futureDate.getDate()).padStart(2, '0');

            // Formato: YYYY-MM-DDT23:59:59 (Fim do dia)
            const endDateString = `${endYear}-${endMonth}-${endDay} 23:59:59`;


            fetchOccupiedSlots(
                String(selectedAppointment.id), // Garantindo que seja string para resolver o erro anterior
                startDateString,
                endDateString
            );
        } else {
            setOccupiedSlots([]);
        }
    }, [selectedAppointment]);

    const handleCancelAppointment = async (appointmentId: string) => {
        const API_CANCEL_URL = `http://localhost:8081/agendamentos/${appointmentId}/cancelar`;

        try {
            const response = await fetch(API_CANCEL_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204) {
                // Sucesso: Atualiza a lista localmente
                setUserAppointments(prev => prev.map(app =>
                    app.id === appointmentId ? { ...app, status: 'Cancelada' } : app
                ));
                alert("Consulta cancelada com sucesso.");
            } else if (response.status === 400) {
                // Erro de Negócio
                const errorMessage = await response.text();
                alert(`Não foi possível cancelar: ${errorMessage}`);
            } else {
                // Outros erros
                alert(`Erro ao cancelar. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Erro ao cancelar consulta:", error);
            alert("Erro de rede ao tentar cancelar a consulta.");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen w-full">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                Agendamento de Consultas
            </h1>
            <h2 className="text-2xl font-semibold mb-4 text-violet-700">
                Serviços Disponíveis
            </h2>

            <div className="flex gap-8">


                <div className="w-2/3 space-y-10">

                    <section className='Cartao-Consultas-Disponiveis'>

                        {loadingAvailable && (
                            <p className="text-lg text-indigo-600">Carregando serviços...</p>
                        )}

                        {errorAvailable && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Erro:</strong>
                                <span className="block sm:inline"> {errorAvailable}</span>
                            </div>
                        )}


                        {!loadingAvailable && !errorAvailable && availableAppointments.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {availableAppointments.map(appointment => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        isSelected={selectedAppointment?.id === appointment.id}
                                        onSelect={setSelectedAppointment}
                                    />
                                ))}
                            </div>
                        )}

                        {!loadingAvailable && !errorAvailable && availableAppointments.length === 0 && (
                            <p className="text-lg text-gray-500 italic">Nenhum serviço disponível no momento.</p>
                        )}

                    </section>

                    {/* ## 2. Formulário de Agendamento */}
                    {selectedAppointment && (
                        <div className={styles.ScheduleForm}>
                            <section className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">

                                <h2 className="text-2xl font-semibold mb-6">
                                    Agendar: {selectedAppointment.specialty}
                                </h2>
                                <ScheduleForm
                                    selectedAppointment={selectedAppointment}
                                    occupiedSlots={occupiedSlots}
                                    onSubmit={handleScheduleSubmit}
                                />
                            </section>
                        </div>

                    )}

                </div>


                <div className="w-1/3 Minhas-Consultas">

                    {loadingUser && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center text-indigo-600">
                            Carregando suas consultas...
                        </div>
                    )}

                    {errorUser && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Erro:</strong>
                            <span className="block sm:inline"> {errorUser}</span>
                        </div>
                    )}

                    {!loadingUser && !errorUser && (
                        <MyAppointments
                            appointments={userAppointments}
                            onCancel={handleCancelAppointment}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentPage;