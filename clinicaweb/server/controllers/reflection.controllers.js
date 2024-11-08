// permission.controllers.js

// Importamos la clase BusinessObject, que presumiblemente contiene la lógica de negocio.
const BusinessObject = require('../BO');

// Función asíncrona para invocar un método específico de un módulo, verificando previamente los permisos del usuario.
const invokeMethod = async (moduleKey, perfilId, params) => {
  try {
    // Separamos la clave del módulo en sus componentes (módulo, clase, método y perfil).
    const [modulo, clase, metodo, _perfilId] = moduleKey.split('_');

    // Creamos una instancia del objeto de negocio.
    const bo = new BusinessObject();

    // Verificamos si el módulo y método existen en el objeto de negocio y si son funciones.
    if (bo[modulo] && typeof bo[modulo][metodo] === 'function') {
      // Construimos la clave del permiso específico para este usuario y método.
      const permissionKey = `${modulo}_${clase}_${metodo}_${perfilId}`;

      // Verificamos si el usuario tiene el permiso para ejecutar el método.
      if (permissionsMap.has(permissionKey) && permissionsMap.get(permissionKey)) {
        // Si el usuario tiene permiso, ejecutamos el método con los parámetros proporcionados.
        bo[modulo][metodo](...params);
      } else {
        // Si el usuario no tiene permiso, mostramos un mensaje de advertencia en la consola.
        console.warn(`Acceso denegado para ${metodo} en el módulo ${modulo}`);
      }
    } else {
      // Si el módulo o método no existe, mostramos un mensaje de error en la consola.
      console.error(`Método ${metodo} no encontrado en el módulo ${modulo}`);
    }
  } catch (error) {
    // Capturamos cualquier error que pueda ocurrir durante la ejecución del método.
    console.error('Error invoking method:', error);
    // Reenviamos el error para que pueda ser manejado en un nivel superior.
    throw error;
  }
};

module.exports = {
  invokeMethod
};