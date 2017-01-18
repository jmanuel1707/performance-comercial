Aplicacion de performance comercial.

Se debe tener en cuenta que:

a) Aquellos consultores que no esten asociados a alguna factura de la tabla "cao_fatura" tendran como "Receita Liquida" cero (0).
b) En la tabla "cao_salario" solo estan contemplados los salarios de 6 consultores, por lo que el "Custo Fixo" de los demas sera igual a cero (0).
c) Al igual que el punto a, aquellos consultores que no tengan ninguna factura asociada tendran una "comissao" igual a cero (0).
d) El lucro igualmente se calcula con la formula (Receita liquida - (Custo Fixo + Comissao)). Y dado que muchos de los consultores tienen en cero los tres datos involucrados, el resultado sera cero (0).
e) El grafico de torta solo mostrará aquellos consultores que tengan Receita Liquida mayor a cero (0), en caso de que ningun consultor cumpla con esto, el grafico no se mostrará.
f) La consulta "Por cliente" no fue definida en el ejercicio, por lo que se colocó un mensaje de "Módulo no disponible" al seleccionarlo.
g) El unico año que tiene facturas registradas es el 2007, sin embargo, en el select de fechas se coloco un intervalo desde 2004 hasta 2009.