const nombreTienda = "MaxiKioscoArgentina";
let inventario = [];

function cargarInventarioInicial() {
  const guardado = localStorage.getItem("inventario");

  if (guardado !== null) {
    try {
      inventario = JSON.parse(guardado);
    } catch (error) {
      inventario = [
        { nombreProducto: "Pan", cantidadProducto: 5, precioProducto: 44 },
        { nombreProducto: "Leche", cantidadProducto: 3, precioProducto: 21 },
        { nombreProducto: "Huevos", cantidadProducto: 12, precioProducto: 35 },
        { nombreProducto: "Harina", cantidadProducto: 28, precioProducto: 45 }
      ];
    }
  } else {
    inventario = [
      { nombreProducto: "Pan", cantidadProducto: 5, precioProducto: 44 },
      { nombreProducto: "Leche", cantidadProducto: 3, precioProducto: 21 },
      { nombreProducto: "Huevos", cantidadProducto: 12, precioProducto: 35 },
      { nombreProducto: "Harina", cantidadProducto: 28, precioProducto: 45 }
    ];
  }
} // visto, localStorage manejado, traigo datos, si no le cargo datos por defecto

function recargarInventario() {
  try {
    const guardado = localStorage.getItem("inventario");
    
    if (guardado !== null) {
      
      const inventarioParseado = JSON.parse(guardado);
      
      if (inventarioParseado.length > 0 && inventarioParseado[0].nombreProducto !== undefined) {
        inventario = inventarioParseado;
      } else {
        localStorage.removeItem("inventario");
      }
    }
  } catch (error) {
    mostrarMensaje("Error al cargar el inventario guardado. Usando inventario inicial.", true);
  }
} // visto, si recarga inventario, si hay error muestra mensaje

function guardarInventario() {
  try {
    localStorage.setItem("inventario", JSON.stringify(inventario));
  } catch (error) {
    mostrarMensaje("Error al guardar el inventario. Los cambios no se persistirán.", true);
  }
} // visto, guarda inventario en localStorage

function sanitizarNombre(nombre) {
  let nombreLimpio = nombre.trim(); // quita espacios al inicio y final
  nombreLimpio = nombreLimpio.replace(/[^a-zA-Z0-9\s]/g, ''); // quita caracteres especiales
  nombreLimpio = nombreLimpio.toLowerCase(); // convierte a minúsculas
  return nombreLimpio;
}

function validarNombreProducto(nombre) {
  if (nombre.length < 2 || nombre.length > 50 || /^\s*$/.test(nombre)) {
    return false;
  }
  return true;
}

function validarCantidad(cantidad) {
  const amt = Number(cantidad);
  return !Number.isNaN(amt) && amt > 0;
}

function validarPrecio(precio) {
  const amt = Number(precio);
  return !Number.isNaN(amt) && amt >= 0;
}

function encontrarProducto(productos, nombre) {
  return productos.find(producto => producto.nombreProducto === nombre);
}

function agregarProducto(productos, nombreProducto, cantidad, precioProducto) {
  if (!validarCantidad(cantidad)) {
    mostrarMensaje("Cantidad inválida para agregar.", true);
    return false;
  }

  if (!validarPrecio(precioProducto)) {
    mostrarMensaje("Precio inválido.", true);
    return false;
  }

  const nombreLimpio = sanitizarNombre(nombreProducto);
  if (!validarNombreProducto(nombreLimpio)) {
    mostrarMensaje("Nombre inválido (solo alfanuméricos y espacios, 2-50 caracteres).", true);
    return false;
  }

  const productoEncontrado = encontrarProducto(productos, nombreLimpio);

  if (productoEncontrado) {
    productoEncontrado.cantidadProducto += Number(cantidad);
    mostrarMensaje(`Producto actualizado: ${nombreLimpio} - Nueva cantidad: ${productoEncontrado.cantidadProducto}`);
  } else {
    productos.push({ nombreProducto: nombreLimpio, cantidadProducto: Number(cantidad), precioProducto: Number(precioProducto) });
    mostrarMensaje(`Producto agregado: ${nombreLimpio} - Cantidad: ${cantidad} - Precio: $${precioProducto}`);
  }

  actualizarVistaInventario();
  guardarInventario();
  return true;
}

