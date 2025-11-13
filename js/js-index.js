const marcaditoNombre = 'MaxiKioscoArgentina';

// Stock inicial (será reemplazado por recargarStock si hay datos guardados) 
let stock = [
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

// Cargar stock desde localStorage
function recargarStock() {
  const saved = localStorage.getItem('stock');

  if (saved) {
    const parsedStock = JSON.parse(saved);
    
    // Verifico si el stock guardado usa los nombres de propiedades correctos
    if (parsedStock.length > 0 && parsedStock[0].nombreProducto !== undefined) {
      stock = parsedStock;
    } else {
      localStorage.removeItem('stock'); // limpio el localStorage viejo
    }
  }
}

function guardarStock() {
  localStorage.setItem('stock', JSON.stringify(stock)); // esto me guarda el stock actual con el nombre "stock" como un string JSON en localStorage
}

function mostrarMensaje(message, isError = false) { // inicializo una funcion con el isError en false por defecto

  const results = document.getElementById('results'); // busco el div de resultados que tiene como id "results"

  const clase = isError ? 'mensaje-error' : 'mensaje-exito'; // dependiendo si es error o no, asigno la clase CSS correspondiente

  results.innerHTML = `<p class="${clase}">${message}</p>`; // inserto el mensaje dentro del div en el html y el css le pondra color en el
}

function saludar(nombrePersonal) {
  const msg = `Hola, ${nombrePersonal}! Bienvenido a ${marcaditoNombre}.`; // genero un mensaje para imprimir

  document.getElementById('greetMessage').textContent = msg; // lo muestro en el html
}

function agregarProducto(productos, productnombreProducto, amount) {
  const amt = Number(amount); // verifico que sea un numero

  if (Number.isNaN(amt) || amt <= 0) { // numero valido || mayor a 0
    mostrarMensaje('Cantidad inválida para agregar.', true);
    return false;
  }

  const productoEncontrado = productos.find(producto => producto.nombreProducto.toLowerCase() === productnombreProducto.toLowerCase()); // busco el producto con find() - funcion de orden superior

  if (productoEncontrado) { // si encuentro el producto
    productoEncontrado.cantidadProducto += amt; // sumo la cantidad al producto existente
    mostrarMensaje(`Producto actualizado: ${productoEncontrado.nombreProducto} - Nueva cantidadProducto: ${productoEncontrado.cantidadProducto}`); // llamo a la funcion para que esta agregue al html el mensaje de informacion
    updateStockDisplay(); // actualizo la visualizacion del stock en pantalla
    guardarStock(); // guardo el stock actualizado en localStorage
    return true;
  }

  productos.push({ nombreProducto: productnombreProducto, cantidadProducto: amt, precioProducto: 0 }); // si no existe, lo agrego con precio 0 por defecto
  mostrarMensaje(`Producto agregado: ${productnombreProducto} - Cantidad: ${amt}`); // llamo a la funcion para que esta agregue al html el mensaje de informacion
  updateStockDisplay(); // actualizo la visualizacion del stock en pantalla
  guardarStock(); // guardo el stock actualizado en localStorage
  return true;
}

function venderProducto(productos, productnombreProducto, amount) {
  const amt = Number(amount); // como amount viene como string, lo convierto a numero

  if (Number.isNaN(amt) || amt <= 0) { // verifica si es un numero, y si es mayor a 0
    mostrarMensaje('Cantidad inválida para vender.', true);
    return false;
  }

  const productoEncontrado = productos.find(producto => producto.nombreProducto.toLowerCase() === productnombreProducto.toLowerCase()); // busco el producto con find() - funcion de orden superior

  if (productoEncontrado) { // si encuentro el producto
    if (productoEncontrado.cantidadProducto < amt) {
      mostrarMensaje('No hay suficiente stock.', true);
      return false;
    }

    productoEncontrado.cantidadProducto -= amt;
    mostrarMensaje(`Venta realizada: ${amt} x ${productoEncontrado.nombreProducto}`);
    updateStockDisplay();
    guardarStock();
    return true;
  }

  mostrarMensaje('Producto no encontrado.', true);
  return false;
}

function mostrarTodoStock(productos) {
  const stockList = document.getElementById('stockList');
  stockList.innerHTML = ''; // limpio el contenido previo

  for (const producto of productos) {
    const productoDiv = document.createElement('div'); // creo un elemento div
    productoDiv.textContent = `${producto.nombreProducto} - Cant: ${producto.cantidadProducto} - Precio: $${producto.precioProducto}`; // agrego el texto
    stockList.appendChild(productoDiv); // uso appendChild para agregar el elemento al DOM
  }
}

function stockMenor(productos, umbralMenorIgual) {
  const th = Number(umbralMenorIgual);
  
  if (Number.isNaN(th)) {
    mostrarMensaje('Umbral inválido.', true);
    return 0;
  }
  
  const productosBajoStock = productos.filter(producto => producto.cantidadProducto <= th); // filtro productos con stock menor o igual al umbral - funcion de orden superior

  mostrarMensaje(`Productos con stock <= ${th}: ${productosBajoStock.length}`);
  return productosBajoStock.length;
}

function updateStockDisplay() {
  mostrarTodoStock(stock);
}

// ACA INICIA TODO

// esto llama a cargar el stock al iniciar
recargarStock();

document.getElementById('kioscoNombre').textContent = marcaditoNombre;

// Mostrar stock inicial
updateStockDisplay();

document.getElementById('btnGreet').addEventListener('click', () => {
  const userName = document.getElementById('btnuserName').value;
  if (userName && userName.trim() !== '') {
    saludar(userName.trim());
  } else {
    mostrarMensaje('Por favor ingresa tu nombre.', true);
  }
});

document.getElementById('btnShowStock').addEventListener('click', () => {
  updateStockDisplay();
  mostrarMensaje('Stock actualizado en pantalla.');
});

document.getElementById('btnAdd').addEventListener('click', () => {
  const nombreProducto = document.getElementById('addName').value;
  const cantidadProducto = document.getElementById('addQty').value;
  if (nombreProducto && cantidadProducto) {
    agregarProducto(stock, nombreProducto.trim(), cantidadProducto);
    document.getElementById('addName').value = '';
    document.getElementById('addQty').value = '';
  } else {
    mostrarMensaje('Completa nombre y cantidadProducto.', true);
  }
});

document.getElementById('btnSell').addEventListener('click', () => {
  const nombreProducto = document.getElementById('venderNombre').value; // obtengo el nombre del producto a vender
  const cantidadProducto = document.getElementById('venderCantidad').value; // obtengo la cantidad a vender

  if (nombreProducto && cantidadProducto) { // verifico que ambos campos esten completos

    venderProducto(stock, nombreProducto.trim(), cantidadProducto); // el .trim() elimina espacios al inicio y al final del string // tuve que buscar una forma ya que me daba error cuando se me escapaba un espacio
    
    document.getElementById('venderNombre').value = ''; // limpio nombre
    document.getElementById('venderCantidad').value = ''; // limpio cantidad
  
  } else {
    mostrarMensaje('Completa nombre y cantidadProducto.', true);
  }
});

document.getElementById('btnCountLow').addEventListener('click', () => {
  const th = document.getElementById('btnumbralNumero').value;

  if (th) {
    stockMenor(stock, th);
  } else {
    mostrarMensaje('Ingresa un umbral.', true);
  }
});