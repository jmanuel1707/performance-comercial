$(document).ready(function(){

    $("#botonReceitasConsultores").click(obtenerDatosConsultores);
    
    $("#moverConsultorDer").click(function(){  moverConsultores("#selectTodosConsultores","#selectConsultoresAgregados");  });
    
    $("#moverConsultorIzq").click(function(){  moverConsultores("#selectConsultoresAgregados", "#selectTodosConsultores");  });
    
    
    /*
        Esta funcion realiza una peticion post por cada consultor en cada mes seleccionado por la consulta.
    */
    function obtenerDatosConsultores(e){
        e.preventDefault();
        
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
        
        

        $("#contenedorResultados").html("");
        
        if ($("#selectConsultoresAgregados option").length ===0){
            $("#contenedorResultados").html('<div id="mensajeError" hidden class="alert alert-warning"> <strong>Debe agregar algun consultor a la búsqueda</strong> </div>');
            
            $("#mensajeError").show("slow");
            setTimeout(function(){
                $("#mensajeError").hide("slow");
            },2000);
            
            
            return;
        }  
        
        $("#selectConsultoresAgregados option").each(function(){
            var nombre_consultor = $(this).text();
            var codigo_consultor = $(this).val();
            
            var html = "<table consultor="+codigo_consultor+" class='table table-condensed table-striped table-bordered'>"+  
                            "<thead>"+
                                "<tr class='nombre_consultor'><td  colspan='5'> "+nombre_consultor+"</td></tr>"+
                                "<tr><td>Período</td> <td>Receita Líquida</td><td>Custo Fixo</td>  <td>Comissao</td><td>Lucro</td></tr>"+
                            "</thead>" +
                            "<tbody>"+
                            "</tbody>"+
                            "<tfoot>"+
                            "</tfoot>"+
                        "</table>";
            
            $("#contenedorResultados").append(html);
            
            
            $.post("/consultores/receitas",{ co_usuario: codigo_consultor, fechas: meses },function(respuesta){
                var mesesLetras = ["Enero", "Febrero", "Marzo", "Abril","Mayo", "Junio","Julio", "Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
                var cod_consultor = respuesta["consultor_codigo"].trim();
                var total_receita_liquida = 0;
                var total_custo_fijo = 0;
                var total_comissao = 0;
                var total_lucro = 0;
                
                respuesta.datos.forEach(function(elem, index){
                    
                    var receita_liquida = Math.round(elem["receita_liquida"] * 100) /100;
                    var custo_fijo = Math.round(elem["custo_fijo"] * 100) /100;
                    var comissao = Math.round(elem["comissao"] * 100) /100;
                    var lucro =  Math.round( (receita_liquida - (custo_fijo + comissao)) * 100)/100 ;
                    
                    total_receita_liquida += receita_liquida;
                    total_custo_fijo += custo_fijo;
                    total_comissao += comissao;
                    total_lucro += lucro;
                    
                    $("table[consultor='"+cod_consultor+"'] tbody").append("<tr><td>"+ mesesLetras[(elem["mes"] * 1) -1]  + " de " + elem["anio"]+ "</td><td>"+ "R$ " +receita_liquida+"</td><td>"+ "-R$ " +custo_fijo+"</td><td>"+ "-R$ " +comissao+"</td><td>"+ "R$ "+ lucro +"</td></tr>");
                    
                });
                
                $("table[consultor='"+cod_consultor+"'] tfoot").append("<tr><td>SALDO</td><td>"+"R$ "+ Math.round(total_receita_liquida *100)/100+"</td><td>"+ "-R$ "+ Math.round(total_custo_fijo * 100)/100+"</td><td>"+ "-R$ " +Math.round(total_comissao * 100)/100+"</td><td>"+ "R$ " +Math.round(total_lucro * 100)/100+"</td></tr>");
                
            });
            
        });
        
    }
    
    
    function moverConsultores(origen, destino){
        var consultores;
        consultores = $(origen + " option:selected");
        $(origen + " option:selected").remove();
        
        consultores.each(function(index, elemento){
            elemento.selected = false;
            $(destino).append(elemento);
        });
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