function venderProducto(productos, nombreProducto, cantidad) {
  if (!validarCantidad(cantidad)) {
    mostrarMensaje("Cantidad inválida para vender.", true);
    return false;
  }

  const nombreLimpio = sanitizarNombre(nombreProducto);
  const productoEncontrado = encontrarProducto(productos, nombreLimpio);

  if (productoEncontrado) {
    if (productoEncontrado.cantidadProducto < Number(cantidad)) {
      mostrarMensaje("No hay suficiente inventario.", true);
      return false;
    }
    productoEncontrado.cantidadProducto -= Number(cantidad);
    mostrarMensaje(`Venta realizada: ${cantidad} x ${productoEncontrado.nombreProducto}`);
    actualizarVistaInventario();
    guardarInventario();
    return true;
  }

  mostrarMensaje("Producto no encontrado.", true);
  return false;
}

function contarProductosBajoStock(productos, umbral) {
  const th = Number(umbral);

  if (Number.isNaN(th)) {
    mostrarMensaje("Umbral inválido.", true);
    return 0;
  }

  const productosBajoStock = productos.filter(producto => producto.cantidadProducto <= th);

  mostrarMensaje(`Productos con stock <= ${th}: ${productosBajoStock.length}`);
  return productosBajoStock.length;
}

// Funciones para interfaz de usuario
function mostrarMensaje(mensaje, esError = false) {
  let className;
  if (esError) {
    className = "toast-error";
  } else {
    className = "toast-success";
  }
  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "top",
    position: "right",
    className: className,
    stopOnFocus: true,
  }).showToast();
}

function saludar(nombrePersonal) {
  const mensaje = `Hola, ${nombrePersonal}! Bienvenido a ${nombreTienda}.`;
  document.getElementById("mensajeSaludo").textContent = mensaje;
}

function mostrarTodoInventario(productos) {
  const listaInventario = document.getElementById("listaStock");
  const elementos = [];
  productos.forEach(producto => {
    elementos.push(`<div>${producto.nombreProducto} - Cant: ${producto.cantidadProducto} - Precio: $${producto.precioProducto} 
    <button onclick="editarProducto('${producto.nombreProducto}')">Editar</button> 
    <button onclick="eliminarProducto('${producto.nombreProducto}')">Eliminar</button></div>`);
  });
  listaInventario.innerHTML = elementos.join("");
}

function actualizarVistaInventario() {
  mostrarTodoInventario(inventario);
}

