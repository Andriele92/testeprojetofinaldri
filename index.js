// importar express

const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const mysql = require('mysql');
var port = 3000;

app.engine('handlebars', engine({defaultLayout : 'main'})); //Essa linha de código define como layout principal para todas as outras paginas
app.set('view engine', 'handlebars');
app.set('views', './views');

//ROTA RAIZ
app.get('/', (req, res) => {
    res.render('home');
});



// ESPECIFICAR ARQUIVOS ESTATICOS
app.use(express.static(__dirname + '/public'));

//ROTAS
app.get('/cadastroconsulta', (req, res) => {
  res.render('cadastroconsulta')
})

app.get('/cadastropet', (req, res) => {
  res.render('cadastropet')
})


//express url
app.use(
  express.urlencoded({
    extended: true

  })
)
//rota para inserir dados
app.post('/controleconsulta/insertconsulta', (req, res) => {
  
  const pet = req.body.pet
  const nome_vet = req.body.nome_vet
  const dono_pet =  req.body.dono_pet

  const sql = `INSERT INTO consulta (pet, nome_vet, dono_pet) VALUES ('${pet}', '${nome_vet}', '${dono_pet}')`

  conn.query(sql, function (err) {
    if (err) {
      console.log(err)
    }

    res.redirect('/exibirconsulta')
  })
})

//rota de consulta geral. Aqui irá listar todas as consultas cadastrados
app.get('/exibirconsulta', (req, res) => {
  const sql = 'SELECT * FROM consulta'

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }
  
      const listarConsulta = data
      
      console.log(listarConsulta)

      res.render('consulta', { listarConsulta })

  })
})


// consulta um registo pelo id (consulta.handlebars)
app.get('/controleconsulta/:id', (req, res) => {
  const id = req.params.id
  
  const sql = `SELECT * FROM consulta WHERE id = ${id}`

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }

      const listarConsulta = data
      res.render('consulta', {  layout: false, listarConsulta } )

  })
})



//rota do buscar
app.get('/buscaconsulta', (req, res) => {
  res.render('buscaconsulta', { layout: false })
})


//rota busc para exibir o resultado do buscar
app.post('/resultadoconsulta/', (req, res) => {
  const id = req.body.id
  const sql = `SELECT * FROM consulta WHERE id = '${id}'`

  conn.query(sql, function(err, data){
     if(err){
     console.log(err)
      return
    }
     const listarConsulta = data
     res.render('consulta', {  layout: false, listarConsulta } )
     })
    })
  
    // rota para pegar dados para editar registro
app.get('/controleconsulta/editconsulta/:id', (req, res) => {
    
  const id = req.params.id

  const sql = `SELECT * FROM consulta where id = ${id}`

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }

      const consulta = data
      res.render('editconsulta', { layout: false, consulta } )

  })
})


//rota de edicao do registro com post
app.post('/controleconsulta/updateconsulta', (req, res) => {

  const pet = req.body.pet
  const nome_vet = req.body.nome_vet
  const dono_pet = req.body.dono_pet
  
  const sql = `UPDATE pets SET pet = ${pet}', nome_vet = '${nome_vet}', dono_pet = '${dono_pet}', WHERE id = '${id}'` 

  conn.query(sql, function(err) {
      if(err){
          console.log(err)
          return
      }

      res.redirect('/controleconsulta')
  })

})

//rota para deletar um registro
app.get('/controleconsulta/removeconsulta/:id', (req, res) => {
  const id = req.params.id

  const sql = `DELETE FROM consuta WHERE id = '${id}'`

  conn.query(sql, function(err){
      if(err){
          console.log(err)
          return
      }

      res.redirect('/controleconsulta')
  })
})




// conexao banco de dados
const conn = mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: '',
  database: 'projfinal'

})


conn.connect(function (err) {
  if (err) {
    console.log(err)
  }

  console.log('Conectado com sucesso!')


})


//configurar o servidor

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`)
})