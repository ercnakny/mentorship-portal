const admin = require('firebase-admin');

const serviceAccount = require('/home/ubuntu/firebase-service-account-mente.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createUser() {
  const email = 'akinay516@gmail.com';
  const password = 'Akinay123!';
  
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: 'Ercan Akınay'
    });
    console.log('User created:', userRecord.uid, userRecord.email);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('User already exists:', email);
    } else {
      console.error('Error:', error.message);
    }
  }
  process.exit();
}

createUser();
