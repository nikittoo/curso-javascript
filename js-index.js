// Simulador de stock con localStorage para persistencia de datos

const marcaditoNombre = 'MaxiKioscoArgentina';

// Stock inicial (será reemplazado por recargarStock si hay datos guardados) 
let stock = [
  { nombreProducto: 'Pan', cantidadProducto: 5, precioProducto: 44 },
  { nombreProducto: 'Leche', cantidadProducto: 3, precioProducto: 21 },
  { nombreProducto: 'Huevos', cantidadProducto: 12, precioProducto: 35 },
  { nombreProducto: 'Harina', cantidadProducto: 28, precioProducto: 45 }
];

// Cargar stock desde localStorage
function recargarStock() {
  const saved = localStorage.getItem('stock'); // ESTO ME BUSCA EL STOCK QUE YA PERSISTIA DESDE ANTES, SI ES LA PRIMERA VEZ QUE LO ABRIS TE TIRA EL QUE HAY POR DEFECTO
  
  if (saved) {
    stock = JSON.parse(saved); // ESTO LO QUE ME HACE ES CONVERTIR EL STRING GUARDADO EN const saved = localStorage.getItem('stock'); A UN ARRAY DE OBJETOS
    
    console.log('Stock cargado desde localStorage:', stock);

  } else {
    console.log('No hay stock guardado. Usando stock inicial.');
  }

}

function guardarStock() {
  localStorage.setItem('stock', JSON.stringify(stock)); // esto me guarda el stock actual con el nombre "stock" como un string JSON en localStorage
  console.log('Stock guardado en localStorage');
}

function mostrarMensaje(message, isError = false) { // inicializo una funcion con el isError en false por defecto

  const results = document.getElementById('results'); // busco el div de resultados que tiene como id "results"
  
  const clase = isError ? 'mensaje-error' : 'mensaje-exito'; // dependiendo si es error o no, asigno la clase CSS correspondiente
  
  results.innerHTML = `<p class="${clase}">${message}</p>`; // inserto el mensaje dentro del div en el html y el css le pondra color en el
  
  console.log(message); // tambien lo muestro en consola solo al mensaje 
}

function greet(nombrePersonal) {
  const msg = `Hola, ${nombrePersonal}! Bienvenido a ${marcaditoNombre}.`; // genero un mensaje para imprimir

  document.getElementById('greetMessage').textContent = msg; // lo muestro en el html
  
  console.log('Hola!:', msg); // tambien lo muestro en consola
}

function addProduct(stockArray, productnombreProducto, amount) {
  const amt = Number(amount);

  if (Number.isNaN(amt) || amt <= 0) {
    mostrarMensaje('CantidadProductocantidadProducto inválida para agregar.', true);
    return false;
  }

  for (let i = 0; i < stockArray.length; i++) {
    if (stockArray[i].nombreProducto.toLowerCase() === productnombreProducto.toLowerCase()) {
      stockArray[i].cantidadProducto += amt;
      console.log('Producto actualizado:', stockArray[i]);
      mostrarMensaje(`Producto actualizado: ${stockArray[i].nombreProducto} - Nueva cantidadProducto: ${stockArray[i].cantidadProducto}`);
      updateStockDisplay();
      guardarStock();
      return true;
    }
  }

  stockArray.push({ nombreProducto: productnombreProducto, cantidadProducto: amt, precioProducto: 0 });
  console.log('Producto agregado:', productnombreProducto, amt);
  mostrarMensaje(`Producto agregado: ${productnombreProducto} - CantidadProductocantidadProducto: ${amt}`);
  updateStockDisplay();
  guardarStock();
  return true;
}

function sellProduct(stockArray, productnombreProducto, amount) {
  const amt = Number(amount);

  if (Number.isNaN(amt) || amt <= 0) {
    mostrarMensaje('CantidadProductocantidadProducto inválida para vender.', true);
    return false;
  }

  for (let i = 0; i < stockArray.length; i++) {
    if (stockArray[i].nombreProducto.toLowerCase() === productnombreProducto.toLowerCase()) {
      if (stockArray[i].cantidadProducto < amt) {
        mostrarMensaje('No hay suficiente stock.', true);
        return false;
      }
      stockArray[i].cantidadProducto -= amt;
      mostrarMensaje(`Venta realizada: ${amt} x ${stockArray[i].nombreProducto}`);
      console.log('Venta:', productnombreProducto, amt);
      updateStockDisplay();
      guardarStock();
      return true;
    }
  }

  mostrarMensaje('Producto no encontrado.', true);
  return false;
}

function showStock(stockArray) {
  let text = '';
  for (let i = 0; i < stockArray.length; i++) {
    text += `${stockArray[i].nombreProducto} - Cant: ${stockArray[i].cantidadProducto} - Precio: $${stockArray[i].precioProducto}<br>`;
    console.log(stockArray[i].nombreProducto, '-', stockArray[i].cantidadProducto);
  }
  document.getElementById('stockList').innerHTML = text;
}

function countLowStock(stockArray, threshold) {
  const th = Number(threshold);
  if (Number.isNaN(th)) {
    mostrarMensaje('Umbral inválido.', true);
    return 0;
  }
  let count = 0;
  for (let i = 0; i < stockArray.length; i++) {
    if (stockArray[i].cantidadProducto <= th) count++;
  }
  console.log('countLowStock:', count);
  mostrarMensaje(`Productos con stock <= ${th}: ${count}`);
  return count;
}

function updateStockDisplay() {
  showStock(stock);
}

// ACA INICIA TODO

// esto llama a cargar el stock al iniciar
recargarStock();

document.getElementById('storeName').textContent = marcaditoNombre;

// Mostrar stock inicial
updateStockDisplay();

// Event listeners para los botones
document.getElementById('btnGreet').addEventListener('click', function () {
  const userName = document.getElementById('userName').value;
  if (userName && userName.trim() !== '') {
    greet(userName.trim());
  } else {
    mostrarMensaje('Por favor ingresa tu nombre.', true);
  }
});

document.getElementById('btnShowStock').addEventListener('click', function () {
  updateStockDisplay();
  mostrarMensaje('Stock actualizado en pantalla.');
});

document.getElementById('btnAdd').addEventListener('click', function () {
  const nombreProducto = document.getElementById('addName').value;
  const cantidadProducto = document.getElementById('addQty').value;
  if (nombreProducto && cantidadProducto) {
    addProduct(stock, nombreProducto.trim(), cantidadProducto);
    document.getElementById('addName').value = '';
    document.getElementById('addQty').value = '';
  } else {
    mostrarMensaje('Completa nombre y cantidadProducto.', true);
  }
});

document.getElementById('btnSell').addEventListener('click', function () {
  const nombreProducto = document.getElementById('sellName').value;
  const cantidadProducto = document.getElementById('sellQty').value;
  if (nombreProducto && cantidadProducto) {
    sellProduct(stock, nombreProducto.trim(), cantidadProducto);
    document.getElementById('sellName').value = '';
    document.getElementById('sellQty').value = '';
  } else {
    mostrarMensaje('Completa nombre y cantidadProducto.', true);
  }
});

document.getElementById('btnCountLow').addEventListener('click', function () {
  const th = document.getElementById('threshold').value;
  if (th) {
    countLowStock(stock, th);
  } else {
    mostrarMensaje('Ingresa un umbral.', true);
  }
});

console.log('Simulador cargado. Estado inicial:', stock);



