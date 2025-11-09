import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

const CartItem = ({ id, name, price, quantity, image, onUpdateQuantity, onRemove }: CartItemProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
            <img
                src={image}
                alt={name}
                className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
                <p className="text-orange-600 font-bold text-lg">${price.toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end justify-between">
                <button
                    onClick={() => onRemove(id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label="Eliminar producto"
                >
                    <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => onUpdateQuantity(id, quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                        aria-label="Disminuir cantidad"
                        disabled={quantity <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                        onClick={() => onUpdateQuantity(id, quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                        aria-label="Aumentar cantidad"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;