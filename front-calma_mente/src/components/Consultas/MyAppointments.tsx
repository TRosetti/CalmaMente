import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { AppointmentItem } from '@/types/appointment';

interface MyAppointmentsProps {
    appointments: AppointmentItem[];    

}

const MyAppointments: React.FC<MyAppointmentsProps> = ({ appointments }) => {
    
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Confirmada": return "text-green-600 bg-green-50 border-green-300";
            case "Pendente": return "text-yellow-600 bg-yellow-50 border-yellow-300";
            case "Cancelada": return "text-red-600 bg-red-50 border-red-300";
            default: return "text-gray-600 bg-gray-50 border-gray-300";
        }
    };

    
    // const handleCancelClick = (id: number) => {
        
    //     if (window.confirm("Tem certeza que deseja cancelar esta consulta?")) {
    //         // onCancelAppointment(id);
    //     }
    // };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
                <ClockIcon className="w-6 h-6" /> Minhas Consultas
            </h2>
            
            <div className="space-y-4">
                {appointments.length === 0 ? (
                    <p className="text-gray-500 italic">Você não possui consultas agendadas.</p>
                ) : (
                    appointments.map(app => (
                        <div key={app.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-lg">{app.date}</span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{app.doctor}</p>
                            
                            <button 
                                className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                                // Chama a função passando o ID da consulta
                                // onClick={() => handleCancelClick(app.id)} 
                            >
                                Cancelar
                            </button>
                            
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyAppointments;