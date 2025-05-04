const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Modelos
const User = require('../models/user');
const Org = require('../models/org');
const Cus = require('../models/cus');
const Par = require('../models/par');
const Ope = require('../models/ope');
const Chr = require('../models/chr');
const Fme = require('../models/fme');
const Pro = require('../models/pro');
const Pcp = require('../models/pcp');
const Ace = require('../models/ace');

// Mapeo de entidades
const entidades = {
  user: { modelo: User, vista: 'edit_user' },
  org:  { modelo: Org,  vista: 'edit_org' },
  cus:  { modelo: Cus,  vista: 'edit_cus' },
  par:  { modelo: Par,  vista: 'edit_par' },
  ope:  { modelo: Ope,  vista: 'edit_ope' },
  chr:  { modelo: Chr,  vista: 'edit_chr' },
  fme:  { modelo: Fme,  vista: 'edit_fme' },
  pro:  { modelo: Pro,  vista: 'edit_pro' },
  pcp:  { modelo: Pcp,  vista: 'edit_pcp' },
  ace:  { modelo: Ace,  vista: 'edit_ace' },
};

// Ruta principal: muestra resumen de todas las entidades
router.get('/auditoria', async (req, res) => {
  try {
    const resultados = await Promise.all(Object.keys(entidades).map(async (tipo) => {
      const datos = await entidades[tipo].modelo.find();
      return { tipo, datos };
    }));

    const contexto = Object.fromEntries(resultados.map(({ tipo, datos }) => [tipo + 's', datos]));
    res.render('auditoria', contexto);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la auditoría');
  }
});

// Ruta de edición GET
router.get('/auditoria/:tipo/:id', async (req, res) => {
  const { tipo, id } = req.params;

  if (!entidades[tipo]) return res.status(404).send('Entidad no válida');
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('ID no válido');

  try {
    const entidad = await entidades[tipo].modelo.findById(id);
    if (!entidad) return res.status(404).send('Registro no encontrado');

    res.render(entidades[tipo].vista, { [tipo]: entidad });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar los datos');
  }
});

// Ruta de edición POST
router.post('/auditoria/:tipo/:id', async (req, res) => {
  const { tipo, id } = req.params;
  const datosActualizados = req.body;

  if (!entidades[tipo]) return res.status(404).send('Entidad no válida');
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send('ID no válido');

  try {
    const modelo = entidades[tipo].modelo;
    const entidad = await modelo.findByIdAndUpdate(id, datosActualizados, { new: true });

    if (!entidad) return res.status(404).send('Registro no encontrado');

    res.redirect('/auditoria');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar los cambios');
  }
});

module.exports = router;
