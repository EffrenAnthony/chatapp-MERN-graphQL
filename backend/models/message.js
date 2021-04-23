
const { model, Schema } = require('mongoose')

const messageSchema = new Schema({
  to: String,
  content: String,
  createdAt: String,
  from: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
})

module.exports = model('Message', messageSchema)
