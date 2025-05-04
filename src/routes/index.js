const express = require("express");
const router = express.Router();

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
const Ace = require ("../models/ac.js");
const mongoose = require("mongoose");


// Ruta modificada
router.post('/db/submit', async (req, res) => {
        
    if (!req.body || !req.body.db1) {
        console.error("Datos faltantes:", {
            body: req.body,
            headers: req.headers
        });
        return res.status(400).json({ 
            success: false, 
            message: "Datos incompletos" 
        });
    }
    
    const URI = `mongodb+srv://${req.body.db1}:HHnOQn2B4iVtEdOU@cluster0.pgfsbij.mongodb.net/rapqp?retryWrites=true&w=majority`;
    
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error MongoDB:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

  router.post('/db/submit1', async (req, res) => {
    const { selectedUserId, bd2 } = req.body; // Obtener el _id del usuario seleccionado y la contraseña
    console.log('ID del usuario seleccionado:', selectedUserId); // Verificar el valor

    try {
        // Buscar el usuario en la base de datos por su _id
        const user = await User.findById(selectedUserId);
        const cust = await Cus.find();
        const users = await User.find();
        console.log('Usuario encontrado:', user); // Verificar el usuario encontrado

        if (user && user.us3 === bd2) {
            // Si el usuario existe y la contraseña coincide, renderizar la vista commercial1.ejs
            res.render('commercial1', {users, cust});
        } else {
            // Si no coincide, enviar un mensaje de contraseña incorrecta
            res.status(401).send('Contraseña incorrecta');
        }
    } catch (error) {
        res.status(500).send('Error al buscar el usuario');
    }
});

  router.get('/', (req, res, next) =>
    {
            res.render('home');
    });

router.get("/us", async (req, res) =>
{
    const users = await User.find();
    
    res.render("home", {users});
});

router.get("/db", async (req, res) =>
{
    const users = await User.find();
    
    res.render("users", {users});
});

router.get("/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const user = await User.findById(id);
    res.render("edit", {user});
});

router.get("/pro/view/:id", async (req, res) =>
{
    const {id} = req.params;
    const procs = await Pro.findById(id);
    res.render("proviewer", {procs});
});

router.get("/org/:id", async (req, res) => {
    const { id } = req.params;
    const orgs = await Org.findById(id);
    res.render("org", {id: id});
    
});

router.post("/org/submit", async (req, res) =>
{   
    const orgs = new Org(req.body);
    await orgs.save();
    res.redirect("/org");
});

router.get("/org", async (req, res) =>
{
    const orgs = await Org.find();
    console.log(orgs);
    res.render("orgs", {orgs});
});

router.get("/org/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const orgs = await Org.findById(id);
    res.render("orgedit", {orgs});
});

router.get("/org/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const orgs = await Org.deleteOne({_id: id});
    res.redirect("/org");
});

router.get("/cust/:id", async (req, res) => {
    const { id } = req.params;
    const org= await Org.findById(id);
    res.render("cust", {org});
});

router.post("/cust/submit", async (req, res) =>
{   
    const cust = new Cus(req.body);
    await cust.save();
    res.redirect("/cust");

});

router.get("/cust", async (req, res) =>
{
    const cust = await Cus.find();
    const users = await User.find();
    console.log(cust);
    res.render("commercial", {users, cust});
});

router.get("/cust1", async (req, res) =>
    {
        const cust = await Cus.find();
        const users = await User.find();
        console.log(cust);
        res.render("commercial1", {users, cust});
    });



router.post("/submit", async (req, res) =>
{   
    const user = new User(req.body);
    await user.save();
    res.redirect("/db");
});

router.get("/submit", async (req, res) =>
    {
        const user = await User.find();
        console.log(users);
        res.render("user", {user});
    });



router.get("/cust/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const cust = await Cus.findById(id);
    res.render("custedit", {cust});
});

router.get("/cus/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const cust = await Cus.deleteOne({_id: id});
    res.redirect("/cust/");
});


router.post("/cus/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Cus.updateOne({_id: id}, req.body);
    res.redirect("/cust");
});


router.post("/org/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Org.updateOne({_id: id}, req.body);
    res.redirect("/org");
});

router.post("/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await User.updateOne({_id: id}, req.body);
    res.redirect("/db");
});

router.get("/dup/:id", async (req, res) =>
{
    const {id} = req.params;
    const user = await User.findById(id);
    res.render("userdup", {user});
});

