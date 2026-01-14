import cloudinary from '../config/cloudinary.js';
import Voice from '../model/Voice.model.js';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

export const cloneVoice = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Audio recording required" });

        const fileBuffer = fs.readFileSync(req.file.path);

        const form = new FormData();
        form.append('name', req.body.name || 'My New Voice');
        form.append('files', fileBuffer, { filename: req.file.originalname });

        const elResponse = await axios.post('https://api.elevenlabs.io/v1/voices/add', form, {
            headers: {
                ...form.getHeaders(),
                'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
            },
        });

        const newVoiceId = elResponse.data.voice_id;

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "voice_records"
        });

        const savedVoice = await Voice.create({
            name: req.body.name || "My Voice",
            voiceId: newVoiceId,
            voiceLink: result.secure_url,
            cloudinaryId: result.public_id,
            format: result.format,
            size: result.bytes,
            duration: result.duration
        });

        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(201).json({
            success: true,
            message: "Voice recorded and cloned successfully",
            data: savedVoice
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Failed to process voice" });
    }
};

export const generateAudioFromClone = async (req, res) => {
    try {
        const { voiceId, text } = req.body;


        // console.log(voiceId, text);
        // return
        

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            },
            {
                headers: {
                    'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer'
            }
        );

        res.set('Content-Type', 'audio/mpeg');
        res.send(response.data);

    } catch (error) {
        console.error("Error generating audio:", error.response?.data || error.message);
        res.status(500).json({ error: "Audio generation failed" });
    }
};


export const getVoices = async (req, res) => {
    try {
        // const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
        //     headers: {
        //         'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
        //     },
        // });

        // const myVoices = response.data.voices.filter(voice => voice.category === 'cloned');


        const myVoices = await Voice.find();

        res.status(200).json({
            success: true,
            voices: myVoices
        });
    } catch (error) {
        console.error("Error fetching voices:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch voices" });
    }
};