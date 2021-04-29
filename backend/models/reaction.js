
const { model, Schema } = require('mongoose')

const reactionSchema = new Schema({
  content: String,
  createdAt: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: 'messages'
  }
})

module.exports = model('Reaction', reactionSchema)
