const nombreTienda = "MaxiKioscoArgentina";
let inventario = [];

function cargarInventarioInicial() {
  const guardado = localStorage.getItem("inventario");

  if (guardado !== null) {
    try {
      inventario = JSON.parse(guardado);
    } catch (error) {
      inventario = [
        { nombreProducto: "pan", cantidadProducto: 5, precioProducto: 44 },
        { nombreProducto: "leche", cantidadProducto: 3, precioProducto: 21 },
        { nombreProducto: "huevos", cantidadProducto: 12, precioProducto: 35 },
        { nombreProducto: "harina", cantidadProducto: 28, precioProducto: 45 }
      ];
    }
  } else {
    inventario = [
      { nombreProducto: "pan", cantidadProducto: 5, precioProducto: 44 },
      { nombreProducto: "leche", cantidadProducto: 3, precioProducto: 21 },
      { nombreProducto: "huevos", cantidadProducto: 12, precioProducto: 35 },
      { nombreProducto: "harina", cantidadProducto: 28, precioProducto: 45 }
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
} // visto, quita caracteres especiales y espacios innecesarios

function validarNombreProducto(nombre) {
  if (nombre.length < 2 || nombre.length > 50) { // Google me dio || /^\s*$/.test(nombre) como opcion para limpiar espacios, me parecio mala practica
    return false;
  }
  return true;
} // visto, este bloque se ejecuta despues de que el nombre se haya sanitizado

function validarCantidad(cantidad) {
  const num = Number(cantidad);

  if (!Number.isNaN(num) && num > 0) {
    return true;
  }

  return false;
} // visto, valida que la cantidad sea un numero positivo y que sea un numero

function validarPrecio(precio) {
  const num = Number(precio);

  if (!Number.isNaN(num) && num >= 0) {
    return true;
  }

  return false;
} // visto, valida que el precio sea un numero positivo o cero y que sea un numero

function encontrarProducto(productos, nombre) {
  const productoEncontrado = productos.find(producto => producto.nombreProducto === nombre);
  return productoEncontrado;
} // visto, busca un producto por nombre y lo devuelve o undefined

function agregarProducto(productos, nombreProducto, cantidad, precioProducto) {

  if (validarCantidad(cantidad) === false) {
    mostrarMensaje("Cantidad inválida para agregar.", true);
    return false;
  }

  if (validarPrecio(precioProducto) === false) {
    mostrarMensaje("Precio inválido.", true);
    return false;
  }

  const nombreLimpio = sanitizarNombre(nombreProducto);

  if (validarNombreProducto(nombreLimpio) === false) {
    mostrarMensaje("Nombre inválido (solo alfanuméricos y espacios, 2-50 caracteres).", true);
    return false;
  }

  const productoEncontrado = encontrarProducto(productos, nombreLimpio);

  if (productoEncontrado !== undefined) {
    productoEncontrado.cantidadProducto = productoEncontrado.cantidadProducto + Number(cantidad);
    mostrarMensaje(`Producto actualizado: ${nombreLimpio} - Nueva cantidad: ${productoEncontrado.cantidadProducto}`);
  } else {
    productos.push({ nombreProducto: nombreLimpio, cantidadProducto: Number(cantidad), precioProducto: Number(precioProducto) });
    mostrarMensaje(`Producto agregado: ${nombreLimpio} - Cantidad: ${cantidad} - Precio: $${precioProducto}`);
  }

  actualizarVistaInventario(); // me actualiza la vista del inventario
  guardarInventario(); // me guarda el inventario actualizado

  return true;
} // visto, agrega producto si no existe, si existe actualiza cantidad

function venderProducto(productos, nombreProducto, cantidad) {

  if (validarCantidad(cantidad) === false) {
    mostrarMensaje("Cantidad inválida para vender.", true);
    return false;
  }

  const nombreLimpio = sanitizarNombre(nombreProducto);
  const productoEncontrado = encontrarProducto(productos, nombreLimpio);

  if (productoEncontrado !== undefined) {

    if (productoEncontrado.cantidadProducto < Number(cantidad)) {
      mostrarMensaje("No hay suficiente inventario.", true);
      return false;
    }

    productoEncontrado.cantidadProducto = productoEncontrado.cantidadProducto - Number(cantidad);

    if (productoEncontrado.cantidadProducto <= 0) {
      productos = productos.filter(producto => producto.nombreProducto !== productoEncontrado.nombreProducto);
    }

    mostrarMensaje(`Venta realizada: ${cantidad} x ${productoEncontrado.nombreProducto}`);
    actualizarVistaInventario();
    guardarInventario();

    return true;
  } else {
    mostrarMensaje("Producto no encontrado.", true);
    return false;
  }
} // visto, vende producto si hay suficiente stock, si no muestra error

function contarProductosBajoStock(productos, umbral) {
  const num = Number(umbral);

  if (Number.isNaN(num)) {
    mostrarMensaje("Umbral inválido.", true);
    return 0;
  }

  const productosBajoStock = productos.filter(producto => producto.cantidadProducto <= num);
  mostrarMensaje(`Productos con stock <= ${num}: ${productosBajoStock.length}`);

  return productosBajoStock.length;
} // visto, cuenta productos bajo stock segun umbral

// Funciones para interfaz de usuario
function mostrarMensaje(mensaje, esError = false) {
  let className;

  if (esError === true) {
    className = "toast-error";
  } else {
    className = "toast-success";
  }

  Toastify({
    text: mensaje,
    duration: 3000,
    style: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999
    },
    className: className,
  }).showToast();
} // visto, muestra mensajes de exito o error usando Toastify

function saludar(nombrePersonal) {
  const mensaje = `Hola, ${nombrePersonal}! Bienvenido a ${nombreTienda}.`;
  document.getElementById("mensajeSaludo").textContent = mensaje;
} // visto, muestra mensaje de saludo personalizado

function mostrarTodoInventario(productos) {
  const listaInventario = document.getElementById("listaStock");
  const elementos = [];

  productos.forEach(producto => {
    elementos.push(`<div>${producto.nombreProducto} - Cant: ${producto.cantidadProducto} - Precio: $${producto.precioProducto} 
    <button onclick="prepararEdicion('${producto.nombreProducto}')">Editar</button> 
    <button onclick="eliminarProducto('${producto.nombreProducto}')">Eliminar</button></div>`);
  });

  listaInventario.innerHTML = elementos.join("");
} // visto, muestra todo el inventario en la seccion correspondiente

function actualizarVistaInventario() {
  mostrarTodoInventario(inventario);
} // visto, actualiza la vista del inventario

// Funciones para eliminar y editar productos
function eliminarProducto(nombre) {
  inventario = inventario.filter(producto => producto.nombreProducto !== nombre);
  actualizarVistaInventario();
  guardarInventario();
  mostrarMensaje(`Producto "${nombre}" eliminado.`);
} // visto, elimina producto del inventario

function prepararEdicion(nombre) {
  const producto = encontrarProducto(inventario, nombre);

  if (producto === undefined) {
    mostrarMensaje("Producto no encontrado para edición.", true);
    return;
  }

  document.getElementById("nombreProductoEditar").value = producto.nombreProducto;
  document.getElementById("cantidadProductoEditar").value = producto.cantidadProducto;
  document.getElementById("precioProductoEditar").value = producto.precioProducto;

  mostrarMensaje("Campos de edición llenados. Modifica cantidad y precio, luego presiona 'Editar Producto'.");
} // visto, prepara los inputs de edicion con los valores del producto seleccionado

function editarProducto() {
  try {
    const nombre = document.getElementById("nombreProductoEditar").value.toLowerCase();

    if (nombre === "") {
      mostrarMensaje("Selecciona un producto para editar.", true);
      return;
    }

    const producto = encontrarProducto(inventario, nombre);

    if (!producto) {
      mostrarMensaje("Producto no encontrado.", true);
      return;
    }

    const nuevaCantidad = document.getElementById("cantidadProductoEditar").value;
    if (!nuevaCantidad || !validarCantidad(nuevaCantidad)) {
      mostrarMensaje("Cantidad inválida.", true);
      return;
    }

    const nuevoPrecio = document.getElementById("precioProductoEditar").value;
    if (nuevoPrecio === "" || !validarPrecio(nuevoPrecio)) {
      mostrarMensaje("Precio inválido.", true);
      return;
    }

    producto.cantidadProducto = Number(nuevaCantidad);
    producto.precioProducto = Number(nuevoPrecio);
    actualizarVistaInventario();
    guardarInventario();
    mostrarMensaje(`Producto editado: ${nombre}.`);

    // Limpiar inputs
    document.getElementById("nombreProductoEditar").value = "";
    document.getElementById("cantidadProductoEditar").value = "";
    document.getElementById("precioProductoEditar").value = "";
  } catch (error) {
    mostrarMensaje("Error al editar el producto.", true);
  }
}

// Inicia
cargarInventarioInicial();
recargarInventario();
document.getElementById("nombreKiosco").textContent = nombreTienda;
actualizarVistaInventario();

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

document.getElementById("btnEditar").addEventListener("click", () => {
  editarProducto();
});