# Aplicacion de performance comercial.

## Herramientas utilizadas:
- Node.js con framework express
- Para el motor de vistas de express se utilizo handlebars.
- Para consultas AJAX y animaciones en el DOM se utilizó la librería jQuery.
- El modelado del HTML y diseño responsive fué realizado con Bootstrap.
- Los gráficos se construyeron haciendo uso de la librería charts de Google.


## Se debe tener en cuenta que:
- Para ejecutarlo correctamente se debe cambiar la configuración de conexion a base de datos del archivo /controller/consultores.js
- Aquellos consultores que no esten asociados a alguna factura de la tabla "cao_fatura" tendran como "Receita Liquida" cero (0).
- En la tabla "cao_salario" solo estan contemplados los salarios de 6 consultores, por lo que el "Custo Fixo" de los demas sera igual a cero (0).
- Al igual que el punto a, aquellos consultores que no tengan ninguna factura asociada tendran una "comissao" igual a cero (0).
- El lucro igualmente se calcula con la formula (Receita liquida - (Custo Fixo + Comissao)). Y dado que muchos de los consultores tienen en cero los tres datos involucrados, el resultado sera cero (0).
- El grafico de torta solo mostrará aquellos consultores que tengan Receita Liquida mayor a cero (0), en caso de que ningun consultor cumpla con esto, el grafico no se mostrará.
- La consulta "Por cliente" no fue definida en el ejercicio, por lo que se colocó un mensaje de "Módulo no disponible" al seleccionarlo.
- El unico año que tiene facturas registradas es el 2007, sin embargo, en el select de fechas se coloco un intervalo desde 2004 hasta 2009.
