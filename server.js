const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { TranslationServiceClient } = require('@google-cloud/translate');

const app = express();
app.use(cors());
app.use(express.json());

const translationClient = new TranslationServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    const [response] = await translationClient.translateText({
      parent: `projects/${process.env.PROJECT_ID}/locations/global`,
      contents: [text],
      mimeType: 'text/plain',
      targetLanguageCode: targetLanguage,
    });

    res.json({
      translation: response.translations[0].translatedText
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
