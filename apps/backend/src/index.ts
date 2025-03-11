import app from './core/app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);

  if (process.env.USE_FIREBASE_EMULATOR === 'true') {
    console.log('Using Firebase emulator');
  }
});
