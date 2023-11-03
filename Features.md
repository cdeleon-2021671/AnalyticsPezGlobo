# Características del proyecto

En la carpeta "config" está el archivo que inicia el servidor (app) y otro archivo que conecta a la base de datos (mongo).

En la carpte src están las dos carpetas que se encargan de registrar los eventos y validaciones.

En el archivo index.js se encuentran las funciones que levantan el proyecto.

## app.js

Contiene toda la configuracion necesaria para iniciar el servidor de manera adecuada.

### - Importaciones

- **express**: se importa y luego se le asigna a una variable su función, además, se le indíca que convertira las peticiones en peticiones http para luego esas peticiones ser convertidas y formato json. Sirve para crear un servidor interno en el proyecto.
- **cors**: se importa y luego se crean las configuraciones para que solo tienda.gt pueda acceder a las apis que se declararán en este proyecto. De último se utiliza en la variable que contiene la función de express. Sirve para darle seguridad al proyecto y no cualquier fuente se pueda conectar.
- **morgan**: se importa y luego se utiliza en la variable que contiene la función de express, se utiliza en modo desarrollador. Sirve para ayuda al desarrolador ya que indica cuando un api está siendo consumida.

```
app.use(morga("dev"))
```

- **dotenv**: se importa y luego se le indica que utilizara las variables de entorno que estén en el archivo "env.prod". Sirve para utilizar las variables de entorno.
- **helmet**: se importa y luego se utiliza en la variable que contiene la función de express. Sirve para convertir las solicitudes externas en peticiones http.

### - Rutas

Importa las rutas que vienen de esas direcciones y las almacena en sus variables designadas.

```
const eventRoutes = require("../src/event/event.routes");
const searchRoutes = require("../src/search/search.routes");
```

Después se le indíca a la variable que contiene la función de express que utilizará esas rutas como subruta y se asignara una ruta raíz.

```
app.use("/event", eventRoutes);
app.use("/search", searchRoutes);
```

### - Iniciar el servidor

La función que está al final (exports.initServer) se exporta para que pueda ser utilizada en el index.js y se inicie el servidor en el puerto designado. El puerto a utilizar se encuentra en las variables de entorno.

## mongo.js

Contiene toda la configuracion necesaria para conectarse a la base de datos de manera adecuada.

### - Importaciones

- **mongoose**: se importa y luego se utiliza en la función asincrona para poderse conectar a la base de datos. Sirve para tener control de la base de datos.
- **dotenv**: se importa y luego se le indica que utilizara las variables de entorno que estén en el archivo "env.prod". Sirve para utilizar las variables de entorno (env.prod).

### - Conectar a la base de datos

La función que está al final (exports.connect) se exporta para que pueda ser utilizada en el index.js y se conecte a la base de datos con la ruta, usuario y contraseña establecidos. La ruta que conecta a la base de datos se encuentra en las variables de entorno (env.prod).

## index.js

- Importa lo que viene del archivo "app.js" y luego utiliza la función de "initServer".

```
const app = require("./config/app");
app.initServer();
```

- Importa lo que viene del archivo "mongo.js" y luego utiliza la función de "connect".

```
const mongo = require("./config/mongo");
mongo.connect();
```

## Search Event

Este espacio es para registrar todos los eventos de busqueda que hace le usuario. Tomar en cuenta que los eventos se realizarán solo si el usuario está logeado con cuenta de cliente o simplemente no está logeado (se valida en la parte del front).

### - search.model.js

Se importa mongoose, se crea un esquema (searchSchema) ya que para crear modelos en mongodb se debe hacer a partir de un esquema. Se define el esquema con los siguientes datos:

- **event**: tipo String y siempre que se cree un nuevo evento será "Search". Este atributo es para reconocer que sera un evento de busqueda.
- **sourceUrl**: tipo String. Este atributo es para guardar la ruta que el cliente visito.
- **data**: tipo Objeto. Este atributo es para guardar la información del cliente y su busqueda. <b>type</b>: tipo String y siempre que se cree un nuevo atributo data el type será "Search". Este apartado es para reconocer que sera tipo de busqueda. <b>query</b>: tipo String. Será para guardar cual fue la busqueda que hizo el usuario.
- **fingerprint**: tipo String. Este atributo es para guardar el id del usuario ya que servirá para hacer las estadísticas, además, validar que productos ha visto y busquedas ha hecho.
- **time**: tipo Date. Este atributo es para guardar la fecha en que el usuario ha hecho busquedas ya que servirá para hacer las estadísticas, además, validar que productos ha visto y busquedas ha hecho ese día.

Al finalizar se exporta el esquema como un modelo ya que es para que mongoose lo guarde automáticamente en la base de datos, además, para poder acceder a el y hacer consultas desde este lado del proyecto.

### - search.routes.js

