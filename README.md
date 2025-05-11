# pfmea
# exchange1
# exchange-2.0
# exchange1
# apqp


Este repositorio contiene el server configurado de tal forma que funciona para despliegue en vercel, en app.js se inicia la aplicacion y de ahi se conecta a src/routes/index.js, el cual contiene la ruta de acceso a la base de datos renderizando en la vista home el formulario para ingresar la clave que permite el acceso a la base de datos remota en mongo atlas.

la apariencia del proyecto es controlado con la vista styles.ejs

Una vez ingresada y validada la contraseña de la base de datos se direcciona a a una lista que contiene los usuarios registrados en users.ejs, desde donde se pueden registrar mas usuarios con la funcion duplicar que se renderiza desde la vista userdup.ejs

este mismo repositorio contiene los archivos para la aplicacion exchange solo se deben usar los archivos terminacion temp.

Se construye una aplicacion que permita el acceso a una url separada para ingresar datos.

para mejorar la seguridad, antes de ingresar a la edicion de datos se debe elegir un usuario de una lista cargada por el administrador e ingresar una contraseña, solo si es correcta se puede renderizar la vista que contiene los comandos de edicion en la vista comercial1.ejs

La primer vista incluye seleccionar un cliente y las funciones para agregar un numero de parte. con la ruta /par/id del cliente seleccionado.

La vista commercial1.ejs contiene el formulario que debe llenarse en una junta de factibilidad, por cuanto se determina el nivel de ppap y las caracteristicas del producto.

En la linea 117 de index.js se reemplaza la plantilla a renderizar cust por commercial, la cual contiene los estilos que permiten el uso de modo oscuro. 

Para poder acceder a la vista el usuario debe elegir su nombre de una lista e ingresar una clave de acceso (password registrado previamente en la base de datos) en un formulario, si es correcta se renderiza comercial1 que es la pagina de edicion. Los accesos generan un registro de fecha y hora, ademas los cambios tambien generan un registro de usuario fecha y hora.

DESCRIPCION DE LAS VISTAS

La aplicacion esta diseñada para cargar datos a traves de diferentes formularios en las siguientes categorias:

1.- Usuarios
2.- Organizaciones
3.- Clientes
4.- Productos
5.- Operaciones
6.- Caracteristicas
7.- Modos de falla
6.- Procedimientos

y despues vienen los formatos que se alimentan con la informacion que esta contenida en la base de datos: PSW, flowchart.


cada formulario contiene 3 vistas, en la primera de despliega una lista que contiene los elementos de los cuales cada uno tiene un id. (users.ejs, orgs.ejs, custs.ejs, parts.ejs, opers.ejs, chrcs.ejs, fmeas y procs.ejs) el id sirve para poder ingresar datos al formulario. 

La segunda vista muestra los datos de un solo elemento seleccionado y permite editar el contenido asi como  tambien es posible borrar el elemento completo. (user.ejs, org.ejs)

La tercer vista permite editar un elemento que ya ha sido ingresado previamente (useredit.ejs, orgedit.ejs)

La primer vista se conecta a la segunda por medio de dos etiquetas ejemplo:

<a href="/fme/edit/<%= fmeas[i]._id %>" class="edit-btn">Editar</a>

<a href="/paf/<%= fmeas[i]._id %>" class="edit-btn">Registrar plan de acción</a>

y  tiene correspondencia en las ruta registradas en index.js para renderizar la segunda vista.


router.get("/fme/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const fmeas = await Fme.findById(id);
    res.render("fmeaedit", {fmeas});
});

esta vista da acceso a la siguiente categoria con la etiqueta 

<a href="/paf/<%= fmeas[i]._id %>" class="edit-btn">Registrar plan de acción</a>

