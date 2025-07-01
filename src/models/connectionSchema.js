const mongoose = require('mongoose');
const connectionSchema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    connectionType :{
        type: 'string',
        enum: ['ignored', 'interested','accepted','rejected'],
    }
}, { timestamps: true });

const ConnectionModel = mongoose.model('connectionRequest', connectionSchema);
module.exports = ConnectionModel;
