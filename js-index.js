console.log('Simulador simple cargado');

const storeName = 'Mi Despensa';
const stock = [
  { name: 'Pan', qty: 5, price: 1 },
  { name: 'Leche', qty: 3, price: 0.8 }
];

function greet(name) {
  const msg = `Hola, ${name}! Bienvenido a ${storeName}.`;
  alert(msg);
  console.log('greet:', msg);
}

// 2) Añadir producto (usa parámetros)
function addProduct(stockArray, productName, amount) {
  const amt = Number(amount);
  if (Number.isNaN(amt) || amt <= 0) {
    alert('Cantidad inválida para agregar.');
    return false;
  }
  for (let i = 0; i < stockArray.length; i++) {
    if (stockArray[i].name.toLowerCase() === productName.toLowerCase()) {
      stockArray[i].qty += amt; // condicional: si existe
      console.log('Producto actualizado:', stockArray[i]);
      return true;
    }
  }
  stockArray.push({ name: productName, qty: amt, price: 0 });
  console.log('Producto agregado:', productName, amt);
  return true;
}

// 3) Vender producto (usa parámetros)
function sellProduct(stockArray, productName, amount) {
  const amt = Number(amount);
  if (Number.isNaN(amt) || amt <= 0) {
    alert('Cantidad inválida para vender.');
    return false;
  }
  for (let i = 0; i < stockArray.length; i++) {
    if (stockArray[i].name.toLowerCase() === productName.toLowerCase()) {
      if (stockArray[i].qty < amt) {
        alert('No hay suficiente stock.');
        return false; // condicional: insuficiente
      }
      stockArray[i].qty -= amt;
      alert(`Venta realizada: ${amt} x ${stockArray[i].name}`);
      console.log('Venta:', productName, amt);
      return true;
    }
  }
  alert('Producto no encontrado.');
  return false;
}

// 4) Mostrar stock (usa for)
function showStock(stockArray) {
  let text = 'Stock actual:\n';
  for (let i = 0; i < stockArray.length; i++) {
    text += `${stockArray[i].name} - Cant: ${stockArray[i].qty}\n`;
    console.log(stockArray[i].name, '-', stockArray[i].qty);
  }
  alert(text);
}

// 5) Contar productos con stock menor o igual a un umbral
function countLowStock(stockArray, threshold) {
  const th = Number(threshold);
  if (Number.isNaN(th)) return 0;
  let count = 0;
  for (let i = 0; i < stockArray.length; i++) {
    if (stockArray[i].qty <= th) count++;
  }
  console.log('countLowStock:', count);
  return count;
}

// Flujo principal (while) — interacción por prompt/alert/console
(function main() {
  const user = prompt('Ingresa tu nombre:');
  if (user && user.trim() !== '') greet(user.trim());

  let running = true;
  while (running) {
    const opt = prompt('Elige: 1-Ver stock, 2-Agregar, 3-Vender, 4-Contar bajo stock, 5-Salir');
    if (opt === null) break; // usuario canceló

    if (opt === '1') {
      showStock(stock);
    } else if (opt === '2') {
      const name = prompt('Nombre del producto a agregar:');
      const amt = prompt('Cantidad a agregar:');
      if (name && amt) addProduct(stock, name.trim(), amt);
    } else if (opt === '3') {
      const name = prompt('Nombre del producto a vender:');
      const amt = prompt('Cantidad a vender:');
      if (name && amt) sellProduct(stock, name.trim(), amt);
    } else if (opt === '4') {
      const th = prompt('Umbral (ej: 2):');
      const c = countLowStock(stock, th);
      alert(`Productos con stock <= ${th}: ${c}`);
    } else if (opt === '5') {
      running = false;
    } else {
      alert('Opción inválida. Elegí 1-5.');
    }
  }

  alert('Simulador finalizado. Revisa la consola para detalles.');
  console.log('Estado final:', stock);
})();
