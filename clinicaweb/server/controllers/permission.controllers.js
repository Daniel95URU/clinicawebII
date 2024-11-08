// Importamos el pool de conexiones a la base de datos y la consulta SQL para cargar permisos.
const pool = require('../Db');
const { loadPermissionsQuery } = require('../query');

// Función para cargar todos los permisos del sistema y almacenarlos en un mapa.
const loadPermissions = async () => {
  // Creamos un mapa para almacenar los permisos, usando una clave única por cada permiso.
  const permissionsMap = new Map();

  try {
    // Ejecutamos la consulta SQL para obtener todos los permisos.
    const res = await pool.query(loadPermissionsQuery);

    // Iteramos sobre los resultados de la consulta.
    res.rows.forEach(row => {
      // Construimos una clave única para cada permiso, combinando los campos relevantes.
      const key = `${row.des_modulo}_${row.des_clase}_${row.des_metodo}_${row.id_perfil}`;
      // Asignamos el valor `true` al permiso en el mapa, indicando que el usuario tiene ese permiso.
      permissionsMap.set(key, true);
    });
  } catch (err) {
    // Manejamos el error en caso de que ocurra algún problema durante la consulta.
    console.error('Error loading permissions:', err);
  }

  // Retornamos el mapa de permisos.
  return permissionsMap;
}

// Función para cargar los permisos específicos de un usuario dado su ID de perfil.
const loadPermissionsForUser = async (perfilId) => {
  try {
    // Cargamos todos los permisos del sistema.
    const permissionsMap = await loadPermissions();

    // Creamos un objeto para almacenar los permisos del usuario.
    const userPermissions = {};

    // Iteramos sobre las claves del mapa de permisos.
    Array.from(permissionsMap.keys())
      // Filtramos las claves que corresponden al perfil del usuario.
      .filter(key => key.endsWith(`_${perfilId}`))
      // Iteramos sobre las claves filtradas y asignamos los permisos al objeto del usuario.
      .forEach(key => {
        userPermissions[key] = permissionsMap.get(key);
      });

    // Retornamos el objeto de permisos del usuario.
    return userPermissions;
  } catch (error) {
    // Manejamos el error en caso de que ocurra algún problema durante la carga de permisos del usuario.
    console.error("Error loading permissions for user:", error);
    throw error; // Reenviamos el error para que pueda ser manejado en un nivel superior.
  }
}

// Exportamos las funciones para su uso en otros módulos.
module.exports = {
  loadPermissions,
  loadPermissionsForUser
};