import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FinalizarReserva.css';

export default function FinalizarReserva({ isOpen, onClose }) {
    const nombre = localStorage.getItem('userName');
    const [codigo, setCodigo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCodigoChange = (e) => {
        setCodigo(e.target.value);
    };

    const handleSubmit = async () => {
        if (!codigo) {
            toast.error('Ingrese un código');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080//ocuparCupo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo }),
            });

            const data = await response.json();
            if (response.ok && data.data.ocupado) {
                toast.success(`Cupo ocupado con éxito. Código: ${codigo}`);
            } else {
                toast.error(data.msg || 'Error al ocupar el cupo');
            }
        } catch (error) {
            toast.error('Error en la reserva, intente nuevamente');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="reservaCupoOff-backdrop">
            <div className="reservaCupoOff-container">
                <ToastContainer />
                <h1>Finalizar Reserva</h1>
                <h2>{nombre}</h2>
                <div className="reservaCupoOff-cupos">
                    <input 
                        type="text" 
                        id="codigo" 
                        value={codigo} 
                        onChange={handleCodigoChange} 
                        placeholder="Ingrese el código" 
                    />
                </div>

                <button 
                    className='reservaCupoOff-continuar' 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Ocupando...' : 'Continuar'}
                </button>
                <button className='reservaCupoOff-cerrar' onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
}
