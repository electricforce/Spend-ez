async function obtenerTasasCambio() {
    const url = "https://v6.exchangerate-api.com/v6/d03f4330c0f7b51eee8676fb/latest/USD";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener tasas de cambio: ${response.status}`);
        }
        const data = await response.json();
        return data.conversion_rates; // Retorna las tasas de cambio
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo obtener las tasas de cambio.");
        return null;
    }
}

async function convertirMontos() {
    const tasas = await obtenerTasasCambio(); // Llamada a la API
    if (!tasas) return;

    const selectMoneda = document.getElementById("moneda");
    const monedaDestino = selectMoneda.value; // Obtener la moneda seleccionada
    const tasaConversion = tasas[monedaDestino];

    if (!tasaConversion) {
        alert("No se encontró la tasa de cambio para la moneda seleccionada.");
        return;
    }

    // Recorre la tabla y actualiza los valores
    const filas = document.querySelectorAll("#tbody tr");
    filas.forEach(fila => {
        const celdaMonto = fila.children[3]; // Suponiendo que "Monto" está en la 4ª columna
        const montoOriginal = parseFloat(celdaMonto.textContent);
        if (!isNaN(montoOriginal)) {
            const montoConvertido = (montoOriginal * tasaConversion).toFixed(2);
            celdaMonto.textContent = `${montoConvertido} ${monedaDestino}`;
        }
    });

    alert(`Los montos han sido convertidos a ${monedaDestino}.`);
}


document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("tbody");
    const tbodyAgregar = document.getElementById("tbody-agregar");
    const btnAgregar = document.getElementById("agregar");
    const btnEnviarDatos = document.getElementById("enviarDatos");
    const resultado = document.getElementById("resultado");
  
    const idPresupuesto = localStorage.getItem("idPresupuesto");
    if (!idPresupuesto) {
        resultado.textContent = "ID de presupuesto no encontrado.";
        return;
    }
  
    async function cargarCategorias() {
        try {
            const response = await fetch(`http://localhost:5004/ObtenerCategorias_?idPresupuesto=${idPresupuesto}`);
            if (response.ok) {
                const categorias = await response.json();
  
                if (categorias && categorias.length > 0) {
                    tbody.innerHTML = "";
                    categorias.forEach((categoria, index) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${categoria.nombre_Cat}</td>
                            <td>${categoria.descripcion}</td>
                            <td>${categoria.montoEstimado}</td>
                            <td data-id="${categoria.iD_Categoria}">
                                <button class="btn btn-danger eliminar-fila">Eliminar</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    resultado.textContent = "No se encontraron categorías para el presupuesto especificado.";
                }
            } else {
                resultado.textContent = `Error al cargar categorías: ${await response.text()}`;
            }
        } catch (err) {
            resultado.textContent = `Error al conectar con la API: ${err.message}`;
        }
    }
  
    await cargarCategorias();
  
    tbody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("eliminar-fila")) {
            const row = e.target.closest("tr");
            const idCategoria = row.querySelector("td[data-id]").getAttribute("data-id");
    
            if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
                try {
                    const url = `http://localhost:5004/EliminarCategoria?idCategoria=${idCategoria}&idPresupuesto=${idPresupuesto}`;
                    const response = await fetch(url, { method: "DELETE" });
                    if (!response.ok) {
                        row.remove();
                        resultado.textContent = "Categoría eliminada correctamente.";
                        await cargarCategorias();
                    } else {
                        resultado.textContent = `Error al eliminar la categoría: ${await response.text()}`;
                        
                    }
                } catch (err) {
                    resultado.textContent = `Error al conectar con la API: ${err.message}`;
                }
                
            }
        }
    });
    
  
    async function regisCategoria(event) {
        event.preventDefault();
  
        const idPresupuesto = localStorage.getItem("idPresupuesto");
        const nombreCategoria = document.getElementById("nombreCategoria").value;
        const descripcion = document.getElementById("descripcion").value;
        const montoEstimado = document.getElementById("montoEstimado").value;
  
        const categoria = {
            IDPresupuesto: idPresupuesto,
            NombreCategoria: nombreCategoria,
            Descripcion: descripcion,
            MontoEstimado: parseFloat(montoEstimado)
        };
  
        try {
            const response = await fetch("http://localhost:5004/AgregarCategoria", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoria),
            });
  
            const data = await response.json();
  
            if (response.ok) {
                alert("Categoría agregada correctamente");
                document.getElementById("categoria-form").reset();
                await cargarCategorias();
            } else {
                alert("Error: " + (data.message || "No se pudo agregar la categoría."));
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error al registrar la categoría.");
        }
    }
  
    document.getElementById("categoria-form").addEventListener('submit', regisCategoria);
  });
  
  const idUsuario = localStorage.getItem('idUsuario'); 
  