router.post("/dup/:id", async (req, res) =>
{
    const {id} = req.params;
    await User.updateOne({_id: id}, req.body);
    res.redirect("/db");
});

router.get("/fme/dup/:id", async (req, res) =>
    {
        const {id} = req.params;
        const fmeas = await Fmea.findById(id);
        res.render("fmeadup", {fmeas});
    });
    
    router.post("/fme/dup/:id", async (req, res) =>
    {
        const {id} = req.params;
        await Fmea.updateOne({_id: id}, req.body);
        res.redirect("/db");
    });

router.get("/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const user = await User.deleteOne({_id: id});
    res.redirect("/db");
});

router.get("/par", async (req, res) =>
{
    const pars = await Par.find();
    console.log(pars);
    res.render("parts", {pars});
});

router.post("/par/submit", async (req, res) =>
{   console.log(new Par(req.body));
    const custs = new Par(req.body);
    await custs.save();
    res.redirect("/par/");
});

router.post("/par/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Par.updateOne({_id: id}, req.body);
    res.redirect("/par");
});

router.get("/par/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const pars = await Par.findById(id);
    res.render("partedit", {pars});
});

router.get("/par/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const pars = await Par.deleteOne({_id: id});
    res.redirect("/par/");
});

router.get("/par/:id", async (req, res) => {
    const { id } = req.params;
    const cus = await Cus.findById(id);
    res.render("part", {cus});
    
});

router.get("/ope", async (req, res) =>
{
    const opes = await Ope.find();
    console.log(opes);
    res.render("opers", {opes});
});

router.get("/flowchart/:cu1", async (req, res) =>
{   const { cu1 } = req.params;
    const opes = await Ope.find({cu1});
    console.log(opes);
    res.render("flowchart2", {opes});
});





router.get("/pcpview/:pc10", async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        let limit = 9; // Número de registros por página
        let skip = (page - 1) * limit;

        const totalRecords = await Pcp.countDocuments(); // Total de registros
               const pcps = await Pcp.find().skip(skip).limit(limit); // Consulta con paginación
console.log(pcps)
        res.render("PCP", {
            pcps,
            page,
            totalPages: Math.ceil(totalRecords / limit) // Total de páginas
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error al obtener los registros");
    }
});

router.get("/fmea", async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        let limit = 9; // Número de registros por página
        let skip = (page - 1) * limit;

        const totalRecords = await Fmea.countDocuments(); // Total de registros
               const fmeas = await Fmea.find().skip(skip).limit(limit); // Consulta con paginación

        res.render("fmeaprint", {
            fmeas,
            page,
            totalPages: Math.ceil(totalRecords / limit) // Total de páginas
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error al obtener los registros");
    }
});




router.get("/psw/:id", async (req, res) =>
{   const { id } = req.params;
    const pars = await Par.findById(id);
    console.log(pars);
    res.render("psw2", {pars});
});

router.get("/acep/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el ID es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID no válido");
        }

        const acs = await Ace.findById(id);

        // Si no encuentra el documento, responder con un 404
        if (!acs) {
            return res.status(404).send("Registro no encontrado");
        }

        console.log("Registro encontrado:", acs);
        res.render("acprint", { acs });
    } catch (error) {
        console.error("Error al buscar el registro:", error);
        res.status(500).send("Error en el servidor");
    }
});

router.post("/ope/submit", async (req, res) =>
{   console.log(new Ope(req.body));
    const parts = new Ope(req.body);
    await parts.save();
    res.redirect("/ope/");
});

router.post("/ope/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Ope.updateOne({_id: id}, req.body);
    res.redirect("/ope");
});

router.get("/ope/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const opes = await Ope.findById(id);
    res.render("operedit", {opes});
});

router.get("/ope/edit/f/:id", async (req, res) =>
{
    const {id} = req.params;
    const opes = await Ope.findById(id);
    res.render("flowchart", {opes});
});

router.get("/ope/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const opes = await Ope.deleteOne({_id: id});
    res.redirect("/ope/");
});

router.get("/ope/:id", async (req, res) => {
    const { id } = req.params;
    const par = await Par.findById(id);
    res.render("oper", {par});
});

router.get("/chr", async (req, res) =>
{
    const chrc = await Chr.find();
    console.log(chrc);
    res.render("chrcs", {chrc});
});

router.post("/chr/submit", async (req, res) =>
{   console.log(new Chr(req.body));
    const chrcs = new Chr(req.body);
    await chrcs.save();
    res.redirect("/chr/");
});

