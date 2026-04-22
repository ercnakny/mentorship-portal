const admin = require('firebase-admin');

const serviceAccount = require('/home/ubuntu/firebase-service-account-mente.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setPassword() {
  const email = 'akinay516@gmail.com';
  const newPassword = 'Akinay123!';
  
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });
    console.log('Password set for:', email);
    console.log('Password:', newPassword);
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit();
}

setPassword();
