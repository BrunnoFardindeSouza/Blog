const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postagensSchema = new Schema({
    Titulo:{
        type:String
    },
    Descricao:{
        type:String,
    },
    Conteudo:{
        type:String
    },
    Links:{
        type:String,
    },
    Data:{
        type:Date,
        default:Date.now()
    }
})

mongoose.model('postagens',postagensSchema)