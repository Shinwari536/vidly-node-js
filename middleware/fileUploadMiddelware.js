const multer = require("multer");

const maxSize = 2 * 1024 * 1024;
const storage = multer.diskStorage({
    destination: `${require.main.path}/uploads/profileAvatar`,
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
});


module.exports = upload;