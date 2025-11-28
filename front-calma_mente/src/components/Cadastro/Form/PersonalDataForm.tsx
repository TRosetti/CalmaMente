import CustomInput from '@/components/UI/CustomInput'
import { FormData } from '@/types/form';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import CustomSelect from '@/components/UI/CustomSelect';

interface AccountDataFormProps {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
}

const PersonalDataForm: React.FC<AccountDataFormProps> = ({ data, updateData }) => {

    const genderOptions = [
      {value: 'Masculino', label: "Masculino"},
      {value: 'Feminino', label: "Feminino"},
      {value: 'Outros', label: "Outros"},
    ]

    // Função simples de máscara para data (DD/MM/AAAA)
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
        if (value.length > 8) value = value.slice(0, 8); // Limita tamanho
        
        // Adiciona as barras
        if (value.length > 4) {
            value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d+)/, '$1/$2');
        }
        
        updateData({ birthDate: value });
    };

  return (
    <div className="flex flex-col gap-6 p-4"> {/* Ajustei gap e flex-col */}
      <h2 className="text-xl font-semibold mb-2">Dados pessoais</h2>
            
        <ProfileImageUpload
            currentImageUrl={data.profileImageUrl}
            onImageChange={(imageUrl) => updateData({ profileImageUrl: imageUrl })}
        />

        <CustomInput
            label="Nome Completo"
            id="nome"
            type="text"
            placeholder="Nome Sobrenome"                  
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            required
        />
        
        {/* --- CAMPO NOVO ADICIONADO AQUI --- */}
        <CustomInput 
            label="Data de Nascimento"
            id="nascimento"
            type="text"
            placeholder="DD/MM/AAAA"
            value={data.birthDate || ''} // Garante que não quebre se for undefined
            onChange={handleDateChange} // Usa a função com máscara
            maxLength={10}
            required
        />

        <CustomSelect 
            id="genero"
            label='Gênero'
            options={genderOptions}
            value={data.gender}
            onChange={(e) => updateData({ gender: e.target.value as "Masculino" | "Feminino" | "Outros" })}
            required
        />
       
    </div>
  );
};

export default PersonalDataForm;