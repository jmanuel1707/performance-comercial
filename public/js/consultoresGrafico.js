$(document).ready(function(){
    
    $(window).on("resize", function (event) {
        verificarGraficoBarras();
    });
    
    window.datosGraficoBarras = [];
    
    $("#botonGrafico").click(obtenerDatosGrafico);
    
    function obtenerDatosGrafico(){
       
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
        nombres_consultores.push("mes");
        
        $("#selectConsultoresAgregados option").each(function(){
            var nombre_consultor = $(this).text();
            var codigo_consultor = $(this).val();
            
            $.post("/consultores/receitas",{ co_usuario: codigo_consultor, fechas: meses },function(respuesta){
                //console.log(respuesta);
                var mesesLetras = ["Enero", "Febrero", "Marzo", "Abril","Mayo", "Junio","Julio", "Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
                var cod_consultor = respuesta["consultor_codigo"].trim();
                datos.push(respuesta.datos);
                limite++;
                
                nombres_consultores.push(respuesta.datos[0].no_usuario);
                total_custo_fixo += respuesta.datos[0].custo_fijo;

                if (limite == total_consultores){
                    nombres_consultores.push("Custo Fixo Medio");
                    total_custo_fixo = parseInt(total_custo_fixo/total_consultores);
                    datosGraficoBarras = []
                    for (var i = 0; i< datos[0].length; i++){
                        var array = []
                        array.push(datos[0][i].mes +"/"+datos[0][i].anio);
                        for(var j=0; j<datos.length; j++){
                            array.push(parseInt(datos[j][i].receita_liquida));
                        }
                        array.push(total_custo_fixo);
                        datosGraficoBarras.push(array);
                        
                    }
                    datosGraficoBarras.unshift(nombres_consultores);
                    cargarGraficoBarras(datosGraficoBarras);
                }
            });
            
        });
    }
    

    function cargarGraficoBarras(datos){
        $("#contenedorResultados").html("<div id='graficoBarras'></div>");
        
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawVisualization);
        
        function drawVisualization() {
            // Some raw data (not necessarily accurate)
            
            var data = google.visualization.arrayToDataTable(datos);
            var series = '{"'+ $("#selectConsultoresAgregados option").length +'": {"type": "line", "color":"gray"}}';
            series = JSON.parse(series);
            var options = {
                title : 'Performance Comercial',
                seriesType: 'bars',
                series: series
            };
            
            var chart = new google.visualization.ComboChart(document.getElementById('graficoBarras'));
            chart.draw(data, options);
        }
        
    }
    
    
    function verificarGraficoBarras(){
        if ($("#contenedorResultados").find("#graficoBarras").length > 0){
            cargarGraficoBarras(datosGraficoBarras);
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