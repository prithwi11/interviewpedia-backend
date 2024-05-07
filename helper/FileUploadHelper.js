const multiparty = require('multiparty')
const path = require('path')
const fs = require('fs')

const fileUpload = async (req) => {
    const reqBody = req.body;
    let fileType = reqBody.type;
    const FILE_UPLOAD_PATH = path.resolve(__dirname, '..', 'uploads');
    let file_upload_path = path.resolve(FILE_UPLOAD_PATH, 'category');

    return new Promise((resolve, reject) => {
        const form = new multiparty.Form({ uploadDir: file_upload_path, encoding: false });
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err); 
                return;
            }

            const oldFileName = path.basename(files.file[0].path);
            const newFileNameArr = files.file[0].originalFilename.split('.');
            const newFileName = newFileNameArr[0] + '_' + Date.now() + '.' + newFileNameArr[1];
            const newFilePath = file_upload_path + '/' + newFileName;
            const oldFilePath = file_upload_path + '/' + oldFileName;

            let urlPath = newFilePath;
            // Rename file
            fs.rename(oldFilePath, newFilePath, (err) => {
                if (err) {
                    reject(err); // Reject the Promise with error
                } else {
                    console.log('newFilePath', newFilePath);
                    resolve(newFilePath); // Resolve the Promise with file path
                }
            });
        });
    });
};


module.exports = {
    fileUpload
}