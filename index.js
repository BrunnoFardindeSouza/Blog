// Módulos
const express = require('express');
const handlebars = require('express-handlebars')
const mongoose = require('mongoose');
const BodyParser =  require('body-parser');
const bodyParser = require('body-parser');
const db = require('./db')
// Configurações
    // express
        const app = express();
    // handlebars
        app.engine('handlebars',handlebars.engine({defaultLayout:'main'}));
        app.set('view engine','handlebars');
        app.set('views','./views');
    // Mongoose 
        mongoose.connect(db.mongoURI).then(()=>{
            console.log('Conectado ao mongo com sucesso!')
        }).catch((err)=>{
            console.log('Erro ao tentar conectar-se ao mongo: '+err)
        });
    // BodyParser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:false}));
       
// Rotas
app.get('/',(req,res)=>{
    require('./models/postagens');
    const Postagens = mongoose.model('postagens');
    Postagens.find().sort({data:'desc'}).lean().then((arquivo)=>{
        res.render('home',{arquivo:arquivo})

    })
});
app.get('/registrar',(req,res)=>{
    res.render('usuarios/registro')

});
app.post('/salvar',(req,res)=>{
    require('./models/usuarios');
    const usuario = mongoose.model('usuarios');
    const erros = [];
    if(!req.body.nome || typeof(req.body.nome) == undefined ||  req.body.nome.length == 0){
        erros.push({texto:"Preencha o seu nome! "})
    }else if(!req.body.email || typeof(req.body.email) == undefined ||  req.body.email.length == 0){
        erros.push({texto:"Preencha o seu email! "})
    }else if(!req.body.senha || typeof(req.body.senha) == undefined ||  req.body.senha.length == 0){
        erros.push({texto:"Preencha a sua senha! "})
    }if(erros.length > 0){
        res.render('usuarios/registro',{erro:erros})
    }else{
        new usuario({
            Nome:req.body.nome,
            Email:req.body.email,
            Senha:req.body.senha
        }).save().then(()=>{
            console.log('Usuário registrado com sucesso! ');
            res.redirect('/')
        }).catch((err)=>{
            console.log('Erro ao tentar registrá-lo'+err)
            res.redirect('/registrar')
        })
    }

});
app.get('/postagens',(req,res)=>{
    require('./models/postagens')
    const Postagens = mongoose.model('postagens')
    Postagens.find().sort({data:'desc'}).lean().then((arquivo)=>{
        res.render('usuario/postagens',{arquivo:arquivo})
    }).catch((err)=>{
        console.log('Erro ao tentar listar postagens! Erro: '+err)

    })
});
app.get('/criar',(req,res)=>{
    res.render('usuario/novaPostagem')
})
app.post('/postagem/nova',(req,res)=>{
    const erros = [];
    require('./models/postagens');
    const Postagens = mongoose.model('postagens');

    if(!req.body.titulo || typeof(req.body.titulo) == undefined || req.body.titulo.length == 0){
        erros.push({texto:"Preencha o campo de Titulo!"})

    }else if(!req.body.conteudo || typeof(req.body.conteudo) == undefined || req.body.conteudo.length == 0){
        erros.push({texto:"Preencha o campo de Conteudo!"})

    }else if(!req.body.links || typeof(req.body.links) == undefined || req.body.links.length == 0){
        erros.push({texto:"Preencha o campo de Links!"})

    }if(erros.length > 0 ){
        res.render('usuario/postagem',{erro:erros})
    }else{
        new Postagens({
            Titulo:req.body.titulo,
            Conteudo:req.body.conteudo,
            Descricao:req.body.descricao,
            Links:req.body.links

        }).save().then(()=>{
            console.log('Postagem registrada com sucesso!')
            res.redirect('/')

        }).catch((err)=>{
            console.log('Erro ao tentar registrar postagem! Erro: '+err)
            res.redirect('/postagens')

        })
    }
});
app.get('/postagem/deletar/:id',(req,res)=>{
    require('./models/postagens');
    const Postagem = mongoose.model('postagens')
    Postagem.deleteOne({_id:req.params.id}).then(()=>{
        console.log('Postagem deletada com sucesso!')
        res.redirect('/postagens')
    }).catch((err)=>{
        console.log('Erro ao tentar deletar a postagem! Erro: '+err)
        res.redirect('/postagens')

    })

})
app.get('/postagem/editar/:id',(req,res)=>{
    require('./models/postagens');
    const Postagem = mongoose.model('postagens')
    Postagem.findOne({_id:req.params.id}).sort({data:'desc'}).lean().then((arquivo)=>{
        res.render('usuario/editarPostagem',{arquivo:arquivo})
    })
    

})
app.post('/postagem/editar/salvar',(req,res)=>{
    require('./models/postagens');
    const Postagem = mongoose.model('postagens');
    Postagem.findOne({_id:req.body.id}).then((arquivo)=>{
        arquivo.Titulo=req.body.titulo,
        Descricao=req.body.descricao,
        arquivo.Conteudo=req.body.conteudo,
        arquivo.Links=req.body.links,
        arquivo.save().then(()=>{
            console.log('Postagem editada com sucesso!')
            res.redirect('/postagens')

        }).catch((err)=>{
            console.log('Erro ao tentar editar postagem! Erro:'+err)
            res.redirect('/postagens')

        })
    }).catch((err)=>{
        console.log("Erro ao tentar procurar pela postagem! Erro: "+err)
        res.redirect('/postagens')
    })

})
app.get('/postagem/leia/:id',(req,res)=>{
    require('./models/postagens');
    const Postagem = mongoose.model('postagens');
    Postagem.findOne({_id:req.params.id}).sort({date:'desc'}).lean().then((arquivo)=>{
        res.render('usuario/leiaPostagem',{arquivo:arquivo});

    }).catch((err)=>{
        console.log('Erro ao tentar descrever postagem! Erro: '+err)
    })

})
// outros
const porta = process.env.PORT || 9090;
app.listen(porta,()=>{console.log('Servidor on')});
