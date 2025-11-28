import Image from "next/image"
import Link from "next/link"

interface MetaCardProps {
    title: string,
    progress: number,
    total: number,
    type: string,
    points: number
}

const MetaCard = ({ title, progress, total, type, points }: MetaCardProps) => { 
    const progressPercent = (progress / total) * 100;
    
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col mb-3">
            <div className="flex items-center justify-between mb-2 ">
                <p className="text-gray-800 font-semibold text-base">{title} ({progress}/{total})</p>
                <span className="text-purple-600 font-bold text-sm">{points} Pontos</span>
            </div>
            
            <div className="flex items-center space-x-3">
                {/* Indicador de Tipo de Meta */}
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    {type}
                </span>

                {/* Barra de Progresso */}
                <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-purple-500 h-2.5 rounded-full" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Ação (ex: Marcar como Concluído ou Ver detalhes) */}
            <div className="mt-3 text-right">
                {progress < total ? (
                    <button className="text-sm text-purple-600 hover:text-purple-800 transition duration-150">
                        Marcar como Realizado
                    </button>
                ) : (
                    <span className="text-sm text-green-600 font-medium">
                        Concluída! 🎉
                    </span>
                )}
            </div>
        </div>
    );
};

// Componente principal da página Jardim Emocional
export default function Jardim(){

    // Dados Mockup (simulando dados de uma API)
    const mockJardimData = {
        pontos: 85,
        nivel: 4,
        nomeNivel: "Florescer",
        progressoNivel: 75, // 75% para o próximo nível
        proximaRecompensa: "Árvore da Serinidade",
        metas: [
            { id: 1, title: "Escrever no diário", progress: 5, total: 7, type: "HÁBITO", points: 1 },
            { id: 2, title: "Caminhar na natureza", progress: 2, total: 4, type: "DESAFIO", points: 3 },
            { id: 3, title: "Meditar por 10 min", progress: 7, total: 7, type: "HÁBITO", points: 1 },
        ],
        sementesDesbloqueadas: 16, // Número de itens desbloqueados
        proximaSemente: "Lírio da Calma"
    };

    return(
        <main className="p-8 bg-gray-50 min-h-screen w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Jardim Emocional</h1>

            {/* Container Principal do Jardim, Pontos e Nível */}
            <section className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between mb-8 border border-purple-100 gap-16">
                
                {/* Coluna 1: Visual do Jardim e Pontos */}
                <div className="flex items-center space-x-6">
                    {/* Placeholder para a imagem do jardim */}
                    <Image 
                        src="/Jardim/jardim.png" // Substitua pelo seu path real
                        alt="Visualização do Jardim Emocional" 
                        width={180} 
                        height={180}
                        className="rounded-full shadow-md"
                    />
                    
                    {/* Pontos */}
                    <div className="flex-col  bg-purple-100 px-16 py-8 rounded-xl">
                        <span className="text-4xl font-extrabold text-purple-700">{mockJardimData.pontos}</span>
                        <span className="text-lg text-gray-500 block">Pontos Totais</span>
                    </div>
                </div>

                {/* Coluna 2: Nível e Progresso */}
                <div className="w-full md:w-2/5 mt-4 md:mt-0">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Nível {mockJardimData.nivel} - {mockJardimData.nomeNivel}</h2>
                    
                    {/* Barra de Progresso do Nível */}
                    <div className="bg-purple-200 rounded-full h-3 mb-2">
                        <div 
                            className="bg-purple-500 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${mockJardimData.progressoNivel}%` }}
                        ></div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                        Próxima Recompensa: **{mockJardimData.proximaRecompensa}** ({100 - mockJardimData.progressoNivel}% restante)
                    </p>
                </div>
            </section>
            
            {/* Container de Metas e Recompensas (Layout em Colunas) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Coluna 1 & 2: Minhas Metas Ativas */}
                <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700">Minhas Metas Ativas</h2>
                        <Link href="#">
                            <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition duration-200">
                                + Adicionar Nova Meta
                            </button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {mockJardimData.metas.map(meta => (
                            <MetaCard 
                                key={meta.id} 
                                title={meta.title}
                                progress={meta.progress}
                                total={meta.total}
                                type={meta.type}
                                points={meta.points}
                            />
                        ))}
                    </div>
                </section>

                {/* Coluna 3: Recompensas Desbloqueadas */}
                <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sementes Desbloqueadas</h2>
                    
                    <p className="text-gray-500 mb-4 text-sm">
                        Você já desbloqueou **{mockJardimData.sementesDesbloqueadas}** itens.
                    </p>

                    {/* Grade de Sementes/Itens (Placeholder) */}
                    <div className="grid grid-cols-4 gap-4 p-2 bg-gray-50 rounded-lg">
                        {/* Mapear itens desbloqueados - Simulação com blocos */}
                        {Array.from({ length: 16 }).map((_, index) => (
                            <div 
                                key={index} 
                                className={`w-full h-16 rounded-lg flex items-center justify-center 
                                    ${index < mockJardimData.sementesDesbloqueadas ? 'bg-green-100 border-2 border-green-400' : 'bg-gray-200 opacity-60'}`}
                            >
                                {index < mockJardimData.sementesDesbloqueadas ? '🌷' : '?'}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                            Ver todas as recompensas
                        </button>
                    </div>
                </section>
            </div>
            
        </main>
    )
}