a la cual corresponde la siguiente ruta.
 router.get("/fme/:id", async (req, res) => {
    const { id } = req.params;
    const par = await Par.findById(id);
    const fme = await Chr.findById(id);
    const ope = await Ope.findById(id);
    res.render("fmea", {par, ope, fme});

    Los datos de cada elemento se envian a la siguiente vista de manera que se vaya integrando la informacion, lo cual permitira accederlos por medio de funciones de seleccion o busqueda, por ejemplo: un modo de falla esta relacionado a un numero de operacion; un numero de parte; un cliente; y una organizacion. Sin embargo el sistema escribe esta relacion de manera automatica, sin tener que estar ingresando los datos en cada modo de falla, el usuario solo se encargar de registrar la informacion minima requerida en el formulario de cada elemento.

    La relacion que existe entre las bases de datos es muy importante, ya que esto permite el acceso a los datos mediante filtros usando diferentes campos, por lo que es necesario que se vaya armando la cadena conforme se ingresa la informacion:

    la base de datos que corresponde a la organización incluye el nombre que posetriormente se usara en los reportes de diagrama de flujo, pcp y fmea. De esta se deriva la bd de clientes, que incluyen el nombre del cliente 




PFMEA

se agrega la plantilla fmeaprint, para renderizar los registros en el formato de la AIAG, esto requiere que se reciban los datos del backend en grupo de elementos, la cantidad de elementos se ajusta en la linea 308 de index.js y el espacio entre elementos se ajusta en la linea 148 de fmeaprint.

PCP

el plan de control de proceso se renderiza en PCP.ejs, con el nombre del producto se accede a la BD, la informacion se mueve a traves del backend como pcps, ademas la ruta esta escrita en la linea 300

const User = require("../models/exps.js");
const Org = require("../models/orgs.js");
const Cus = require("../models/cust.js");
const Par = require("../models/part.js");
const Ope = require("../models/oper.js");
const Chr = require("../models/chrc.js");
const Fme = require("../models/Fmea.js");
const Pro = require("../models/proc.js");
const Pcp = require("../models/pcpr.js");
const Fmea = require("../models/Fmea.js");

    "us1": "String",   
    "or2": "String",    
    "cu2": "String",
    "cu3": "String",
    "pa1": "String",
    "pa2": "String",  
    "pa4": "String",
    "pc1": "String",
    "pc2": "String",
    "pc3": "String",
    "pc4": "String",
    "pc5": "String",
    "pc6": "String",
    "pc7": "String",
    "pc8": "String",
    "pc9": "String",
    "pc10": "String",
    "pc11": "String",
    "pc12": "String",
    "pc13": "String",
    "pc14": "String",
    "pc15": "String",
    "pc16": "String",
    "pc17": "String",
    "pc18": "String",
    "pc19": "String"

    Se hacen ajustes en la logica de acceso a la base de datos: 

    algunos formatos requieren la combinacion de informacion que viene de diferentes tablas, en el diseño actual se toman los datos de la tabla anterior y se copian a la nueva tabla, pero no es necesario copiar todos los datos, por eso en el nuevo diseño se va a tomar solo el ID del registro que se necesita.

    Ejemplo:

    Para calcular la capacidad del proceso, se necesitan registrar 5 mediciones y estas se deben asociar a una caracteristica, de esta forma se incluye el id de la caracteristica.

    cuando se requiera filtrar todos los registros de esa caracteristica se hace usando el id de la caracteristica y cuando se requiera un registro especifico se usa el id del registro.

    Para copiar la informacion de un resgistro por ejemplo del analisis de modo y efecto de falla se carga la informacion del arreglo y se guarda asignando un nuevo id.

26 de Abril de 2025

    En esta actualizacion se va a enlazar el programa a una nueva base de datos llamada rapqp2, para documentar los pasos necesarios para un cambio de esta naturaleza y la posibilidad de habilitar diferentes clusters por Cliente de manera que sean preservados los requisitos de confidencialidad de los datos ingresados en la base datos bajo la responsabilidad de MongoDB Atlas.

    En este caso la aplicacion se muestra sin datos, sin embargo el codigo funciona sin interrupciones y se permite acceder a todas las categorias.

    Debido a la programacion en secuencia de la base de datos no es posible registrar una organización si no hay un usuario previamente cargado, asi mismo no es posible cargar los datos de un cliente si no hay definida previamente una organizacion y asi sucesivamente con el resto de las tablas, por lo que en este estado la base de datos permanece vacia y desde la aplicacion no hay forma de poder romper el anidamiento porque no esta disponible una plantilla que permita ingresar a un usuario. A esta plantilla le corresponde la vista user.ejs y la ruta 
    
    router.post("/submit", async (req, res) =>
{   
    const user = new User(req.body);
    await user.save();
    res.redirect("/db");
});
 
 esta ruta esta en el renglon 160

 También se agrega el siguiente codigo

 router.get("/submit", async (req, res) =>
    {
        const user = await User.find();
        console.log(users);
        res.render("user", {user});
    });

por ultimo se escribe el codigo de la plantilla ejs para ingresar el primer usuario.

no hay un modo directo para que se pueda agregar los datos de un nuevo registro, es para evitar malas practicas de parte de los usuarios, por lo que solo se puede ingresar el primer user desde la liga /submit despues de cargar el usuario de la base de datos. se debe ingresar desde la url sobrescribiendo sobre /db
una vez ingresado el primer usuario se pueden crear otros desde la funcion editar con la opcion a duplicar para facilitar el ingreso de informacion de multiples cuentas.

1 de Mayo de 2025 en tiempo extra, 4 hrs, se agregan las vistas del PPAP 02,03,04,08,13,14,15,16 y 17.

se valida y se se actualiza app desplegada en Vercel como apqp-1-4.vercel.app

Cambios que se han integrado:

1.- El tiempo de espera desde que se envia el nombre de usuario hasta que la base de datos aumento mucho y no es visible desde el el fron end. lo cual ocasiona conflicto por cuanto si el usuario espera demasiado el time out de la BD la bloquea, y si no espera suficiente, el envio de cualquier solicitud al back end rompe el codigo. La solucion es agregar un reloj indicador en Home.ejs para mostrar al usuario el tiempo de espera. 

2.- Las vistas de PPAP necesitan ser convertidas a PDF y es necesario que se incluya en el nombre del archivo el numero de parte que viene de la BD y el nombre de la vista que corresponde a un elemento de PPAP, se dejo funcionando la 02. 

Debido a que el archivo index ya esta muy saturado se abre un nuevo archivo que contendra las rutas del nuevo modulo de caracteristicas. es chrcRoutes.js

Se incluye una vista que permite obtener desde un campo multiopcion los numeros de parte disponibles en la parte superior, mientras que en la parte inferior se muestran las caracteristicas, una vez que se selecciona el numero de parte se pueden agregar o eliminar caracteristicas, y una vez configurado se guarda y mantendra persistencia.