router.post("/chr/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Chr.updateOne({_id: id}, req.body);
    res.redirect("/chr");
});

router.get("/chr/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const chrs = await Chr.findById(id);
    res.render("chrcedit", {chrs});
});

router.get("/chr/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const chrs = await Chr.deleteOne({_id: id});
    res.redirect("/chr/");
});

router.get("/chr/:id", async (req, res) => {
    const { id } = req.params;
    const ope = await Ope.findById(id);
    res.render("chrc", {ope});
    
});

router.get("/fme", async (req, res) =>
{
    const fmeas = await Fme.find();
    
    res.render("fmeas", {fmeas});
});

router.post("/fme/submit", async (req, res) =>
{   console.log(new Fme(req.body));
    const fmeas = new Fme(req.body);
    await fmeas.save();
    res.redirect("/fme/");
});

router.post("/fme/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Fme.updateOne({_id: id}, req.body);
    res.redirect("/fme");
});

router.get("/fme/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const fmeas = await Fme.findById(id);
    res.render("fmeaedit", {fmeas});
});

router.get("/fme/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const fmeas = await Fme.deleteOne({_id: id});
    res.redirect("/fme/");
});

router.get("/fme/:id", async (req, res) => {
    const { id } = req.params;
    const par = await Par.findById(id);
    const fme = await Chr.findById(id);
    const ope = await Ope.findById(id);
    res.render("fmea", {par, ope, fme});
    
});



// router.get('/signup', (req, res, next) => {
//     res.render('signup');
//   });
  
//   router.post('/signup', passport.authenticate('local-signup', {
//     successRedirect: '/profile',
//     failureRedirect: '/signup',
//     failureFlash: true
//   })); 
  
//   router.get('/signin', (req, res, next) => {
//     res.render('signin');
//   });
  
  
//   router.post('/signin', passport.authenticate('local-signin', {
//     successRedirect: '/profile',
//     failureRedirect: '/signin',
//     failureFlash: true
//   }));
  
//   router.get('/profile',isAuthenticated, (req, res, next) => {
//     res.render('user');
//   });
  
//   router.get('/logout', (req, res, next) => {
//     req.logout((err) => {
//         if (err) {
//           return next(err);
//         }
//     res.redirect('/signin');
//   });
// });
  
  
//   function isAuthenticated(req, res, next) {
//     if(req.isAuthenticated()) {
//       return next();
//     }
  
//     res.redirect('/signin')
//   }


  router.get("/pro", async (req, res) => {
    const procs = await Pro.find();
    console.log(procs);
    res.render("procs", { procs });
});

router.post("/pro/submit", async (req, res) => {
    console.log(new Pro(req.body));
    const procs = new Pro(req.body);
    await procs.save();
    res.redirect("/pro/");
});

router.post("/pro/update/:id", async (req, res) => {
    const { id } = req.params;
    await Pro.updateOne({ _id: id }, req.body);
    res.redirect("/pro");
});

router.get("/pro/edit/:id", async (req, res) => {
    const { id } = req.params;
    const procs = await Pro.findById(id);
    res.render("procedit", { procs });
});

router.get("/pro/delete/:id", async (req, res) => {
    const { id } = req.params;
    const procs = await Pro.deleteOne({ _id: id });
    res.redirect("/pro/");
});

router.get("/pro/:id", async (req, res) => {
    const { id } = req.params;
    const pro = await Org.findById(id);
    res.render("proc", { pro });
});

router.get("/pcp", async (req, res) => {
    const pcps = await Pcp.find();
    res.render("pcprs", { pcps });
});

router.get("/ace", async (req, res) => {
    try {
        const acs = await Ace.find(); // Obtener datos de la base de datos
        console.log(acs)
        res.render("acs", { acs }); // Enviar datos a la vista
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.render("ac", { acs: [] }); // En caso de error, evitar que falle la vista
    }
});

// Procesar formulario y guardar en la base de datos
router.post("/ace/submit", async (req, res) => {
    try {
        const newAcs = new Ace(req.body);
        await newAcs.save();
        res.redirect("/sorpresa"); // Redirigir a la vista para ver los datos guardados
    } catch (error) {
        console.error("Error al guardar datos:", error);
        res.status(500).send("Error al guardar los datos.");
    }
});

router.get('/sorpresa', (req, res) => {
    res.render('sorpresa');
});


