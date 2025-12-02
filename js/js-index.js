const nombreTienda = 'MaxiKioscoArgentina';

// Inventario inicial (será reemplazado por recargarInventario si hay datos guardados)
let inventario = [
  {
    nombreProducto: 'Pan',
    cantidadProducto: 5,
    precioProducto: 44
  },
  {
    nombreProducto: 'Leche',
    cantidadProducto: 3,
    precioProducto: 21
  },
  {
    nombreProducto: 'Huevos',
    cantidadProducto: 12,
    precioProducto: 35
  },
  {
    nombreProducto: 'Harina',
    cantidadProducto: 28,
    precioProducto: 45
  }
];

// Funciones para gestión de datos (inventario y persistencia)
function recargarInventario() {
  try {
    const guardado = localStorage.getItem('inventario');
    if (guardado) {
      const inventarioParseado = JSON.parse(guardado);
      // Verifico si el inventario guardado usa los nombres de propiedades correctos
      if (inventarioParseado.length > 0 && inventarioParseado[0].nombreProducto !== undefined) {
        inventario = inventarioParseado;
      } else {
        localStorage.removeItem('inventario'); // limpio el localStorage viejo
      }
    }
  } catch (error) {
    mostrarMensaje('Error al cargar el inventario guardado. Usando inventario inicial.', true);
  }
}

function guardarInventario() {
  try {
    localStorage.setItem('inventario', JSON.stringify(inventario));
  } catch (error) {
    mostrarMensaje('Error al guardar el inventario. Los cambios no se persistirán.', true);
  }
}

// Funciones auxiliares para validación y sanitización
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

function encontrarProducto(productos, nombre) {
  return productos.find(producto => producto.nombreProducto === nombre);
}

function agregarProducto(productos, nombreProducto, cantidad) {
  if (!validarCantidad(cantidad)) {
    mostrarMensaje('Cantidad inválida para agregar.', true);
    return false;
  }

  const nombreLimpio = sanitizarNombre(nombreProducto);
  if (!validarNombreProducto(nombreLimpio)) {
    mostrarMensaje('Nombre inválido (solo alfanuméricos y espacios, 2-50 caracteres).', true);
    return false;
  }

  const productoEncontrado = encontrarProducto(productos, nombreLimpio);

  if (productoEncontrado) {
    productoEncontrado.cantidadProducto += Number(cantidad);
    mostrarMensaje(`Producto actualizado: ${nombreLimpio} - Nueva cantidad: ${productoEncontrado.cantidadProducto}`);
  } else {
    productos.push({ nombreProducto: nombreLimpio, cantidadProducto: Number(cantidad), precioProducto: 0 });
    mostrarMensaje(`Producto agregado: ${nombreLimpio} - Cantidad: ${cantidad}`);
  }

  actualizarVistaInventario();
  guardarInventario();
  return true;
}

function venderProducto(productos, nombreProducto, cantidad) {
  if (!validarCantidad(cantidad)) {
    mostrarMensaje('Cantidad inválida para vender.', true);
    return false;
  }

  const nombreLimpio = sanitizarNombre(nombreProducto);
  const productoEncontrado = encontrarProducto(productos, nombreLimpio);

  if (productoEncontrado) {
    if (productoEncontrado.cantidadProducto < Number(cantidad)) {
      mostrarMensaje('No hay suficiente inventario.', true);
      return false;
    }
    productoEncontrado.cantidadProducto -= Number(cantidad);
    mostrarMensaje(`Venta realizada: ${cantidad} x ${productoEncontrado.nombreProducto}`);
    actualizarVistaInventario();
    guardarInventario();
    return true;
  }

  mostrarMensaje('Producto no encontrado.', true);
  return false;
}

function contarProductosBajoStock(productos, umbral) {
  const th = Number(umbral);

  if (Number.isNaN(th)) {
    mostrarMensaje('Umbral inválido.', true);
    return 0;
  }

  const productosBajoStock = productos.filter(producto => producto.cantidadProducto <= th);

  mostrarMensaje(`Productos con stock <= ${th}: ${productosBajoStock.length}`);
  return productosBajoStock.length;
}

// Funciones para interfaz de usuario
function mostrarMensaje(mensaje, esError = false) {
  try {
    const resultados = document.getElementById('results');
    const clase = esError ? 'mensaje-error' : 'mensaje-exito';
    resultados.innerHTML = `<p class="${clase}">${mensaje}</p>`;
  } catch (error) {
    console.error('Error al mostrar mensaje:', error);
  }
}

function saludar(nombrePersonal) {
  try {
    const mensaje = `Hola, ${nombrePersonal}! Bienvenido a ${nombreTienda}.`;
    document.getElementById('greetMessage').textContent = mensaje;
  } catch (error) {
    console.error('Error al saludar:', error);
  }
}

