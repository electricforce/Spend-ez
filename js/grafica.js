
const comboBox = document.getElementById('anio');


const opcionVacia = document.createElement('option');
opcionVacia.value = "";
opcionVacia.textContent = "Seleccione un año";
comboBox.appendChild(opcionVacia);


for (let year = 2000; year <= 2024; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    comboBox.appendChild(option);
}

let chartInstance;

async function obtenerGastos() {
    const anioSeleccionado = comboBox.value;
    const idUsuario = 13;

    try {
        const response = await fetch(`http://localhost:5004/GastosPorMes?idUsuario=${idUsuario}&anio=${anioSeleccionado}`);
        const gastos = await response.json();

        if (Array.isArray(gastos) && gastos.length > 0) {
            return gastos;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return [];
    }
}

function configurarCanvasParaDPI(canvas) {
    const ctx = canvas.getContext('2d');
    const dpi = window.devicePixelRatio || 1;

    // Ajustar el tamaño del canvas para alta resolución
    const styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    const styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

    canvas.width = styleWidth * dpi;
    canvas.height = styleHeight * dpi;
    ctx.scale(dpi, dpi);

    return ctx;
}

async function crearGrafica() {
    const gastos = await obtenerGastos();
    const canvas = document.getElementById('gastosChart');
    const ctx = configurarCanvasParaDPI(canvas);

    // Limpiar gráfico existente si ya hay uno
    if (chartInstance) {
        chartInstance.destroy();
    }

    if (gastos.length > 0) {
        const meses = gastos.map(gasto => gasto.mes);
        const montos = gastos.map(gasto => gasto.totalMonto);

        // Crear el gráfico
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Monto gastado',
                    data: montos,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Arial'; 
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos disponibles para el año seleccionado.', canvas.width / 2 / window.devicePixelRatio, canvas.height / 2 / window.devicePixelRatio);
    }
}


comboBox.addEventListener('change', crearGrafica);


window.onload = crearGrafica;
