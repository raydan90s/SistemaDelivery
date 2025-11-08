import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modules } from '@data/modulos';
import VolverButton from '@components/Botones/AtrasButton';
import type { ModuleType } from '@models/modulos';

const AdminDashboard: React.FC = () => {
    const { moduleId } = useParams<{ moduleId?: string }>();
    const activeModule = (moduleId as ModuleType) || null;
    const navigate = useNavigate();

    const ActiveComponent = modules.find(m => m.id === activeModule)?.component;

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modules.map((module) => {
                            const Icon = module.icon;
                            return (
                                <button
                                    key={module.id}
                                    onClick={() => navigate(`/admin/dashboard/${module.id}`)}
                                    className="bg-white cursor-pointer rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-left group hover:scale-105"
                                >
                                    <div
                                        className={`${module.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {module.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{module.description}</p>
                                </button>
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