Se importa express para luego declarar una variable que utilice su enrutador.

Se importa el controlador a utilizar, en este caso sera el <b>search.controller.js</b> el que contiene todas las funciones a utilizar.

El enrutador sirve para poder declarar las subturas que servirán como api, además, asignar una función a realizar cuando se entre a esa ruta. Por ejemplo:

```
api.post("/add-event", searchController.addEvent)
```

Cuando se declaran las rutas y se le asigna una función no es necesario utilizar los paréntesis para cerrar la función ya que se ejecutaría a cada instante y eso no es lo que se busca.

Al finalizar se exporta la ruta para luego poder ser utilizada en el app.js y asignarle la ruta raíz.

### - search.controller.js

Se importa el modelo a utilizar, en este caso es el <b>search.model.js</b>.

Se tiene una única función que se exporta.

```
exports.addEvent
```

Esta función contiene un bloque de try catch ya que es una función asincrona y tendrá que ir a consultar a la base de datos.

Los parámetros que le recibe son req, res. Son parámetros que automáticamente llegan cuando es consumida el api.

- **req**: es request y contiene toda la información de la solicitud, datos que son enviados en el body, datos que son enviados como parámetros en las rutas, información de solicitud, etc.

- **res**: es response y sirve para dar enviar una respuesta http.

## Product Event

Este espacio es para registrar todos los eventos de vistas de los productos o links visitados que hace le usuario. Tomar en cuenta que los eventos se realizarán solo si el usuario está logeado con cuenta de cliente o simplemente no está logeado (se valida en la parte del front).

### - event.model.js

Se importa mongoose, se crea un esquema (eventSchema) ya que para crear modelos en mongodb se debe hacer a partir de un esquema. Se define el esquema con los siguientes datos:

- **event**: tipo String y unicamente aceptará datos que sean "Page View" o "Contact". Este atributo es para reconocer que tipo de evento será.
- **sourceUrl**: tipo String. Este atributo es para guardar la ruta que el cliente visito.
- **data**: tipo Objeto. Este atributo es para guardar la información del cliente y su vista. <b>type</b>: tipo String que será para verificar si es un producto, si es link de whatsapp, facebook, instagram, etc. <b>entity</b>: tipo String. Será para guardar el nombre de la tienda a la que pertenece el link o el producto en caso sea un producto el visitado. <b>entityId</b>: tipo String. Será para guardar el id de la tienda a la que pertenece el link o el producto en caso sea un producto el visitado. <b>object</b>: tipo String. Será para guardar el link que fue clickeado o el nombre del producto en caso sea un producto el visitado. <b>objectId</b>: tipo String. Será para guardar sku del producto al que pertenece el link o el producto en caso sea un producto el visitado.
- **fingerprint**: tipo String. Este atributo es para guardar el id del usuario ya que servirá para hacer las estadísticas, además, validar que productos ha visto.
- **time**: tipo Date. Este atributo es para guardar la fecha en que el usuario ha hecho busquedas ya que servirá para hacer las estadísticas, además, validar que productos ha visto.

Al finalizar se exporta el esquema como un modelo ya que es para que mongoose lo guarde automáticamente en la base de datos, además, para poder acceder a el y hacer consultas desde este lado del proyecto.

### - event.routes.js

Se importa express para luego declarar una variable que utilice su enrutador.

Se importa el controlador a utilizar, en este caso sera el <b>event.controller.js</b> el que contiene todas las funciones a utilizar.

El enrutador sirve para poder declarar las subturas que servirán como api, además, asignar una función a realizar cuando se entre a esa ruta. Por ejemplo:

```
api.post("/add-event", eventController.addEvent);
```

Cuando se declaran las rutas y se le asigna una función no es necesario utilizar los paréntesis para cerrar la función ya que se ejecutaría a cada instante y eso no es lo que se busca.

Al finalizar se exporta la ruta para luego poder ser utilizada en el app.js y asignarle la ruta raíz.

### - event.controller.js

Se importa el modelo a utilizar, en este caso es el <b>event.model.js</b>.

Contiene tres funciones a utlizar como api:

- **addEvent**
- **verifyEvent**
- **getLatestEvents**

### - addEvent

Función que sirve para agregar los eventos a la base de datos validando que haya pasado un minuto entre cada evento.

<ol>
<li>Extrae los datos que viene en el body</li>
<li>Busca todos los eventos que ha realizado el usuario</li>
<li>Utiliza la función <a href="#verifyTime">verifyTime</a> y guarda el resultado en una variable (flag)</li>
<li>Valida si flag es verdero entonces returna un mensaje de <b>espere un minuto</b>. Este mensaje no lo mira el usuario, es unicamente para terminar la función</li>
<li>En caso que flag sea falso se salta el paso anterior y utiliza la función <a href="#getEvent">getEvent</a> para crear el objeto</li>
<li>Se genera una nueva tupla de datos a partir del modelo Event con el objeto que returna <a href="#getEvent">getEvent</a></li>
<li>Se guarda la nueva tupla en la base de datos</li>
<li>Returna un mensaje de <b>evento añadido</b>. Este mensaje no lo mira el usuario, simplemente es para que termine la función</li>
</ol>

