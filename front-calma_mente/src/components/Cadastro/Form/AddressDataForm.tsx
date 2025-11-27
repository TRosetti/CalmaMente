// forms/AddressDataForm.tsx

'use client'; // Necessário para usar Hooks (useState, useEffect)

import React, { useState, useEffect } from 'react';
import CustomInput from '@/components/UI/CustomInput';
import { FormData } from '@/types/form';
// import CustomSelect from '@/components/CustomSelect'; // Usaremos CustomSelect para o Estado/UF

interface AddressDataFormProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
}

// const UF_OPTIONS = [
//     { value: 'SP', label: 'São Paulo' },
//     { value: 'RJ', label: 'Rio de Janeiro' },
//     // ... adicione todos os estados
// ];

const AddressDataForm: React.FC<AddressDataFormProps> = ({ data, updateData }) => {
  const [isSearching, setIsSearching] = useState(false);
  
  // Função que remove a máscara do CEP (de 99999-999 para 99999999)
  const cleanZipCode = (zip: string) => zip.replace(/[^0-9]/g, '');
  const isAddressReadOnly = !!data.street;

  
  useEffect(() => {
    const fetchAddress = async (cep: string) => {
      const cleanedCep = cleanZipCode(cep);

      if (cleanedCep.length !== 8) return;

      setIsSearching(true);
      
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const addressData = await response.json();

        if (addressData.erro) {
          alert('CEP não encontrado ou inválido.');
          
          updateData({ street: '', neighborhood: '', city: '', state: '' });
        } else {
          
          updateData({
            street: addressData.logradouro,
            neighborhood: addressData.bairro,
            city: addressData.localidade,
            state: addressData.uf,
          });
        }
      } catch (error) {
        console.error('Erro ao consultar CEP:', error);
        alert('Ocorreu um erro ao buscar o endereço.');
      } finally {
        setIsSearching(false);
      }
    };
    if (data.zipCode && cleanZipCode(data.zipCode).length === 8) {
      fetchAddress(data.zipCode);
    }
  }, [data.zipCode, updateData]);

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-xl font-semibold mb-2">Endereço</h2>
           
      
      <CustomInput
        label="CEP"
        id="zipCode"
        type="text"  
        placeholder="00000-000" 
        mask='99999-999'                 
        value={data.zipCode}
        onChange={(e) => updateData({ zipCode: e.target.value })}
        required
        
        icon2={isSearching ? <span className="text-xs text-indigo-500">Buscando...</span> : null}
      />
      
      
      <CustomInput
        label="Estado (UF)"
        id="state"
        type="text"
        placeholder="SP"
        value={data.state}
        onChange={(e) => updateData({ state: e.target.value })}
        required
        readOnly={isAddressReadOnly}
        
      />

      
      <CustomInput
        label="Cidade"
        id="city"
        type="text"
        placeholder="São Paulo"
        value={data.city}
        onChange={(e) => updateData({ city: e.target.value })}
        required
        readOnly={isAddressReadOnly}
      />

      
      <CustomInput
        label="Bairro"
        id="neighborhood"
        type="text"
        placeholder="Centro"
        value={data.neighborhood}
        onChange={(e) => updateData({ neighborhood: e.target.value })}
        required
        readOnly={isAddressReadOnly}
      />
      
      
      <CustomInput
        label="Rua/Avenida"
        id="street"
        type="text"
        placeholder="Rua Exemplo, Av. Principal"
        value={data.street}
        onChange={(e) => updateData({ street: e.target.value })}
        required
        readOnly={isAddressReadOnly}
      />
      
      
      <CustomInput
        label="Número"
        id="number"
        type="text"
        placeholder="123"
        value={data.number}
        onChange={(e) => updateData({ number: e.target.value })}
        required
        
      />
            
      <CustomInput
        label="Complemento (Opcional)"
        id="complement"
        type="text"
        placeholder="Apto 101, Bloco B"
        value={data.complement}
        onChange={(e) => updateData({ complement: e.target.value })}
      />
    </div>
  );
};

export default AddressDataForm;