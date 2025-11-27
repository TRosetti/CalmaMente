import React, { useState } from 'react';

import CustomSelect from '@/components/UI/CustomSelect'; 
import {AvailableAppointment} from '@/types/appointment'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TIME_OPTIONS = [
    { value: "08:00", label: "08:00h" },
    { value: "09:00", label: "09:00h" },
    { value: "10:00", label: "10:00h" },
    { value: "13:00", label: "13:00h" },
    { value: "14:00", label: "14:00h" },
    { value: "15:00", label: "15:00h" },
    { value: "16:30", label: "16:30h" },
];

interface ScheduleFormProps {
    selectedAppointment: AvailableAppointment;
    occupiedSlots: string[];
    onSubmit: (data: { date: string, time: string }) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ occupiedSlots, onSubmit }) => {    
 
    const [startDate, setStartDate] = useState<Date | null>(null);     
    const [time, setTime] = useState('');

    const getFormattedLocalDate = (dateObj: Date): string => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!startDate || !time) {
            alert("Por favor, selecione a data e o horário.");
            return;
        }
        
        const formattedDate = getFormattedLocalDate(startDate);

        onSubmit({ date: formattedDate, time });
    };

    
    const filteredTimeOptions = TIME_OPTIONS.filter(option => {        
        if (!startDate) return true; 
        const formattedDate = getFormattedLocalDate(startDate);        
        const checkTime = `${formattedDate} ${option.value}:00`; 
            
        return !occupiedSlots.includes(checkTime);
    });
    

    return (
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-medium">Selecione Data e Hora</h3>
            
            <label className="block text-sm font-medium text-gray-700" htmlFor="schedule_date">
                Data Desejada
            </label>
            <DatePicker
                id="schedule_date"
                selected={startDate}
                onChange={(date: Date | null) => {
                    setStartDate(date);
                    setTime('');
                }}
                minDate={new Date()} 
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholderText="Selecione uma data"
                required
            />
            
            <CustomSelect
                label="Horário"
                id="schedule_time"
                value={time}                
                options={filteredTimeOptions}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setTime(e.target.value)}
                required
            />
            
            <button
                type="submit"
                className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
                Confirmar Agendamento
            </button>
        </form>
        
       
    );
};
export default ScheduleForm;