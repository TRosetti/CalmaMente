import React, { useState, useEffect } from 'react';
import { AvailableAppointment } from '@/types/appointment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ScheduleFormProps {
    selectedAppointment: AvailableAppointment;
    onSubmit: (data: { date: string, time: string }) => void;
    onCancel: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ selectedAppointment, onSubmit, onCancel }) => {

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [time, setTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [errorSlots, setErrorSlots] = useState<string | null>(null);

    const getFormattedLocalDate = (dateObj: Date): string => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Previne o comportamento padrão do botão (como submit ou navegação)
        onCancel(); // Chama a função que fechará o formulário no componente pai
    }

    // Regra de 48h de antecedência
    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 2); // Hoje + 2 dias
        return today;
    };

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!startDate || !selectedAppointment) return;

            setLoadingSlots(true);
            setErrorSlots(null);
            setAvailableSlots([]);
            setTime(''); // Limpa seleção anterior

            const dateString = getFormattedLocalDate(startDate);
            const API_URL = `http://localhost:8081/agendamentos/disponiveis?medicoId=${selectedAppointment.id}&data=${dateString}`;

            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar horários: ${response.status}`);
                }
                const data: string[] = await response.json();
                setAvailableSlots(data);
            } catch (err) {
                console.error("Erro ao buscar slots:", err);
                setErrorSlots("Não foi possível carregar os horários. Tente novamente.");
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
    }, [startDate, selectedAppointment]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !time) {
            alert("Por favor, selecione a data e o horário.");
            return;
        }

        const formattedDate = getFormattedLocalDate(startDate);
        onSubmit({ date: formattedDate, time });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. Seleção de Data */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="schedule_date">
                    Data Desejada (Mínimo 48h de antecedência)
                </label>
                <DatePicker
                    id="schedule_date"
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    minDate={getMinDate()}
                    dateFormat="dd/MM/yyyy"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholderText="Selecione uma data"
                    required
                />
            </div>

            {/* 2. Seleção de Horário (Grid de Botões) */}
            {startDate && (
                <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Horários Disponíveis
                    </label>

                    {loadingSlots && (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    )}

                    {errorSlots && (
                        <p className="text-red-500 text-sm">{errorSlots}</p>
                    )}

                    {!loadingSlots && !errorSlots && availableSlots.length === 0 && (
                        <p className="text-gray-500 text-sm italic">Nenhum horário disponível para esta data.</p>
                    )}

                    {!loadingSlots && !errorSlots && availableSlots.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {availableSlots.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setTime(slot)}
                                    className={`
                                        py-2 px-4 rounded-md text-sm font-medium transition-all
                                        ${time === slot
                                            ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300'}
                                    `}
                                >
                                    {slot.substring(0, 5)}h
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 3. Botão de Confirmação */}
            <button
                type="submit"
                disabled={!startDate || !time}
                className={`
                    w-full py-3 font-bold rounded-lg transition-colors
                    ${(!startDate || !time)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-lg'}
                `}
            >
                Confirmar Agendamento
            </button>
            <button 
                type='button' // Mudar para type="button" para evitar submissão do form
                className=' w-full py-3 font-bold rounded-lg border-2 border-violet-300 text-gray-500 hover:bg-gray-100 transition-colors' 
                onClick={handleCancel}>
                Cancelar
            </button>

        </form>
    );
};

export default ScheduleForm;