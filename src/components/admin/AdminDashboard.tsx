import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modules, moduleCategories, getModulesByCategory } from '@data/modulos';
import VolverButton from '@components/Botones/AtrasButton';
import type { ModuleType } from '@models/modulos';
import { ChevronDown, ChevronRight } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { moduleId } = useParams<{ moduleId?: string }>();
    const activeModule = (moduleId as ModuleType) || null;
    const navigate = useNavigate();
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['productos']);

    const ActiveComponent = modules.find(m => m.id === activeModule)?.component;

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    useEffect(()=>{
        if(!activeModule){
            setExpandedCategories([]);
        }
    }, [activeModule]);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
                    <p className="text-gray-600 mt-1">
                        Gestión de catálogos y configuraciones del sistema
                    </p>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {!activeModule ? (
                    <div className="space-y-6">
                        {moduleCategories.map(category => {
                            const CategoryIcon = category.icon;
                            const categoryModules = getModulesByCategory(category.id);
                            const isExpanded = expandedCategories.includes(category.id);

                            return (
                                <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="cursor-pointer w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`${category.color} p-3 rounded-lg shadow-md`}>
                                                <CategoryIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
                                                <p className="text-sm text-gray-500">{categoryModules.length} módulos disponibles</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="cursor-pointer text-sm text-gray-500 hidden sm:block">
                                                {isExpanded ? 'Ocultar' : 'Mostrar'}
                                            </span>
                                            {isExpanded ? (
                                                <ChevronDown className="cursor-pointer w-6 h-6 text-gray-400 transition-transform" />
                                            ) : (
                                                <ChevronRight className="cursor-pointer w-6 h-6 text-gray-400 transition-transform" />
                                            )}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white">
                                            {categoryModules.map(module => {
                                                const ModuleIcon = module.icon;
                                                return (
                                                    <button
                                                        key={module.id}
                                                        onClick={() => navigate(`/admin/dashboard/${module.id}`)}
                                                        className="bg-white cursor-pointer rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 p-6 text-left group hover:scale-105"
                                                    >
                                                        <div
                                                            className={`${module.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}
                                                        >
                                                            <ModuleIcon className="w-7 h-7 text-white" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                                                            {module.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">{module.description}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <VolverButton />
                        {ActiveComponent && <ActiveComponent />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;