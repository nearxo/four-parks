import { useState } from 'react';
import Logo from '../../assets/logo.png';
import backgroundLogin from '../../assets/backgroundLogin.svg';
import './LoginDiv.css';
import { Link } from 'react-router-dom';

function LoginDiv() {
  const URL_POST = 'https://https://fourparks-one.vercel.app/obtenerCiudades/login';
  const URL_USER = '/user';
  const URL_ADMIN = '/admin';
  const URL_GERENTE = '/gerente';
  const URL_REGISTRO = 'registro';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');

  const irAOtraRuta = (url) => {
    window.location.href = url;
  };

  function login(event) {
    event.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      alert('Por favor complete todos los campos.');
      return;
    }

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      "usuario": username,
      "contrasena": password
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(URL_POST, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response);
          alert(response);
          throw new Error('Failed to fetch data');
        }
      })
      .then(data => {
        if (data && data.data) {
          const id = data.data.id;

          setUserId(id);
          console.log(id);
          localStorage.setItem('userId', id);
          promptForAccessCode(id);
        }
      })
      .catch(error => {
        console.error(error);
        alert('Usuario no válido. Intente nuevamente.');
      });

    function promptForAccessCode(userId) {
      const code = prompt("Escriba el código de acceso:");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "id": userId,
        "codigo": code
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("https://https://fourparks-one.vercel.app/obtenerCiudades/loginCodigo", requestOptions)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log(response);
            alert(response.statusText);
            throw new Error('Failed to fetch data');
          }
        })
        .then(data => {
          if (data && data.data) {
            const userId = data.data.id;
            const name = data.data.nombre;
            localStorage.setItem('userName', name);
            const userType = data.data.tipo;
            localStorage.setItem('tipo', userType);
            localStorage.setItem('userId', userId);
            let redirectUrl = URL_USER;

            // Prioridad para los tipos 2 y 3
            let foundType = false;

            for (let type of userType) {
              if (type.id === 2) {
                redirectUrl = URL_ADMIN ;
                foundType = true;
                break;
              } else if (type.id === 3) {
                redirectUrl = URL_GERENTE;
                foundType = true;
                break;
              }
            }

            if (!foundType) {
              // Si no se encontraron tipos 2 o 3, redirigir al URL_USER por defecto
              irAOtraRuta(redirectUrl);
            } else {
              irAOtraRuta(redirectUrl);
            }
          }
        })
        .catch(error => {
          console.error(error);
          alert('Usuario no válido. Intente nuevamente.');
        });

    }
  }

  return (
    <>
      <div id='container'>
        <div id='backgroundContainer'>
          <img src={backgroundLogin} alt="Background" />
        </div>
        <div id='contentContainer'>
          <img id='logo' src={Logo} alt="Logo" />
          <h2>Bienvenido!</h2>
          <label className='label'>Que placer tenerte acá </label>
          <form id='form-login'>
            <div id='username'>
              <label className='label'>Usuario</label>
              <input type='text' id='inputUsername' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div id='password'>
              <label className='label'>Contraseña</label>
              <input type='password' id='inputPassword' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type='button' id='btnIngresar' onClick={login}>Ingresar</button>
          </form>
          <Link to='/registro' className='link'>

            <p className='p'>Aún no tienes una cuenta? <a className='a' href={URL_REGISTRO}>Registrate</a></p>
          </Link>
        </div>
      </div>
    </>
  )
}

export default LoginDiv;
