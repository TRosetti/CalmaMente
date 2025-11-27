import React from 'react';
import CustomInput from '@/components/UI/CustomInput'
import { FormData, AccountType } from '@/types/form';
import CustomSelect from '@/components/UI/CustomSelect';

interface AccountDataFormProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
}

const AccountDataForm: React.FC<AccountDataFormProps> = ({ data, updateData }) => {

  const isClient = data.accountType === 'client';

  // Toggle Pessoa Física / Jurídica
  const handleTypeChange = (type: AccountType) => {
    updateData({ accountType: type });
  };

 
  const mentalHealthProfessionals = [ 
    { value: 'Psiquiatra', label: 'Psiquiatra' },
    { value: 'Psicologo', label: 'Psicólogo(a)' },
    { value: 'Neuropsiquiatra', label: 'Neuropsiquiatra' },
    { value: 'Neurologista', label: 'Neurologista' },
    { value: 'TerapeutaOcupacional', label: 'Terapeuta Ocupacional' },
    { value: 'Psicanalista', label: 'Psicanalista' },
    { value: 'EnfermeiroPsiquiatrico', label: 'Enfermeiro(a) Psiquiátrico(a)' },
    { value: 'AssistenteSocial', label: 'Assistente Social (Saúde Mental)' },
    { value: 'Terapeuta', label: 'Terapeuta' }
  ];

  return (
    <div className="flex-col gap-16 p-4 ">
      <h2 className="text-xl font-semibold mb-2">Dados da Conta</h2>
      
      <div className="flex bg-gray-100 p-1 rounded-lg">
        <button
          className={`flex-1 p-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${isClient ? 'bg-violet-500 text-white shadow-md' : 'text-gray-600'}`}
          onClick={() => handleTypeChange('client')}
        >
          Cliente
        </button>
        <button
          className={`flex-1 p-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${!isClient ? 'bg-violet-500 text-white shadow-md' : 'text-gray-600'}`}
          onClick={() => handleTypeChange('doctor')}
        >
          Médico
        </button>
      </div>
            
      {isClient ? (
        // CAMPOS PESSOA FÍSICA
        <div className="flex flex-col gap-16">
          <CustomInput
            label="CPF"
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            mask="999.999.999-99"
            
            value={data.cpf}
            onChange={(e) => updateData({ cpf: e.target.value })}
            required
          />
          <CustomInput
            label="Data de Nascimento"
            id="birthDate"
            type="text"
            placeholder="dd/mm/aaaa"
            mask="99/99/9999"
            
            value={data.birthDate}
            onChange={(e) => updateData({ birthDate: e.target.value })}
            required
          />
        </div>
      ) : (
        // CAMPOS PESSOA JURÍDICA
        
        <div className="flex flex-col gap-16">
          <CustomInput
            label="CPF"
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            mask="999.999.999-99"
            
            value={data.cpf}
            onChange={(e) => updateData({ cpf: e.target.value })}
            required
          />
          <CustomInput
            label="CNPJ"
            id="cnpj"
            type="text"
            placeholder="00.000.000/0000-00"
            mask="99.999.999/9999-99"
            required
            // ... props e handlers
            onChange={(e) => updateData({ cnpj: e.target.value })}
            
          />
          <CustomInput
            label="Registro Médico (CRM)"
            id="crm"
            type="text"
            placeholder="CRM/UF 000000"
            required
            
            onChange={(e) => updateData({ medicalRegistration: e.target.value })}
          />
           <CustomInput
            label="Data de Nascimento"
            id="birthDate"
            type="text"
            placeholder="dd/mm/aaaa"
            mask="99/99/9999"
            
            value={data.birthDate}
            onChange={(e) => updateData({ birthDate: e.target.value })}
            required
          />
          <CustomSelect 
            id="tipoMedico"
            label='Tipo médico'
            options={mentalHealthProfessionals}
            value={data.medicalType}
            onChange={(e) => updateData({ medicalType: e.target.value as  "Psiquiatra" | 'Psicologo' | 'Neuropsiquiatra' | 'Neurologista' | 'TerapeutaOcupacional' | 'Psicanalista' | 'EnfermeiroPsiquiatrico' | 'AssistenteSocial' | 'Terapeuta' })}
            required
          />
        </div>
      )}
      
      <CustomInput
        label="Celular"
        id="phone"
        type="tel"
        placeholder="(99) 99999-9999"
        mask="(99) 99999-9999"
        value={data.phone}
        onChange={(e) => updateData({ phone: e.target.value })}
        required
      />
    </div>
  );
};

export default AccountDataForm;