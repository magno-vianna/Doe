
//configurando o servidor 
const express = require("express");
const server = express();

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true,
});

//configurar o servidor para apresentar arquivos estáticos 
server.use(express.static('public'));

//habilitar o body do formulário
server.use(express.urlencoded({ extended: true }))

//configurar conexão com o baco de dados 
const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: '1005',
  host: 'localhost',
  port: 5432,
  database: 'doe'
});



//configurando a apresentação da página 
server.get("/",  async function (req, res) {
  const { rows } = await db.query("SELECT * FROM donors");
  const donors = rows;
  return res.render(`${__dirname}\\public\\index2.html`,{ donors });
});


// pegando dados do formulário
server.post("/", function (req, res) {
  const { name } = req.body
  const email = req.body.email
  const blood = req.body.blood

  if (name == "" || email == "" || blood == "") {
    return res.send("Favor preencher todos os campos")
  };

  //colocando valor dentro do banco de dados
  const query = `
      INSERT INTO donors ("name", "email", "blood") 
      VALUES ($1, $2, $3)`

  const values = [name, email, blood];

  db.query(query, values, function (err) {
    if (err) return res.send("Erro no banco de dados");

    return res.redirect("/");
  });
  
 
});

//Ligar o servidor e permitindo o acesso na porta 3000 
 server.listen(3000, function () {
  console.log("Iniciei o server")

});