router.post("/pcp/submit", async (req, res) => {
    console.log(new Pcp(req.body));
    const pcps = new Pcp(req.body);
    await pcps.save();
    res.redirect("/pcp/");
});


router.post("/pcp/update/:id", async (req, res) => {
    const { id } = req.params;
    await Pcp.updateOne({ _id: id }, req.body);
    res.redirect("/pcp");
});

router.get("/pcp/edit/:id", async (req, res) => {
    const { id } = req.params;
    const pcps = await Pcp.findById(id);
    res.render("pcpredit", { pcps });
});

router.get("/ace/edit/:id", async (req, res) => {
    const { id } = req.params;
    const acs = await Ace.findById(id);
    res.render("Acedit", { acs });
});

router.post("/ace/update/:id", async (req, res) => {
    const { id } = req.params;
    await Ace.updateOne({ _id: id }, req.body);
    res.redirect("/ace");
});

router.get("/ace/delete/:id", async (req, res) => {
    const { id } = req.params;
    const acs = await Ace.deleteOne({ _id: id });
    res.redirect("/ace/");
});

router.get("/pcp/delete/:id", async (req, res) => {
    const { id } = req.params;
    const pcps = await Pcp.deleteOne({ _id: id });
    res.redirect("/pcp/");
});

router.get("/pcp/:id", async (req, res) => {
    const { id } = req.params;
    const pcps = await Chr.findById(id);
    res.render("pcpr", { pcps });
});

