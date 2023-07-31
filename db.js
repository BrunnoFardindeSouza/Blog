if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI:"mongodb+srv://brunnofardin:BFS15054819@#@cluster0.w8inc55.mongodb.net/?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI:'mongodb://127.0.0.1/Registrar'}

}