function mostrarTodoInventario(productos) {
  try {
    const listaInventario = document.getElementById('stockList');
    listaInventario.innerHTML = productos.map(producto => 
      `<div>${producto.nombreProducto} - Cant: ${producto.cantidadProducto} - Precio: $${producto.precioProducto} 
      <button onclick="editarProducto('${producto.nombreProducto}')">Editar</button> 
      <button onclick="eliminarProducto('${producto.nombreProducto}')">Eliminar</button></div>`
    ).join('');
  } catch (error) {
    console.error('Error al mostrar inventario:', error);
  }
}

function actualizarVistaInventario() {
  mostrarTodoInventario(inventario);
}

// Funciones para eliminar y editar productos
function eliminarProducto(nombre) {
  try {
    if (confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      inventario = inventario.filter(producto => producto.nombreProducto !== nombre);
      actualizarVistaInventario();
      guardarInventario();
      mostrarMensaje(`Producto "${nombre}" eliminado.`);
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    mostrarMensaje('Error al eliminar el producto.', true);
  }
}

function editarProducto(nombre) {
  try {
    const producto = encontrarProducto(inventario, nombre);
    if (!producto) return;

    const nuevoNombre = prompt('Nuevo nombre del producto:', producto.nombreProducto);
    if (!nuevoNombre) return;

    const nombreLimpio = sanitizarNombre(nuevoNombre);
    if (!validarNombreProducto(nombreLimpio)) {
      mostrarMensaje('Nombre inválido.', true);
      return;
    }

    const nuevaCantidad = prompt('Nueva cantidad:', producto.cantidadProducto);
    if (!validarCantidad(nuevaCantidad)) {
      mostrarMensaje('Cantidad inválida.', true);
      return;
    }

    if (nombreLimpio !== nombre && encontrarProducto(inventario, nombreLimpio)) {
      mostrarMensaje('Ya existe un producto con ese nombre.', true);
      return;
    }

    producto.nombreProducto = nombreLimpio;
    producto.cantidadProducto = Number(nuevaCantidad);
    actualizarVistaInventario();
    guardarInventario();
    mostrarMensaje(`Producto editado: ${nombreLimpio}.`);
  } catch (error) {
    console.error('Error al editar producto:', error);
    mostrarMensaje('Error al editar el producto.', true);
  }
}

// Inicialización
recargarInventario();
document.getElementById('kioscoNombre').textContent = nombreTienda;
actualizarVistaInventario();

// Event listeners (configuración de interacciones)
document.getElementById('btnGreet').addEventListener('click', () => {
  const nombreUsuario = document.getElementById('btnuserName').value;
  if (nombreUsuario && nombreUsuario.trim() !== '') {
    saludar(nombreUsuario.trim());
    document.getElementById('btnuserName').value = ''; // limpia el input
  } else {
    mostrarMensaje('Por favor ingresa tu nombre.', true);
  }
});

document.getElementById('btnShowStock').addEventListener('click', () => {
  actualizarVistaInventario();
  mostrarMensaje('Inventario actualizado en pantalla.');
});

document.getElementById('btnAdd').addEventListener('click', () => {
  const nombreProducto = document.getElementById('addName').value;
  const cantidadProducto = document.getElementById('addQty').value;
  if (nombreProducto && cantidadProducto) {
    agregarProducto(inventario, nombreProducto.trim(), cantidadProducto);
    document.getElementById('addName').value = '';
    document.getElementById('addQty').value = '';
  } else {
    mostrarMensaje('Completa nombre y cantidad.', true);
  }
});

document.getElementById('btnSell').addEventListener('click', () => {
  const nombreProducto = document.getElementById('venderNombre').value;
  const cantidadProducto = document.getElementById('venderCantidad').value;

  if (nombreProducto && cantidadProducto) {
    venderProducto(inventario, nombreProducto.trim(), cantidadProducto);
    document.getElementById('venderNombre').value = '';
    document.getElementById('venderCantidad').value = '';
  } else {
    mostrarMensaje('Completa nombre y cantidad.', true);
  }
});

document.getElementById('btnCountLow').addEventListener('click', () => {
  const umbral = document.getElementById('btnumbralNumero').value;

  if (umbral) {
    contarProductosBajoStock(inventario, umbral);
    document.getElementById('btnumbralNumero').value = ''; // limpia el input
  } else {
    mostrarMensaje('Ingresa un umbral.', true);
  }
});

// Manejador global de errores para capturar errores no previstos
window.onerror = function(mensaje, archivo, linea, columna, error) {
  console.error('Error global:', mensaje, 'en', archivo, 'línea', linea);
  mostrarMensaje('Ocurrió un error inesperado. Revisa la consola.', true);
};