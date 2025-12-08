// Clases de error personalizadas para mejor manejo de errores
class ErrorValidacion extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrorValidacion";
  }
}

class ErrorInventario extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrorInventario";
  }
}

// Funciones asíncronas usando Promesas para simular operaciones asincronas
function recargarInventarioAsync() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const guardado = localStorage.getItem("inventario");
        if (guardado) {
          const inventarioParseado = JSON.parse(guardado);
          if (inventarioParseado.length > 0 && inventarioParseado[0].nombreProducto !== undefined) {
            inventario = inventarioParseado;
          } else {
            localStorage.removeItem("inventario");
          }
        }
        resolve();
      } catch (error) {
        reject(new ErrorInventario("Error al cargar el inventario guardado. Usando inventario inicial."));
      }
    }, 100);
  });
}

function guardarInventarioAsync() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        localStorage.setItem("inventario", JSON.stringify(inventario));
        resolve();
      } catch (error) {
        reject(new ErrorInventario("Error al guardar el inventario. Los cambios no se persistirán."));
      }
    }, 100);
  });
}