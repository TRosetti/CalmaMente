import React from 'react';
import { 
  Calendar, CheckCircle, Clock, Leaf, Target, User, Award, Check, Plus
} from 'lucide-react';
import Image from 'next/image';

// --- Interfaces de Tipagem ---

interface Goal {
  id: number;
  description: string;
  progress: number; // Ex: 4
  total: number;    // Ex: 5
}

interface UserProgress {
    levelName: string; // Ex: "Semente Crescendo"
    level: number;     // Ex: 3
    progressPercent: number; // Ex: 75
    nextLevel: string; // Ex: "Flor de Lotus"
    imageUrl: string; // URL da imagem do Jardim
}



// --- Dados Mockados ---

const MOCK_USER = { name: "Usuário" };
const MOCK_CONSULTATION = {
  doctor: "Dr(a). Ana Silva",
  time: "Amanhã às 10:00",
};
const MOCK_PROGRESS: UserProgress = {
    levelName: "Semente Crescendo",
    level: 3,
    progressPercent: 65,
    nextLevel: "Flor de Lótus",
    imageUrl: "https://placehold.co/600x200/5e8e4a/ffffff?text=Jardim+Emocional+Placeholder",
};
const MOCK_GOALS: Goal[] = [
    { id: 1, description: "Concluir 5 minutos de respiração", progress: 4, total: 5 },
    { id: 2, description: "Concluir 5 minutos de respiração", progress: 5, total: 7 },
];
const MOCK_STATUS = {
    dailyWrites: 5,
    dailyTotal: 7,
    isShared: true,
};

// --- Componentes dos Cartões ---

// Card 1: Próxima Consulta
const ConsultationCard: React.FC = () => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-indigo-500 min-h-[180px] transition-all hover:shadow-xl">
    <div className="flex items-center text-indigo-700 mb-4">
      <Calendar className="w-6 h-6 mr-2" />
      <h2 className="text-xl font-bold">Próxima Consulta</h2>
    </div>
    <p className="text-lg text-gray-800 font-semibold mt-2">
      Consulta com {MOCK_CONSULTATION.doctor}
    </p>
    <p className="text-sm text-gray-500 mb-6">
      {MOCK_CONSULTATION.time}
    </p>
    <button className="w-full py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors">
      Agendar Nova Consulta
    </button>
  </div>
);

