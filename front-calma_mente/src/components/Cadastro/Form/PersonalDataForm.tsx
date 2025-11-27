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

  return (
    <div className="flex-col gap-16 p-4 ">
      <h2 className="text-xl font-semibold mb-2">Dados pessoais</h2>
           
            
        <ProfileImageUpload
            currentImageUrl={data.profileImageUrl} // Passa o URL atual (se existir)
            onImageChange={(imageUrl) => updateData({ profileImageUrl: imageUrl })} // Atualiza o estado
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