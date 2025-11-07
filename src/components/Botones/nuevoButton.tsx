import { Plus } from "lucide-react";
interface NuevoButtonProps {
    onClick: () => void;
    label: string;
}
export default function NuevoButton({ onClick, label }: NuevoButtonProps) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-md cursor-pointer"
        >
            <Plus className="w-5 h-5" />
            {label}
        </button>
    );
}