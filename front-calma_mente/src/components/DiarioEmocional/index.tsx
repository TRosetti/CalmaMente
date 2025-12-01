// pages/journal/index.tsx (ou components/JournalPage.tsx)

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { SimpleEditor } from '@/components/TipTap/tiptap-templates/simple/simple-editor'

// --- NOVAS INTERFACES DE TIPAGEM ---

// 1. Interface para o objeto de entrada Mapeada (seu estado)
interface JournalEntry {
  id: string; // IDs devem ser string para corresponder ao UUID do backend
  title: string;
  content: string; // Conteúdo HTML
  date: string;
}

// 2. Interface para o objeto de dados BRUTOS retornado pelo backend (diario)
// Isso resolve o erro 'any' no .map()
interface RawEntry {
  id: string;
  conteudo: string; // O campo JSON string
  dataCriacao: string; // A data como string
  // Adicione outros campos, se houverem (ex: tipo, compartilhado, etc.)
}

// 3. Interface para o objeto dentro da string JSON de 'conteudo'
interface RawContent {
    title: string;
    html: string;
}

// 4. Interface para o Payload de Autenticação
// Isso resolve o erro 'Property 'uid' does not exist on type 'JWTPayload''
// Assumimos que 'getAuthPayload' retorna um objeto com 'uid'
interface CustomAuthPayload {
    uid: string; // A propriedade que você está usando
    // Outros campos do JWT (exp, iat, etc.)
}
// Certifique-se de que a função `getAuthPayload` está definida em '@/lib/auth' para retornar Promise<CustomAuthPayload | null>
// Ex: export const getAuthPayload = (): Promise<CustomAuthPayload | null> => { ... };

// --- CONSTANTES ---

const API_URL = 'http://localhost:8081/diario'; 
const TEST_USER_ID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; 

// --- COMPONENTE PRINCIPAL ---

