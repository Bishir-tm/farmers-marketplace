import { createContext, useState, useContext, useCallback } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }
    const [dialog, setDialog] = useState(null); // { title, message, onConfirm, onCancel }

    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const showDialog = useCallback(({ title, message, onConfirm, onCancel }) => {
        setDialog({ title, message, onConfirm, onCancel });
    }, []);

    const closeDialog = useCallback(() => {
        setDialog(null);
    }, []);

    const handleConfirm = () => {
        if (dialog?.onConfirm) dialog.onConfirm();
        closeDialog();
    };

    const handleCancel = () => {
        if (dialog?.onCancel) dialog.onCancel();
        closeDialog();
    };

    return (
        <UIContext.Provider value={{ showToast, showDialog }}>
            {children}
            
            {/* Toast Container */}
            {toast && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl text-white font-medium z-50 transition-all duration-300 animate-slide-up ${
                    toast.type === 'error' ? 'bg-red-500' : 
                    toast.type === 'success' ? 'bg-green-600' : 'bg-gray-800'
                }`}>
                    {toast.message}
                </div>
            )}

            {/* Dialog Container */}
            {dialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={handleCancel}></div>
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 z-10 animate-fade-in relative transform transition-all">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{dialog.title}</h3>
                        <p className="text-gray-600 mb-6">{dialog.message}</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={handleCancel}
                                className="px-5 py-2 rounded-full text-green-700 font-medium hover:bg-green-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className="px-5 py-2 rounded-full bg-green-600 text-white font-bold shadow-md hover:bg-green-700 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UIContext.Provider>
    );
};
