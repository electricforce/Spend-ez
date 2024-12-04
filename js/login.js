const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('loginbtn');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

async function loguearUsuario(event) {
    event.preventDefault();

    const emailU = document.getElementById('email').value;
    const passwordU = document.getElementById('password').value;
    const nombre = null;

    const url = `http://localhost:5004/loguearUsuario?emailU=${encodeURIComponent(emailU)}&password=${encodeURIComponent(passwordU)}&nomIniU=${encodeURIComponent(nombre)}`;
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de login:', errorData.Mensaje);
            alert('Error de login: ' + errorData.Mensaje);
            return;
        }

        const data = await response.json();
        console.log('Datos recibidos del servidor:', data);

        if (data && data.length > 0) {
            const idUsuario = data[0].idUsuario;
            localStorage.setItem('idUsuario', idUsuario);
            console.log('Login exitoso:', idUsuario);
            alert('Login exitoso');
            window.location.href = 'home.html';
        } else {
            alert('Usuario no encontrado');
        }

    } catch (err) {
        console.error("Error en la comunicación del API", err);
        alert('Ocurrió un error inesperado');
    }
}

document.getElementById("login").addEventListener('submit', loguearUsuario);


async function regisUsuario(event) {
    event.preventDefault();
 
    const nombreU = document.getElementById("nombre").value;
    const emailU = document.getElementById("emailregis").value;
    const passwordU = document.getElementById("contrasenia").value;
    const apellidoU = document.getElementById("apellido").value;
    const nomIniU = document.getElementById("usuario").value;

    const url = "http://localhost:5004/RegistrarUsuario";

    // Crear un objeto FormData
    const formData = new FormData();
    formData.append("emailU", emailU);
    formData.append("passwordU", passwordU);
    formData.append("nombreU", nombreU);
    formData.append("apellidoU", apellidoU);
    formData.append("nomIniU", nomIniU);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData 
        });

        const alertMessage = document.getElementById("alert-message");
        const alertContainer = document.getElementById("alert-container");

        if (!response.ok) {
            const errorData = await response.json();
            alertMessage.textContent = errorData.Mensaje || 'Error';
            alertMessage.className = "alert alert-danger";
            alertContainer.classList.remove("d-none");
            return;
        }

        const datos = await response.json();
        console.log('Usuario registrado: ', datos);

        alertMessage.textContent = "Usuario registrado con éxito";
        alertMessage.className = "alert alert-success";
        alertContainer.classList.remove("d-none");

        document.getElementById("registro-form").reset();
    } catch (error) {
        console.error('Error en registrar el usuario: ', error);

        const alertMessage = document.getElementById("alert-message");
        const alertContainer = document.getElementById("alert-container");

        alertMessage.textContent = "Error al registrar el usuario. Intenta nuevamente.";
        alertMessage.className = "alert alert-danger";
        alertContainer.classList.remove("d-none");
    }
}

document.getElementById("registro-form").addEventListener('submit', regisUsuario);