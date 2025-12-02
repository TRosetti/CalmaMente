// pages/journal/index.tsx (ou components/JournalPage.tsx)

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { SimpleEditor } from '@/components/TipTap/tiptap-templates/simple/simple-editor'

// --- NOVAS INTERFACES DE TIPAGEM ---


interface JournalEntry {
  id: string; 
  title: string;
  content: string;
  date: string;
}

interface RawEntry {
  id: string;
  conteudo: string; // O campo JSON string
  dataCriacao: string; // A data como string

}

interface RawContent {
    title: string;
    html: string;
}



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
  }, [fetchEntries, id_usuario]); 

    // 2. FUNÇÃO SALVAR (POST)
    const handleSave = async () => {
        const currentUserId = id_usuario;

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
                // tipo: 'texto',
                compartilhado: false,
                humorDetectado: null,
                usuarioId: currentUserId,
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
    const handleDelete = async (id: string) => { // Tornamos a função assíncrona
        if (!window.confirm("Tem certeza que deseja deletar esta entrada?")) {
            return; // Sai se o usuário cancelar
        }
        
        try {
            // ✅ IMPLEMENTAÇÃO REAL: Chamada DELETE para o backend
            const response = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE' 
            });

            // O backend deve retornar 204 (No Content) ou 200 (OK) em caso de sucesso
            if (!response.ok) {
                // Se a exclusão falhar no servidor
                throw new Error(`Falha ao deletar diário: ${response.statusText} (${response.status})`);
            }

            // ✅ ATUALIZAÇÃO LOCAL (se o delete no backend for bem-sucedido)
            // Remove o item da lista localmente
            setEntries(prevEntries => prevEntries.filter(e => e.id !== id));
            
            // Limpa a visualização se o item deletado era o que estava sendo visualizado
            if (viewingEntry?.id === id) {
                setViewingEntry(null);
                setCurrentHtml(''); // Limpa o editor
                setNewTitle('');
            }
            
            console.log(`Diário com ID ${id} deletado com sucesso.`);

        } catch (error) {
            console.error("Erro ao deletar o diário:", error);
            alert("Erro ao deletar o diário. Verifique o console e o backend.");
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
                    // MODO DE VISUALIZAÇÃO (ENTRADA SALVA)
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-gray-800">{viewingEntry.title}</h2>
                        <p className="text-sm text-gray-600 border-b pb-2">Visualizando entrada de: {viewingEntry.date}</p>

                        <SimpleEditor 
                            // ✅ FIX: Usa o ID como chave. Se o ID mudar, o editor é recriado.
                            key={viewingEntry.id}
                            initialContent={viewingEntry.content} 
                            // Em modo de visualização pura, remova o onContentChange.
                            // onContentChange={setCurrentHtml}                            
                            editable={false} // Garante que o modo é de leitura.
                        />
                    </div>

                ) : (
                    // MODO DE CRIAÇÃO (NOVA ENTRADA)
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
                            // ✅ FIX: Usa uma chave estática diferente.
                            // Quando você clica em 'Criar Nova Entrada', o key muda (null -> 'new-entry')
                            // Quando você salva e volta para este modo, ele também é recriado.
                            key="new-entry-editor" 
                            initialContent={currentHtml} 
                            onContentChange={setCurrentHtml}
                            editable={true} // Garante que o modo é de edição.
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