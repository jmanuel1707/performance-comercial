var controlador = require('express').Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'jmanuel1707',
  password : '',
  database : 'performance'
});



controlador.get('/', function(req, res){
  obtenerConsultoresActivos().then(function(rows){
      var datos = rows;
      if (rows.errno){
          console.log("Ha ocurrido un error");
          res.send('Ha ocurrido un error');
      } 
      else{
          res.render('home', {datos: datos});
      }
  });
});



controlador.post("/consultores/receitas", function(req, res){
  if(!req.body.co_usuario){
      res.send([]);
  } 
  else{
    
    var consultor_codigo = req.body.co_usuario;
    
    var respuesta = {};
    respuesta.datos = [];
    respuesta.consultor_codigo = consultor_codigo;
    
    var fechas = req.body.fechas;
    
    fechas.forEach(function(elem, index){
      var fecha_ini = elem.anio + "-" + elem.mes + "-01";
      var fecha_fin = elem.anio + "-" + elem.mes + "-" + daysInMonth(elem.mes, elem.anio);
      
      obtenerReceitaLiquida(elem.mes, elem.anio, fecha_ini, fecha_fin, consultor_codigo).then(function(rows){
          respuesta.datos.push(rows[0]);
          if (index === fechas.length -1){
            res.send(respuesta);
          }
          
      });
      
    });
  }
    
});


function obtenerReceitaLiquida(mes, anio ,fecha_ini, fecha_fin, consultor){
  return new Promise(function(resolve, reject){
    
    var consulta = "select (?)mes, (?)anio, cao_usuario.co_usuario, cao_usuario.no_usuario, coalesce(brut_salario,0)custo_fijo, sum(coalesce(facturas.receita_liquida,0))receita_liquida, sum(coalesce(facturas.comissao,0))comissao from cao_usuario "+ 
                    " left join  cao_salario on cao_usuario.co_usuario = cao_salario.co_usuario "+
                    " left join cao_os on cao_os.co_usuario = cao_usuario.co_usuario "+
                    " left join ( "+
                        " select cao_fatura.co_os, cao_fatura.valor, total_imp_inc,  (valor - (valor * total_imp_inc)/100)receita_liquida, ((valor - (valor * total_imp_inc)/100) * comissao_cn/100)comissao "+
                        " from cao_fatura where data_emissao between ? and ? "+
                    " )facturas "+
                    " on cao_os.co_os = facturas.co_os "+
                    " where cao_usuario.co_usuario = ? "+
                    " group by cao_usuario.co_usuario, cao_usuario.no_usuario; ";

    connection.query(consulta, [mes, anio, fecha_ini, fecha_fin, consultor],function(err, rows, fields) {
      if (!err){
        
        resolve(rows);
      }
      else{
        resolve(err);
      }
    });
  });
}




function obtenerConsultoresActivos(){
  return new Promise(function(resolve, reject){
    connection.query("select * from cao_usuario inner join permissao_sistema on cao_usuario.co_usuario=permissao_sistema.co_usuario where co_sistema=1 and in_ativo='S' and (co_tipo_usuario = 0 or co_tipo_usuario = 1 or co_tipo_usuario = 2 )",function(err, rows, fields) {
      if (!err){
        resolve(rows);
      }
      else{
        resolve(err);
      }
    });
  });
}



function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
    
    
module.exports = controlador;