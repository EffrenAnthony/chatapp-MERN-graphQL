
const { model, Schema } = require('mongoose')

const messageSchema = new Schema({
  to: String,
  content: String,
  createdAt: String,
  from: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  reactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'reactions'
    }
  ]
})

module.exports = model('Message', messageSchema)
