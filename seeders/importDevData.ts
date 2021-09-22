import db from './../models'
import { urls } from './urls'

const importData = async () => {
  try {
    await urls.forEach(function (url) {
      db.Url.create(url)
    })
  } catch (err) {
    console.log(err)
  }
}

export default importData
