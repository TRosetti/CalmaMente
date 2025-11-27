// components/Cadastro/Form/AccessDataForm.tsx

'use client'; 

import React, { useState } from 'react';
import CustomInput from '@/components/UI/CustomInput';
import { FormData } from '@/types/form';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'; 

interface AccessDataFormProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
}

// 📌 SOLUÇÃO: COMPONENTE MOVIDO PARA FORA DA FUNÇÃO PRINCIPAL
const PasswordToggleIcon = ({ isVisible, toggleVisibility }: { isVisible: boolean, toggleVisibility: () => void }) => (
  <div 
    className="cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors"
    onClick={toggleVisibility}
    title={isVisible ? "Esconder senha" : "Mostrar senha"}
  >
    {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </div>
);
// FIM da definição movida
// -------------------------------------------------------------------


const AccessDataForm: React.FC<AccessDataFormProps> = ({ data, updateData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // A função PasswordToggleIcon não existe mais aqui dentro!
  // ...

  return (
    <div className="flex flex-col gap-6 p-4">
      
      <CustomInput
        label="Email"
        id="email"
        type="email"  
        placeholder="seu.email@exemplo.com" 
        icon={<EnvelopeIcon className="h-5 w-5" />}
        value={data.email}
        onChange={(e) => updateData({ email: e.target.value })}
        required
      />
      
      
      <CustomInput
        label="Senha"
        id="password"
        type={showPassword ? "text" : "password"}  
        placeholder="••••••••" 
        icon={<LockClosedIcon className="h-5 w-5" />}
        value={data.password}
        onChange={(e) => updateData({ password: e.target.value })}
        required     
        icon2={
          <PasswordToggleIcon 
            isVisible={showPassword} 
            toggleVisibility={() => setShowPassword(!showPassword)}
          />
        }
      />
            
      <CustomInput
        label="Confirmar Senha"
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}  
        placeholder="••••••••" 
        icon={<LockClosedIcon className="h-5 w-5" />}
        value={confirmPassword}
        onChange={(e) => {
            setConfirmPassword(e.target.value)
            updateData( {confirmPassword: e.target.value })
        }}
        
        required
        icon2={
          <PasswordToggleIcon 
            isVisible={showConfirmPassword} 
            toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
      />


      {confirmPassword && data.password !== confirmPassword && (
        <p className="text-sm text-red-500 -mt-3">As senhas não coincidem.</p>
      )}
            

    </div>
  );
};

export default AccessDataForm;