// Card 2: Jardim Emocional (Progresso)
const GardenCard: React.FC<{ progress: UserProgress }> = ({ progress }) => (
  <div className="bg-white p-4 rounded-2xl shadow-lg min-h-[180px] overflow-hidden">
    <div className="relative h-32 w-full rounded-xl overflow-hidden mb-4">
      {/* Imagem de fundo do Jardim Emocional */}
      <img 
        src={progress.imageUrl} 
        alt="Jardim Emocional" 
        className="object-cover w-full h-full"
        
      />
    </div>
    <div className='p-2'>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Jardim Emocional</h2>
        <p className="text-base font-semibold text-green-700">
            Nível {progress.level} - {progress.levelName}
        </p>
        
        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
            <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${progress.progressPercent}%` }}
                aria-label={`Progresso: ${progress.progressPercent}%`}
            ></div>
        </div>
        
        <p className="text-xs text-gray-500">
            Próximo: <span className="font-medium text-green-600">{progress.nextLevel}</span>
        </p>
    </div>
  </div>
);

// Card 3: Conteúdo em Destaque
const ContentCard: React.FC = () => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-purple-500 min-h-[180px] transition-all hover:shadow-xl">
    <h2 className="text-xl font-bold text-purple-700 mb-3">Conteúdo em Destaque</h2>
    <div className="flex items-center mb-4">
      <img 
        src="https://placehold.co/60x60/8b5cf6/ffffff?text=🧘" 
        alt="Ícone Meditação" 
        className="rounded-full mr-4" 
      />
      <div>
        <p className="text-gray-900 font-semibold leading-snug">Para você hoje: o poder Mindfulness em 5 minutos</p>
        <p className="text-xs text-gray-500 mt-1">Ler e relaxar</p>
      </div>
    </div>
    <button className="w-full py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors">
      Ler Artigo
    </button>
  </div>
);

// Card 4: Registro Rápido
const QuickEntryCard: React.FC = () => (
  <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[220px] flex flex-col justify-between transition-all hover:shadow-xl">
    <h2 className="text-xl font-bold text-violet-700 mb-4">Registro Rápido</h2>
    
    <button className="w-full flex items-center justify-center p-3 bg-violet-500 text-white font-semibold rounded-lg shadow-md hover:bg-violet-600 transition-colors mb-4">
      <Plus className="w-5 h-5 mr-2" /> + Registrar com me sinto agora
    </button>
    
    <p className="text-sm text-gray-600 mb-4">
        Escrever no diário por 7 dias seguidos <span className='font-bold text-violet-600'>5/7</span>
    </p>

    <button className="text-left text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors self-start">
      Marcar como Concluído
    </button>
  </div>
);

// Card 5: Metas Ativas
const GoalsCard: React.FC<{ goals: Goal[] }> = ({ goals }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[220px] transition-all hover:shadow-xl">
    <h2 className="text-xl font-bold text-emerald-700 mb-4">Metas Ativas</h2>
    
    <div className="space-y-3 mb-6">
      {goals.map(goal => (
        <div key={goal.id} className="flex items-center">
          <div className="text-emerald-500 mr-3">
              <CheckCircle className="w-6 h-6" />
          </div>
          <p className="flex-1 text-gray-800 text-base">
            {goal.description}
          </p>
          <span className={`font-semibold text-sm ${goal.progress === goal.total ? 'text-green-600' : 'text-gray-500'}`}>
            ({goal.progress}/{goal.total})
          </span>
        </div>
      ))}
    </div>

    <div className='flex justify-between items-center'>
        <button className="text-left text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors self-start">
            Marcar como Concluído
        </button>
        <button className="py-1.5 px-4 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors text-sm">
            Ler Artigo
        </button>
    </div>
  </div>
);

// Card 6: Status do Diário (Achievements)
const StatusCard: React.FC<{ status: typeof MOCK_STATUS }> = ({ status }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[220px] transition-all hover:shadow-xl flex flex-col justify-between">
    <h2 className="text-xl font-bold text-blue-700 mb-4">Stattuído em Diário</h2>
    
    <div className="space-y-4">
      <div className="flex items-center text-gray-800">
        <Check className="w-5 h-5 mr-3 text-green-500" />
        <p>Você escreveu <span className='font-semibold'>{status.dailyWrites}</span> vezes nos <span className='font-semibold'>{status.dailyTotal}</span> dias</p>
      </div>
      
      {status.isShared && (
          <div className="flex items-center text-gray-800">
            <Check className="w-5 h-5 mr-3 text-green-500" />
            <p>Diário compartilhado com Dr(a). Ana Silva</p>
          </div>
      )}
    </div>

    <button className="mt-4 text-left text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors self-start">
        Ver Detalhes
    </button>
  </div>
);


function HomePage({userId}: {userId: string}) {
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 lg:p-10">
      
      {/* Cabeçalho */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Olá, <span className="text-violet-600">[{MOCK_USER.name}]</span>!
        </h1>
      </header>

      {/* Grid de Cartões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Linha 1 */}
        <ConsultationCard />
        <GardenCard progress={MOCK_PROGRESS} />
        <ContentCard />
        
        {/* Linha 2 */}
        <QuickEntryCard />
        <GoalsCard goals={MOCK_GOALS} />
        <StatusCard status={MOCK_STATUS} />

      </div>

      {/* Exemplo de rodapé ou espaço extra */}
      
    </div>
  );
};

export default HomePage;