function DiarioEmocional({id_usuario}: {id_usuario: string}) {
 
  const [userId, setUserId] = useState<string | null>(TEST_USER_ID); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [newTitle, setNewTitle] = useState('');
  const [currentHtml, setCurrentHtml] = React.useState('');  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  // 1. CARREGAR ID DO USUÁRIO E ENTRADAS
  const fetchEntries = useCallback(async (currentUserId: string) => {
      if (!currentUserId) return;
      setIsLoading(true);
      try {
          const response = await fetch(`${API_URL}/usuario/${currentUserId}`); 
          
          if (!response.ok) {
              if (response.status === 404) {
                 setEntries([]);
                 return;
              }
              throw new Error(`Erro ao buscar diários: ${response.statusText}`);
          }

          // Tipando 'data' como um array de RawEntry
          const data: RawEntry[] = await response.json();
          
          // Mapear os dados do backend para a interface JournalEntry do frontend
          // RESOLUÇÃO DO ERRO 'any': O parâmetro 'diario' agora é tipado como RawEntry
          const mappedEntries: JournalEntry[] = data.map((diario: RawEntry) => {
              // Tipando o resultado do JSON.parse
              const contentObj: RawContent = JSON.parse(diario.conteudo);
              
              return {
                  id: diario.id,
                  title: contentObj.title || 'Sem Título',
                  content: contentObj.html, 
                  date: new Date(diario.dataCriacao).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
              };
          });

          setEntries(mappedEntries);
      } catch (error) {
          console.error("Erro ao buscar as entradas:", error);
      } finally {
          setIsLoading(false);
      }
  }, []);

  // Carrega o user ID e busca as entradas ao montar o componente
  useEffect(() => {
    async function initialize() {
      try {
         
        setUserId(id_usuario);
        fetchEntries(id_usuario);
      } catch (e) {
        console.error("Falha ao obter payload de autenticação", e);
        setUserId(TEST_USER_ID);
        fetchEntries(TEST_USER_ID);
      }
    }
    initialize();
  }, [fetchEntries]); 

  // ... [Resto do código omitido para brevidade, pois a lógica não foi alterada] ...

    // 2. FUNÇÃO SALVAR (POST)
    const handleSave = async () => {
        // Usamos currentHtml do SimpleEditor
        if (!newTitle.trim() || !currentHtml.trim()) {
            alert("Título e conteúdo do diário não podem estar vazios.");
            return;
        }

        try {
            // Prepara o payload para o Spring Boot
            const payload = {
                conteudo: JSON.stringify({ 
                    title: newTitle.trim(), 
                    html: currentHtml 
                } as RawContent), // Tipagem para garantir a estrutura
                tipo: 'texto',
                compartilhado: false,
                humorDetectado: null,
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar diário: ${response.statusText} (${response.status})`);
            }

            fetchEntries(userId || TEST_USER_ID); 
            
            setNewTitle('');
            setCurrentHtml('');
            setViewingEntry(null); 
            console.log("Diário salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar o diário:", error);
            alert("Erro ao salvar o diário. Verifique o console e o backend.");
        }
    };


    // 3. FUNÇÃO DELETAR (DELETE)
    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja deletar esta entrada?")) {
            setEntries(entries.filter(e => e.id !== id));
            if (viewingEntry?.id === id) setViewingEntry(null);
        }
    };


    const handleSelectEntry = (entry: JournalEntry) => {
        setViewingEntry(entry);
        setCurrentHtml(entry.content); 
    };
    
    const startNewEntry = () => {
        setViewingEntry(null);
        setNewTitle('');
        setCurrentHtml('');
    };


    if (isLoading) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen w-full flex justify-center items-center">
                <p className="text-xl font-semibold text-violet-600">Carregando diários...</p>
            </div>
        );
    }


    return (
        <div className="p-8 bg-gray-50 min-h-screen w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-4">
            Diário emocional
        </h1>

        <div className="flex gap-16">
            
            {/* 📌 COLUNA ESQUERDA: LISTA DE DIÁRIOS ESCRITOS */}
            <div className="w-1/3 space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-violet-700">Meu Diário</h2>
            
            <button 
                onClick={startNewEntry}
                className="w-full flex items-center justify-center p-3 mb-4 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-800 transition-colors cursor-pointer"
            >
                <PlusIcon className="w-5 h-5 mr-2" /> Criar Nova Entrada
            </button>
            
            <div className="space-y-3 max-h-[70vh] overflow-y-auto ">
                {entries.length === 0 ? (
                    <p className="text-gray-500 text-center p-4 border rounded-lg bg-white">Nenhuma entrada encontrada. Comece a escrever!</p>
                ) : (
                    entries.map(entry => (
                    <div
                        key={entry.id}
                        onClick={() => handleSelectEntry(entry)}
                        className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex justify-between items-center
                        ${viewingEntry?.id === entry.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 bg-white hover:bg-gray-100'}
                        `}
                    >
                        <div>
                            <p className="font-semibold text-gray-800">{entry.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{entry.date}</p>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                            title="Excluir"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                    ))
                )}
            </div>
            </div>

            {/* 📌 COLUNA DIREITA: EDITOR / VISUALIZADOR */}
            <div className="w-2/3 space-y-4">
                
                {viewingEntry ? (
                    // MODO DE VISUALIZAÇÃO
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800">{viewingEntry.title}</h2>
                        <p className="text-sm text-gray-600 border-b pb-2">Visualizando entrada de: {viewingEntry.date}</p>

                        <SimpleEditor 
                            initialContent={viewingEntry.content} 
                            onContentChange={setCurrentHtml}
                            // editable={false} 
                        />
                    </div>

                ) : (
                    // MODO DE CRIAÇÃO
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-violet-700">Nova Entrada</h2>
                        
                        <input
                            type="text"
                            placeholder="Digite o título do seu diário..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-lg font-semibold focus:ring-indigo-500 focus:border-indigo-500"
                            maxLength={100}
                        />
                        
                        <SimpleEditor 
                            initialContent={currentHtml} 
                            onContentChange={setCurrentHtml}
                            // editable={true} 
                        />

                        <button 
                            onClick={handleSave}
                            className="w-full py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                        >
                            Salvar Diário
                        </button>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default DiarioEmocional;