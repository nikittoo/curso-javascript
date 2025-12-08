const nombreTienda = "MaxiKioscoArgentina";

function cargarInventario() {
  try {
    const guardado = localStorage.getItem("inventario");

    if (guardado) {
      const inventarioParseado = JSON.parse(guardado);
      if (inventarioParseado.length > 0 && inventarioParseado[0].nombreProducto !== undefined) {
        return inventarioParseado;
      }

    }
  } catch (error) {
    mostrarMensaje("Error al cargar inventario para reportes.", true);
  }

  return [];
} // revisado 

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
} // revisado

function generarReportes() {
  const inventario = cargarInventario();

  const totalProductos = inventario.length;
  document.getElementById("valorTotalProductos").textContent = totalProductos;

  const valorTotal = inventario.reduce((total, producto) => total + (producto.cantidadProducto * producto.precioProducto), 0);
  document.getElementById("valorTotalInventario").textContent = `$${valorTotal}`;

  const bajoStock = inventario.filter(producto => producto.cantidadProducto <= 5);
  const nombresBajoStock = [];
  bajoStock.forEach(p => nombresBajoStock.push(p.nombreProducto));
  document.getElementById("valorStockBajo").textContent = nombresBajoStock.length > 0 ? nombresBajoStock.join(", ") : "Ninguno";

  const topProductos = inventario.sort((a, b) => b.cantidadProducto - a.cantidadProducto).slice(0, 3);
  const lista = document.getElementById("listaProductosTop");
  const elementosLista = [];
  topProductos.forEach(p => elementosLista.push(`<li>${p.nombreProducto}: ${p.cantidadProducto}</li>`));
  lista.innerHTML = elementosLista.join("");

  mostrarMensaje("Reportes generados exitosamente.");
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nombreKiosco").textContent = nombreTienda;
  generarReportes();

  // Event listener para volver
  document.getElementById("btnVolverPrincipal").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});