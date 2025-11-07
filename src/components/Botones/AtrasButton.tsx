import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VolverButtonProps {
    label?: string;
    className?: string;
}

export default function VolverButton({ label = "Volver", className = "" }: VolverButtonProps) {
    const navigate = useNavigate();
    const handleVolver = () => {
        navigate(-1);
    };
    return (
        <button
            onClick={handleVolver}
            className={`px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-md cursor-pointer ${className}`}
        >
            <ArrowLeft className="w-5 h-5" />
            {label}
        </button>
    );
}