- <label id='verifyTime'><b>verifyTime</b></label>: función para validar que el tiempo que ha pasado desde que el usuario le dio clic a ese producto o link sobrepase el minuto. Si el resultado que returna es falso entonces si sobrepasa el minuto y puede seguir la función para guardar el evento.

- <label id='getEvent'><b>getEvent</b></label>: obtiene los datos que son mandados y procede a crear el objeto con forme al modelo establecido. Luego retorna el objeto y la función prosigue a guardar los datos.

### - verifyEvent

Esta función valida si el usuario ya hizo un evento de tipo view hoy al mismo producto. Es decir se manda la ruta que está visitando, el usuario que lo está haciendo y la fecha de hoy, si coincide con algún dato de la base de datos entonces returna true.

Es para validar que las vistas de los productos en el lado del backend (el otro proyecto) sean una vez por día por cada usuario. Entonces un usuario puede ver todos los productos 1000 veces, pero solo una vez se le sumara la vista a cada producto.

<ol>
<li>Extrae los datos que viene en el body</li>
<li>Busca todos los eventos que ha realizado el usuario hacia esa ruta que son "Page View"</li>
<li>Si no hay resultados entonces returna falso para que proceda a guardar la vista en el backend</li>
<li>Si en caso hay resultados entonces se ordenan del más reciente al más antiguo (en cuestion de fecha)</li>
<li>Se uarda el primer valor ya que es el más reciente</li>
<li>Se utiliza el Constructor Date para acceder a los formatos de fecha y a la fecha como tal</li>
<li>En una variable se guarda el año, el mes (se agrega uno ya que es un arreglo y empieza de 0 a contar los meses) y por ultimo el día.</li>
Resultado: año-mes-día
<li>Se convierte la fecha más reciente a string para que pueda ser comparada con la fecha que se acaba de guardar. Si el resultado de esta comparación es verdadero entonces returna true indicando que ya hay un evento este día y no puede ser guardado otro evento de este usuario, este día a este producto y así no aumentan las vistas.</li>
<li>Si en caso es falto returna false indicando que si puede guardar el evento ya que el evento más reciente que se tiene guardado es de otro día.</li>
</ol>

### - getLatestEvents

Obtiene los productos más vistos en las ultimas 48 horas.

<ol>
<li>Busca todos los eventos de tipo "Page View" ya que son los eventos que suceden al darle clic a un producto</li>
<li>Ordenar los resultado por fecha de más reciente a más antigua</li>
<li>Se utiliza el Constructor Date para acceder a los formatos de fecha y a la fecha como tal</li>
<li>Actualizar la hora con 6 horas menos para obtener la hora actual</li>
<li>Se convierte la hora actual en formato ISO</li>
<li>Se hace un recorrido en todos los eventos para validar cuales han sido en las últimas 48 horas</li>
<li>Se declara un arreglo quer servirá para guardar los productos que no hay sido por el mismo usuario y en la misma fecha (mismo día)</li>
<li>Se recorre el arreglo que contiene los productos de las últimas 48 horas. Adentro se crea una variable llamada "flag" con valor en falso, cuando cambie su valor es porque hay un producto repetido, es decir, un usuario que vio el mismo producto el mismo día entonces solo se guardara en el arreglo anterior una sola vez. La palabra <b>break</b> en un for significa que termina el for inmediatamente. La palabra  <b>continue</b> significa que ya no sigue con ese elemento asi falten 20 lineas se salta al siguiente elemento del arreglo</li>
<li>Se crea otro arreglo que servirá para guardar los productos sin repetir ya que un usuario puede ver un producto hoy y el mismo usuario puede ver el mismo producto ayer, entonces eso genera el mismo producto y usuario, pero diferente fecha.</li>
<li>Se recorre el arreglo que contien todos los productos sin repetir el día y de nuevo se declara una variable "flag" con valor en false. Cuando la variable cambie a true es porque se encontro un producto igual y no es necesario agregarlo al arreglo</li>
<li>Se crea una variable que será "repeat" con valor inicial en 0</li>
<li>Se recorre el arreglo que con tiene todos los productos de las últimas 48 horas y cuenta cuantas veces se repite cada producto sumando de uno en uno la variable repeat.</li>
<li>Se crea el objeto de producto con el storeID que es el id de la tienda a la que pertenece el producto, el idProduct que es el sku que aparece en el xml y la cantidad de vistas que tiene</li>
</ol>
