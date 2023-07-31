const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    Nome:{
        type:String
    },
    Email:{
        type:String
    },
    Senha:{
        type:String,

    },
    Data:{
        type:Date,
        default:Date.now()

    }
}) 

mongoose.model('usuarios',UsuarioSchema);