// Funciones para eliminar y editar productos
async function eliminarProducto(nombre) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: `¿Quieres eliminar "${nombre}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (result.isConfirmed) {
    try {
      inventario = inventario.filter(producto => producto.nombreProducto !== nombre);
      actualizarVistaInventario();
      guardarInventario();
      mostrarMensaje(`Producto "${nombre}" eliminado.`);
    } catch (error) {
      mostrarMensaje("Error al eliminar el producto.", true);
    }
  }
}

async function editarProducto(nombre) {
  try {
    const producto = encontrarProducto(inventario, nombre);
    if (!producto) return;

    const { value: nuevoNombre } = await Swal.fire({
      title: "Editar producto",
      input: "text",
      inputLabel: "Nuevo nombre del producto",
      inputValue: producto.nombreProducto,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar un nombre!";
        }
        const nombreLimpio = sanitizarNombre(value);
        if (!validarNombreProducto(nombreLimpio)) {
          return "Nombre inválido (solo alfanuméricos y espacios, 2-50 caracteres).";
        }
        if (nombreLimpio !== nombre && encontrarProducto(inventario, nombreLimpio)) {
          return "Ya existe un producto con ese nombre.";
        }
      }
    });

    if (nuevoNombre) {
      const nombreLimpio = sanitizarNombre(nuevoNombre);

      const { value: nuevaCantidad } = await Swal.fire({
        title: "Editar producto",
        input: "number",
        inputLabel: "Nueva cantidad",
        inputValue: producto.cantidadProducto,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!validarCantidad(value)) {
            return "Cantidad inválida.";
          }
        }
      });

      if (nuevaCantidad) {
        const { value: nuevoPrecio } = await Swal.fire({
          title: "Editar producto",
          input: "number",
          inputLabel: "Nuevo precio",
          inputValue: producto.precioProducto,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!validarPrecio(value)) {
              return "Precio inválido.";
            }
          }
        });

        if (nuevoPrecio !== undefined) {
          producto.nombreProducto = nombreLimpio;
          producto.cantidadProducto = Number(nuevaCantidad);
          producto.precioProducto = Number(nuevoPrecio);
          actualizarVistaInventario();
          guardarInventario();
          mostrarMensaje(`Producto editado: ${nombreLimpio}.`);
        }
      }
    }
  } catch (error) {
    mostrarMensaje("Error al editar el producto.", true);
  }
}

// Inicialización
(() => {
  cargarInventarioInicial();
  recargarInventario();
  document.getElementById("nombreKiosco").textContent = nombreTienda;
  actualizarVistaInventario();
})();

// configuración de interacciones
document.getElementById("btnIrReportes").addEventListener("click", () => {
  window.location.href = "reportes.html";
});

document.getElementById("btnSaludar").addEventListener("click", () => {
  const nombreUsuario = document.getElementById("nombreUsuario").value;
  if (nombreUsuario && nombreUsuario.trim() !== "") {
    saludar(nombreUsuario.trim());
    document.getElementById("nombreUsuario").value = ""; // limpia el input
  } else {
    mostrarMensaje("Por favor ingresa tu nombre.", true);
  }
});

document.getElementById("btnMostrarStock").addEventListener("click", () => {
  actualizarVistaInventario();
  document.getElementById("mostrarStock").scrollIntoView({ behavior: "smooth" });
  mostrarMensaje("Inventario actualizado en pantalla.");
});

document.getElementById("btnAgregar").addEventListener("click", () => {
  const nombreProducto = document.getElementById("nombreProductoAgregar").value;
  const cantidadProducto = document.getElementById("cantidadProductoAgregar").value;
  const precioProducto = document.getElementById("precioProductoAgregar").value;
  if (nombreProducto && cantidadProducto && precioProducto) {
    agregarProducto(inventario, nombreProducto.trim(), cantidadProducto, precioProducto);
    document.getElementById("nombreProductoAgregar").value = "";
    document.getElementById("cantidadProductoAgregar").value = "";
    document.getElementById("precioProductoAgregar").value = "";
  } else {
    mostrarMensaje("Completa nombre, cantidad y precio.", true);
  }
});

document.getElementById("btnVender").addEventListener("click", () => {
  const nombreProducto = document.getElementById("nombreProductoVender").value;
  const cantidadProducto = document.getElementById("cantidadProductoVender").value;

  if (nombreProducto && cantidadProducto) {
    venderProducto(inventario, nombreProducto.trim(), cantidadProducto);
    document.getElementById("nombreProductoVender").value = "";
    document.getElementById("cantidadProductoVender").value = "";
  } else {
    mostrarMensaje("Completa nombre y cantidad.", true);
  }
});

document.getElementById("btnContarBajo").addEventListener("click", () => {
  const umbral = document.getElementById("numeroUmbral").value;

  if (umbral) {
    contarProductosBajoStock(inventario, umbral);
    document.getElementById("numeroUmbral").value = ""; // limpia el input
  } else {
    mostrarMensaje("Ingresa un umbral.", true);
  }
});