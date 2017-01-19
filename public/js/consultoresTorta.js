$(document).ready(function(){
    
    $(window).on("resize", function (event) {
        verificarGraficoTorta();
    });
    
    window.datosGraficoTorta = [];
    
    $("#botonTorta").click(obtenerDatosTorta);

    function obtenerDatosTorta(){
        $("#contenedorResultados").html("<img class='img-responsive center-block' src='/img/loading.gif' style='width: 100px; height:100px' />");
        //Utilizamos la funcion calcularFechas para obtener los meses/año que consultaremos
        var meses = calcularFechas();
        if(!meses){
            $("#contenedorResultados").html('<div id="mensajeError" hidden class="alert alert-warning"> <strong>La fecha de inicio no puede ser mayor a la fecha final.</strong> </div>');
            
            $("#mensajeError").show("slow");
            setTimeout(function(){
                $("#mensajeError").hide("slow");
            },2000);
            return;
        }
        
    
        if ($("#selectConsultoresAgregados option").length ===0){
            $("#contenedorResultados").html('<div id="mensajeError" hidden class="alert alert-warning"> <strong>Debe agregar algun consultor a la búsqueda</strong> </div>');
            
            $("#mensajeError").show("slow");
            setTimeout(function(){
                $("#mensajeError").hide("slow");
            },2000);
            
            return;
        }
        
        var total_consultores = $("#selectConsultoresAgregados option").length;
        var datos = [];
        var limite = 0;
        var total_custo_fixo = 0;
        var nombres_consultores = [];
        var receitas_liquidas = [];
    
        
        $("#selectConsultoresAgregados option").each(function(){
            var nombre_consultor = $(this).text();
            var codigo_consultor = $(this).val();
            
            $.post("/consultores/receitas",{ co_usuario: codigo_consultor, fechas: meses },function(respuesta){
                
                var total_receita_liquida = 0;
                var cod_consultor = respuesta["consultor_codigo"].trim();
                datos.push(respuesta.datos);
                limite++;
                
                nombres_consultores.push(respuesta.datos[0].no_usuario);
                
                respuesta.datos.forEach(function(elem,index){
                    total_receita_liquida += elem.receita_liquida;
                });
                
                
                receitas_liquidas.push(total_receita_liquida);
                
                total_receita_liquida += respuesta.datos[0].receita_liquida;
                
                
                if (limite == total_consultores){
                    
                    
                    datosGraficoTorta = []
                    for (var i = 0; i<nombres_consultores.length ; i++){
                        var array = []
                        
                        for(var j=0; j<1; j++){
                            array.push(nombres_consultores[i]);
                            array.push(receitas_liquidas[i]);
                        }
                        datosGraficoTorta.push(array);
                        
                    }
                    
                    datosGraficoTorta.unshift(['nombre', 'receita_liquida']);
                    cargarGraficoTorta(datosGraficoTorta);
                }
                
                
            });
            
        });
        
        
    }
    

    function cargarGraficoTorta(datos){
        $("#contenedorResultados").html("<div id='graficoTorta'></div>");
        console.log(typeof 'Hola como estas');
        //var filtro = _.filter(datos, function(elemento){ return (elemento == 0) ; });
        
        var bandera = false;
        for (var i = 1; i<datos.length;i++){
            if(datos[i][1] != 0){
                bandera = true;
            }
        }
        
        if (bandera==false){
            $("#contenedorResultados").html('<div id="mensajeError" hidden class="alert alert-warning"><strong>No hay datos para graficar.</strong> </div>');
            $("#mensajeError").show("slow");
            setTimeout(function(){
                $("#mensajeError").hide("slow");
            },2000);
            
        }
        
        
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
        var data = google.visualization.arrayToDataTable(datos);
        
        var options = {
          title: 'Paticipacao na Receita',
          is3D: true,
        };
        
        var chart = new google.visualization.PieChart(document.getElementById('graficoTorta'));
        chart.draw(data, options);
        }

        
    }
    
    
    function verificarGraficoTorta(){
        if ($("#contenedorResultados").find("#graficoTorta").length > 0){
            cargarGraficoTorta(datosGraficoTorta);
        }
    }


    function calcularFechas(){
        var fechasConsulta = [];
        var fecha1 = $("#anioInicio").val() +"-"+ $("#mesInicio").val() +"-01" ;
        fecha1 = moment(fecha1);
        fecha1.locale('es');
        var fecha2 = $("#anioFin").val() +"-"+ $("#mesFin").val() +"-01" ;
        fecha2 = moment(fecha2);

        if(fecha1.isSame(fecha2)){
            fechasConsulta.push({mes:fecha1.format('MM') ,anio:fecha1.format('YYYY')});  
        }
        else if(fecha1.isBefore(fecha2)){
            
            while (fecha1.isBefore(fecha2)){
                fechasConsulta.push({mes:fecha1.format('MM') ,anio:fecha1.format('YYYY')});
                fecha1.add(1,'months');
            }
            fechasConsulta.push({mes:fecha1.format('MM') ,anio:fecha1.format('YYYY')});
        }
        else{
            return false;
        }
        
        return fechasConsulta;
    }
    
    
    
    
   
   
   
});