import express from 'express';
import multer from 'multer';
import { cloneVoice, generateAudioFromClone, getVoices } from '../controller/voice.controller.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/clone', upload.single('voice_sample'), cloneVoice);

router.post('/speak', generateAudioFromClone);
router.get('/get-voices', getVoices);


export default router;