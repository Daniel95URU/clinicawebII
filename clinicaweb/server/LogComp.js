// const fs = require('fs');

// class Log {
//   static types = ['error', 'warning', 'info', 'debug'];

//   constructor() {
//     this.activation = this.loadConfig();
//   }

//   loadConfig() {
//     try {
//       const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
//       return config.activation ?? [true, false, false, false];
//     } catch (error) {
//       console.error('Error en la carga de las configuraciones:', error);
//       return [true, false, false, false];
//     }
//   }

//   displayLogMessage(param) {
//     if (typeof param === 'string') {
//       console.log(param);
//     } else if (param && typeof param === 'type' in param) {
//       if (this.activation[param.type]) {
//         console.log(`message: ${param.message} - type: ${Log.types[param.type]}`);
//       }
//     }
//   }
// }

// module.exports = Log;