router.get('/sev', (req, res) => {
    const datosFMEA = [
      {
        puntaje: 10,
        efectoProducto: "Falla en cumplir requisitos de seguridad y/o regulaciones (sin alerta)",
        efectoPlanta: "Puede causar riesgos al operador y ocurre sin alerta"
      },
      {
        puntaje: 9,
        efectoProducto: "Falla en cumplir requisitos de seguridad y/o regulaciones (con alerta)",
        efectoPlanta: "Puede causar riesgos al operador y ocurre con alerta"
      },
      {
        puntaje: 8,
        efectoProducto: "Pérdida de la función primaria (vehículo inoperante sin afectar la seguridad)",
        efectoPlanta: "Descontinuidad mayor: 100% del producto podría ser descartado. Parada de línea"
      },
      {
        puntaje: 7,
        efectoProducto: "Degradación de la función primaria (vehículo operante con rendimiento reducido)",
        efectoPlanta: "Descontinuidad significativa: Parte del lote puede ser descartado"
      },
      {
        puntaje: 6,
        efectoProducto: "Pérdida de función secundaria (vehículo operante, pero ítems de confort inoperantes)",
        efectoPlanta: "Descontinuidad moderada: 100% del lote puede necesitar retrabajo"
      },
      {
        puntaje: 5,
        efectoProducto: "Degradación de función secundaria (rendimiento reducido en ítems de confort)",
        efectoPlanta: "Descontinuidad moderada: parte del lote puede requerir retrabajo"
      },
      {
        puntaje: 4,
        efectoProducto: "Ítem de apariencia o ruido percibido por mayoría (>75%) de clientes",
        efectoPlanta: "Descontinuidad moderada: retrabajo antes del procesamiento"
      },
      {
        puntaje: 3,
        efectoProducto: "Ítem de apariencia o ruido percibido por muchos (≈50%) clientes",
        efectoPlanta: "Descontinuidad moderada: retrabajo parcial antes del procesamiento"
      },
      {
        puntaje: 2,
        efectoProducto: "Ítem de apariencia o ruido percibido por minoría (<25%) de clientes",
        efectoPlanta: "Descontinuidad menor: leve inconveniente para el proceso"
      },
      {
        puntaje: 1,
        efectoProducto: "Sin efectos perceptibles",
        efectoPlanta: "Sin efectos perceptibles"
      }
    ];
  
    res.render('severidad', { datosFMEA });
  });
  
  router.get('/ocu', (req, res) => {
    const datosOcurrencia = [
      {
        puntaje: 10,
        probabilidad: "Muy Alta",
        ocurrencia: "≥ 100 por mil (≥ 1 en 10)"
      },
      {
        puntaje: 9,
        probabilidad: "Alta",
        ocurrencia: "50 por mil (1 en 20)"
      },
      {
        puntaje: 8,
        probabilidad: "Alta",
        ocurrencia: "20 por mil (1 en 50)"
      },
      {
        puntaje: 7,
        probabilidad: "Alta",
        ocurrencia: "10 por mil (1 en 100)"
      },
      {
        puntaje: 6,
        probabilidad: "Moderada",
        ocurrencia: "2 por mil (1 en 500)"
      },
      {
        puntaje: 5,
        probabilidad: "Moderada",
        ocurrencia: "0.5 por mil (1 en 2,000)"
      },
      {
        puntaje: 4,
        probabilidad: "Moderada",
        ocurrencia: "0.1 por mil (1 en 10,000)"
      },
      {
        puntaje: 3,
        probabilidad: "Baja",
        ocurrencia: "0.01 por mil (1 en 100,000)"
      },
      {
        puntaje: 2,
        probabilidad: "Baja",
        ocurrencia: "≤ 0.001 por mil (1 en 1,000,000)"
      },
      {
        puntaje: 1,
        probabilidad: "Muy Baja",
        ocurrencia: "Falla eliminada mediante control preventivo"
      }
    ];
  
    res.render('ocurrencia', { datosOcurrencia });
  });
  
  router.get('/det', (req, res) => {
    const datosDeteccion = [
      {
        puntaje: 10,
        oportunidad: "No hay oportunidad de detección",
        control: "No existe control del proceso; el control no puede detectar o no es analizado.",
        probabilidad: "Casi imposible"
      },
      {
        puntaje: 9,
        oportunidad: "Detección improbable en cualquier etapa",
        control: "Modo de falla o causa difícil de detectar; controles indirectos o aleatorios.",
        probabilidad: "Muy remota"
      },
      {
        puntaje: 8,
        oportunidad: "Detección después del proceso",
        control: "Por operador mediante inspección visual, táctil o auditiva.",
        probabilidad: "Remota"
      },
      {
        puntaje: 7,
        oportunidad: "Detección del problema en su origen",
        control: "Por operador en estación o después del proceso con medición atributiva (pasa/no pasa).",
        probabilidad: "Muy baja"
      },
      {
        puntaje: 6,
        oportunidad: "Detección después del proceso",
        control: "Por operador usando medición variable o verificación manual (torquímetro, etc.).",
        probabilidad: "Baja"
      },
      {
        puntaje: 5,
        oportunidad: "Detección del problema en su origen",
        control: "Por operador o control automatizado con alarma; incluye mediciones en set-up o primera pieza.",
        probabilidad: "Moderada"
      },
      {
        puntaje: 4,
        oportunidad: "Detección después del proceso",
        control: "Por control automatizado que detecta y retiene automáticamente la pieza defectuosa.",
        probabilidad: "Moderadamente alta"
      },
      {
        puntaje: 3,
        oportunidad: "Detección del problema en su origen",
        control: "Control automatizado que detecta y retiene automáticamente la pieza defectuosa.",
        probabilidad: "Alta"
      },
      {
        puntaje: 2,
        oportunidad: "Detección del error y/o prevención del problema",
        control: "Control automatizado que detecta el error y evita procesar piezas defectuosas.",
        probabilidad: "Muy alta"
      },
      {
        puntaje: 1,
        oportunidad: "No aplica detección; prevención del error",
        control: "Prevención por diseño del proceso/producto con dispositivos a prueba de fallos.",
        probabilidad: "Casi garantizada"
      }
    ];
  
    res.render('deteccion', { datosDeteccion });
  });

  router.get('/sevi', (req, res) => {
    const datosFMEA = [
      {
        puntaje: 10,
        efectoProducto: "Fails to meet safety and/or regulatory requirements (without warning)",
        efectoPlanta: "May pose risks to the operator and occurs without warning"
      },
      {
        puntaje: 9,
        efectoProducto: "Fails to meet safety and/or regulatory requirements (with warning)",
        efectoPlanta: "May pose risks to the operator and occurs with warning"
      },
      {
        puntaje: 8,
        efectoProducto: "Loss of primary function (vehicle inoperative, but no safety impact)",
        efectoPlanta: "Major disruption: 100% of the product could be scrapped. Line stoppage"
      },
      {
        puntaje: 7,
        efectoProducto: "Degradation of primary function (vehicle operates with reduced performance)",
        efectoPlanta: "Significant disruption: Part of the batch may be scrapped"
      },
      {
        puntaje: 6,
        efectoProducto: "Loss of secondary function (vehicle operates, but comfort items are inoperative)",
        efectoPlanta: "Moderate disruption: 100% of the batch may require rework"
      },
      {
        puntaje: 5,
        efectoProducto: "Degradation of secondary function (reduced performance in comfort items)",
        efectoPlanta: "Moderate disruption: Part of the batch may require rework"
      },
      {
        puntaje: 4,
        efectoProducto: "Appearance issue or noise perceived by the majority (>75%) of customers",
        efectoPlanta: "Moderate disruption: Rework before processing"
      },
      {
        puntaje: 3,
        efectoProducto: "Appearance issue or noise perceived by many (~50%) customers",
        efectoPlanta: "Moderate disruption: Partial rework before processing"
      },
      {
        puntaje: 2,
        efectoProducto: "Appearance issue or noise perceived by a minority (<25%) of customers",
        efectoPlanta: "Minor disruption: Slight inconvenience to the process"
      },
      {
        puntaje: 1,
        efectoProducto: "No noticeable effects",
        efectoPlanta: "No noticeable effects"
      }
    ];
  
    res.render('severity', { datosFMEA });
  });

  router.get('/ocui', (req, res) => {
    const datosOcurrencia = [
      {
        puntaje: 10,
        probabilidad: "Very High",
        ocurrencia: "More than 1 in 2"
      },
      {
        puntaje: 9,
        probabilidad: "Very High",
        ocurrencia: "1 in 3"
      },
      {
        puntaje: 8,
        probabilidad: "High",
        ocurrencia: "1 in 8"
      },
      {
        puntaje: 7,
        probabilidad: "Moderately High",
        ocurrencia: "1 in 20"
      },
      {
        puntaje: 6,
        probabilidad: "Moderate",
        ocurrencia: "1 in 80"
      },
      {
        puntaje: 5,
        probabilidad: "Low",
        ocurrencia: "1 in 400"
      },
      {
        puntaje: 4,
        probabilidad: "Very Low",
        ocurrencia: "1 in 2,000"
      },
      {
        puntaje: 3,
        probabilidad: "Remote",
        ocurrencia: "1 in 15,000"
      },
      {
        puntaje: 2,
        probabilidad: "Very Remote",
        ocurrencia: "1 in 150,000"
      },
      {
        puntaje: 1,
        probabilidad: "Almost Impossible",
        ocurrencia: "1 in 1,500,000"
      }
    ];
  
    res.render('ocurrence', { datosOcurrencia });
  });
  
  router.get('/deti', (req, res) => {
    const datosDeteccion = [
      {
        puntaje: 10,
        oportunidad: "No opportunity for detection",
        descripcion: "No process control; Control cannot detect or is not analyzed",
        probabilidad: "Almost Impossible"
      },
      {
        puntaje: 9,
        oportunidad: "Detection unlikely at any stage",
        descripcion: "Failure mode or cause is not easily detected; indirect/random checks",
        probabilidad: "Very Remote"
      },
      {
        puntaje: 8,
        oportunidad: "Detection after process",
        descripcion: "Detected by operator using visual/tactile/auditory means after process",
        probabilidad: "Remote"
      },
      {
        puntaje: 7,
        oportunidad: "Detection at source",
        descripcion: "Detected at station by operator (visual/tactile/auditory) or after process by attribute checks",
        probabilidad: "Very Low"
      },
      {
        puntaje: 6,
        oportunidad: "Detection after process",
        descripcion: "Detected by operator using variable measurement after process or attribute check at station",
        probabilidad: "Low"
      },
      {
        puntaje: 5,
        oportunidad: "Detection at source",
        descripcion: "Detected at station by operator (variable check) or automated alert (light/alarm); includes setup or first-piece inspection",
        probabilidad: "Moderate"
      },
      {
        puntaje: 4,
        oportunidad: "Detection after process",
        descripcion: "Detected by automated control after process, which retains defective part automatically",
        probabilidad: "Moderately High"
      },
      {
        puntaje: 3,
        oportunidad: "Detection at source",
        descripcion: "Detected by automated control at station and retained automatically to stop processing",
        probabilidad: "High"
      },
      {
        puntaje: 2,
        oportunidad: "Error detection and/or prevention",
        descripcion: "Detected by automated control at station that prevents processing of defective parts",
        probabilidad: "Very High"
      },
      {
        puntaje: 1,
        oportunidad: "Detection not applicable; Error prevention",
        descripcion: "Error prevention due to design features; defects cannot be produced thanks to error-proof devices",
        probabilidad: "Almost Certain"
      }
    ];
  
    res.render('detection', { datosDeteccion });
  });
  


// Exports
module.exports = router