const admin = require('firebase-admin');

// Reemplaza la ruta por la de tu archivo de credenciales descargado desde Firebase Console
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function deleteAllUsers(nextPageToken) {
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  const uids = listUsersResult.users.map(userRecord => userRecord.uid);

  if (uids.length > 0) {
    await admin.auth().deleteUsers(uids);
    console.log(`Eliminados ${uids.length} usuarios`);
  }

  if (listUsersResult.pageToken) {
    await deleteAllUsers(listUsersResult.pageToken);
  }
}

deleteAllUsers().then(() => {
  console.log('Todos los usuarios han sido eliminados.');
  process.exit();
}).catch(error => {
  console.error('Error eliminando usuarios:', error);
  process.exit(1);
});