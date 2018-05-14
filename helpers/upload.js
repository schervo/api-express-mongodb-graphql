import fs from 'fs'
import mkdirp from 'mkdirp'
import shortid from 'shortid'

const uploadDir = '../uploads'

// ensure upload directory exists
mkdirp.sync(uploadDir)

const storeFS = ({ stream, filename }) => {
  const id = shortid.generate()
  const path = `${uploadDir}/${id}-${filename}`
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error) => {
        if (stream.truncated) fs.unlinkSync(path)
        reject(error)
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, path })))
}

export const processUpload = async (upload) => {
  const {
    stream, filename, mimetype, encoding,
  } = await upload
  const { id, path } = await storeFS({ stream, filename })
  return ({
    id, filename, mimetype, encoding, path,
  })
}

export default {
  processUpload,
}
