'use client';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import StepIndicator, { Step } from './StepIndicator';
import AccountDataForm from './Form/AccountDataForm';
import PersonalDataForm from './Form/PersonalDataForm';
import AddressDataForm from './Form/AddressDataForm';
import AccessDataForm from './Form/AccessDataForm';
import ConfirmationForm from './Form/ConfirmationForm';
import { FormData, initialFormData } from '@/types/form';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/UI/Loading';

const STEPS: Step[] = [
  { id: 1, label: 'Dados da conta' },
  { id: 2, label: 'Dados pessoais' },
  { id: 3, label: 'Endereço' },
  { id: 4, label: 'Dados de acesso' },
  { id: 5, label: 'Confirmação' },
];

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);   

  
  const router = useRouter();
  
  const updateData = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const validateStep = (step: number, data: FormData): boolean => {

    const cleanNumber = (value: string) => value ? value.replace(/[^0-9]/g, '') : '';
    switch (step) {
      case 1:
        if (data.accountType === 'client') {

          if (cleanNumber(data.cpf).length !== 11) {
            alert('Por favor, preencha o CPF corretamente (11 dígitos).');
            return false;
          }
        } else {
          const cleanedCnpj = cleanNumber(data.cnpj);

          if (cleanedCnpj.length !== 14) { // CNPJ tem 14 dígitos (sem máscara)
            alert('Por favor, preencha o CNPJ corretamente (14 dígitos).' + "cnpj: " + cleanedCnpj + "Data.cnpj: " + data.cnpj);
            return false;
          }

          // CRM: Verificar se o campo foi preenchido (não vazio)
          if (!data.medicalRegistration || data.medicalRegistration.trim().length === 0) {
            alert('Por favor, preencha o Registro Médico (CRM).');
            return false;
          }

        }
        if (cleanNumber(data.phone).length < 10) {
          alert('Por favor, preencha o telefone corretamente (DDD + número).');
          return false;
        }
        return true;

      case 2:
        if (!data.fullName || data.fullName.split(' ').length < 2) {
          alert('Por favor, digite o nome completo.');
          return false;
        }
        if (!data.gender) {
          alert('Por favor, selecione seu gênero.');
          return false;
        }

        return true;

      case 3:
        if (
          !data.zipCode || !data.street || !data.number || !data.city || !data.state
        ) {
          alert('Por favor, preencha todos os campos obrigatórios do endereço (CEP, Rua, Número, Cidade e Estado).');
          return false;
        }

        return true;

      case 4:
        if (!data.email || !data.email.includes('@')) {
          alert('Por favor, insira um email válido.');
          return false;
        }
        if (!data.password || data.password.length < 6) {
          alert('A senha deve ter pelo menos 6 caracteres.');
          return false;
        }
        if (data.password != data.confirmPassword) {
          alert('As senhas estão diferentes.');
          return false;
        }
        return true;

      case 5:
        return true;

      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      // 1. Criar usuário no Supabase Auth
      setIsLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário no Auth.');

      const userId = authData.user.id;

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
             // Isso pode acontecer se o email precisar ser confirmado primeiro,
             // mas assumindo que não há confirmação, é um erro de sessão.
        throw new Error('Falha ao obter token de acesso para autenticar o backend.');
      }

      // 2. Enviar dados complementares para o Backend Java
      let endpoint = '';
      let body = {};

      const headers = { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <--- ENVIANDO O TOKEN AQUI
      };
      

      if (formData.accountType === 'client') {
        // Para paciente, atualizamos o usuário criado pelo Trigger
        endpoint = `http://localhost:8081/usuarios/${userId}`;
        body = {
          nome: formData.fullName,
          telefone: formData.phone,
          cpf: formData.cpf,
          dataNascimento: formData.birthDate, // Certifique-se que o formato é YYYY-MM-DD
          genero: formData.gender,
          tipo: 'paciente'
        };

        // PUT para atualizar
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Erro ao salvar dados do paciente.');

      } else {
        // Para médico, usamos o endpoint específico
        endpoint = `http://localhost:8081/medicos/completar-cadastro`;
        body = {
          usuarioId: userId,
          nome: formData.fullName,
          telefone: formData.phone,
          cpf: formData.cpf,
          dataNascimento: formData.birthDate,
          genero: formData.gender,
          crm: formData.medicalRegistration,
          cnpj: formData.cnpj,
          especialidade: formData.medicalType // Adicione campo no form se necessário
        };

        // POST para criar médico
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Erro ao salvar dados do médico.');
      }

     
      
      router.push("/");
     

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido. Verifique o console.";
        alert('Erro no cadastro: ' + errorMessage);
    }finally {
      
        setIsLoading(false); 
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      if (validateStep(currentStep, formData)) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = (): React.ReactNode => {
    switch (currentStep) {
      case 1:
        return <AccountDataForm data={formData} updateData={updateData} />;
      case 2:
        return <PersonalDataForm data={formData} updateData={updateData} />;
      case 3:
        return <AddressDataForm data={formData} updateData={updateData} />;
      case 4:
        return <AccessDataForm data={formData} updateData={updateData} />;
      case 5:
        return <ConfirmationForm data={formData} />;
      default:
        return <div>Fim do Formulário</div>;
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="flex w-full h-screen  ">
      {isLoading && ( <Loading /> )} 
      <div className="w-5/12 0 p-10 pt-20  flex flex-col items-center justify-center gap-64">
         <img src='https://jsgxzgxxiquwllivbnyp.supabase.co/storage/v1/object/public/Imagens/logo-calmamente.png' alt='Logo' />
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </div>

      <div className={` ${styles.form} w-8/12 p-16 pt-12 flex flex-col  justify-center overflow-auto`}>

        <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
        <p className="text-gray-600 mb-10">
          Selecione o tipo de conta e insira os dados para iniciar o seu cadastro.
        </p>

        <div className="flex-grow w-full ">
          {renderStepContent()}
        </div>


        <div className="flex justify-between items-center ">
          {isFirstStep ? (
            <Link href={'/login'}>
              &lt; Voltar ao login
            </Link>

          ) : (
            <button
              onClick={prevStep}

              className={`text-gray-600 font-medium cursor-pointer hover:text-indigo-600`}
            >
              &lt; Voltar
            </button>
          )}


          <button
            onClick={nextStep}
            className={`px-8 py-3 rounded-md font-bold text-white transition-colors cursor-pointer ${isLastStep ? 'bg-green-600 hover:bg-green-700' : 'bg-violet-500 hover:bg-violet-600 '}`}
          >
            {isLastStep ? 'Finalizar' : 'Continuar >'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;


