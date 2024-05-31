import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TarjetaCredito.css';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function TarjetaCredito({ isOpen, userId }) {
    if (!isOpen) return null;
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [formattedDateTime, setFormattedDateTime] = useState('');
    const [cardInfo, setCardInfo] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });
    const [expiryDate, setExpiryDate] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCardInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const formatDateTime = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        return `${year}-${month}-${day} ${hours}:00:00`;
      };
    const handleDateTimeChange = (date) => {
        setSelectedDateTime(date);
        const formatted = formatDateTime(date);
        setFormattedDateTime(formatted);
      };
    const formatExpiryDate = (expiry) => {
        return expiry.replace(/^(\d{2})(\d{0,4})$/, '$1/$2');
    };
    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
      };
    const handleDateChange = (date) => {
        setExpiryDate(date);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
        setCardInfo(prevState => ({
            ...prevState,
            expiry: formattedDate
        }));
    };

    const formatCardNumber = (number) => {
        return number.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiryDate = (expiry) => {
        return expiry.replace(/^(\d{2})(\d{0,4})$/, '$1/$2');
    };

    const validateData = () => {
        const { number, name, expiry, cvc } = cardInfo;
        if (
            number.length !== 16 ||
            !/^\d{16}$/.test(number.replace(/\s/g, '')) ||
            name.trim() === '' ||
            expiry.trim() === '' ||
            cvc.length !== 3 ||
            !/^\d{3}$/.test(cvc)
        ) {
            toast.error('Datos erróneos, por favor verificar.');
            return true;
        }
        toast.success('Datos válidos.');
        return false;
    };

    const handleSubmit = async () => {
        if (validateData()) return;

        const { number, name, expiry, cvc } = cardInfo;
        const [month, year] = expiry.split('/');
        console.log("mes",month,"año",year);
        const formattedExpiry = `${year}-${month}-01`;

        const data = {
            numero: number,
            nombre_propietario: name,
            cvc: cvc,
            fecha_vencimiento: expiry,
            usuario: userId
        };

        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                redirect: "follow"
            };

            const response = await fetch("https://backend-parqueadero-production.up.railway.app/guardarTarjeta", requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Response from server:', result);
            // Manejar el éxito, tal vez resetear el formulario o mostrar un mensaje
        } catch (error) {
            alert('Error submitting data: ' + error.message);
        }
    };

    return (
        <div className="credit-card-form">
            <div className='credit-card-card'>
                <div className='tarjetas'>
                    <div className="credit-card-front">
                        <div className="credit-card">
                            <div className='tipo-tarjeta'>
                                <div className='rccs__chip'></div>
                                <div className='rccs__card--visa'></div>
                            </div>
                            <div className="rccs__number">
                                {formatCardNumber(cardInfo.number.padEnd(16, '•'))}
                            </div>
                            <div className='parte-abajo'>
                                <div className="rccs__name">{cardInfo.name || 'YOUR NAME HERE'}</div>
                                <div className='rccs__exp'>
                                    <p>valid true</p>
                                    <div className="rccs__expiry__valid">
                                        {formatExpiryDate(cardInfo.expiry.padEnd(6, '•'))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="credit-card-back">
                        <div className="rccs__cardback">
                            <div className="rccs__card__background">
                                <div className="rccs__issuer"></div>
                                <div className="rccs__stripe"></div>
                                <div className="rccs__signature">
                                    <div className="rccs__cvc-text">CVC</div>
                                    <div className="rccs__cvc">{cardInfo.cvc.padEnd(3, '•')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='formulario'>
                    <p className='texto'>Ingresa los datos de tu tarjeta para poder continuar </p>
                    <form className='campos'>
                        <input
                            type="text"
                            className='input-Tarjeta'
                            name="number"
                            placeholder="Card Number"
                            value={cardInfo.number}
                            onChange={handleChange}
                            maxLength={16}
                        />
                        <input
                            type="text"
                            className='input-Tarjeta'
                            name="name"
                            placeholder="Name"
                            value={cardInfo.name}
                            onChange={handleChange}
                        />
                        <DatePicker
                            selected={selectedDateTime}
                            onChange={handleDateTimeChange}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            minDate={new Date()}
                            className='input-Tarjeta'
                            placeholderText="Valid Thru (MM/YYYY)"
                        />
                        <input
                            type="text"
                            className='input-Tarjeta'
                            name="cvc"
                            placeholder="CVC"
                            value={cardInfo.cvc}
                            onChange={handleChange}
                            maxLength={3}
                        />
                    </form>
                    <button onClick={handleSubmit}>Validar</button>
                </div>
            </div>
        </div>
    );
}
