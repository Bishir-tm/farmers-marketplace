import { useState } from 'react';

const QuantitySelector = ({ value, onChange, min = 1, max, size = 'md' }) => {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    const buttonSizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const inputSizes = {
        sm: 'w-12 text-sm',
        md: 'w-16 text-base',
        lg: 'w-20 text-lg'
    };

    const handleDecrease = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrease = () => {
        if (!max || value < max) {
            onChange(value + 1);
        }
    };

    const handleInputChange = (e) => {
        const newValue = parseInt(e.target.value) || min;
        if (newValue >= min && (!max || newValue <= max)) {
            onChange(newValue);
        }
    };

    return (
        <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
            <button
                onClick={handleDecrease}
                disabled={value <= min}
                className={`${buttonSizes[size]} bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-full font-bold transition active:scale-95 flex items-center justify-center`}
                type="button"
            >
                −
            </button>
            <input
                type="number"
                value={value}
                onChange={handleInputChange}
                min={min}
                max={max}
                className={`${inputSizes[size]} text-center border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500`}
            />
            <button
                onClick={handleIncrease}
                disabled={max && value >= max}
                className={`${buttonSizes[size]} bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-full font-bold transition active:scale-95 flex items-center justify-center`}
                type="button"
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;
