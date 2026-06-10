import { initializeAssociations } from './model/index.js';
import sequelize from "./db/config.js";
import { Usuario } from './model/Usuario.js';

async function seed() {
  try {
    initializeAssociations();
    await sequelize.sync({alter: true, force: true });
    console.log('Tablas recreadas');

    const usuarios = [
      { 
        firstName: 'Usuario',
        lastName: 'Test',
        email: 'test@gmail.com',
        password: 'test123'
      },
      { 
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harry@gmail.com',
        password: 'haer123' }
    ];

    const users = [];
    for (const user of usuarios) {
      const created = await Usuario.crearUsuario(user); // usa tu método estático
      users.push(created);
    }

    console.log('usuarios creados');
  } catch (error) {
    console.error('Error en seed:', error);
  }
    await sequelize.close();
}

seed();

