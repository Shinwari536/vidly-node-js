const express = require('express');
const config = require('config');
const authorization = require('../middleware/authMiddleware');
const upload = require('../middleware/fileUploadMiddelware');
const { uploadProfile } = require('../services/user');

const router = express.Router();
const directoryPath = `${__dirname}/resources/static/assets/upload`;

router.post('/avatar', [authorization, upload.single('avatar')], async (req, res) => {

    if (req.file === undefined) return res.status(400).send({
        data: null,
        message: "Image not found. Upload an image.",
        success: false
    });
    const user = await uploadProfile(req.user._id, req.file.originalname)

    res.send({
        data: {
            image: `${config.get('baseURI')}/uploads/profileAvatar/${req.file.originalname}`
        },
        message: "File uploaded successfully",
        success: true
    })
});

module.exports = router;