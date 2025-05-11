const express = require('express');
const router = express.Router();
const { Part, Chrc, Insps } = require('../../src/models');

// Mostrar formulario de asignación
router.get('/asignar', async (req, res) => {
    try {
        const parts = await Part.find({}, '_id pa6').sort({ pa6: 1 });
        const characteristics = await Chrc.find().sort({ nombre: 1 });

        res.render('asignar-chrc', {
            parts,
            characteristics,
            success: req.query.success
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { error: 'Error al cargar datos' });
    }
});

router.post('/guardar-asignacion', async (req, res) => {
    try {
        const { partId, characteristics } = req.body;
        const part = await Part.findById(partId);

        if (!part) {
            return res.status(404).json({
                success: false,
                message: 'Parte no encontrada'
            });
        }

        if (!characteristics || !Array.isArray(characteristics) || characteristics.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe asignar al menos una característica'
            });
        }

        // Buscar si ya existe una entrada para esta parte
        let insps = await Insps.findOne({ partId: partId });

        // Preparar datos para Insps
        const inspsData = {
            partId: partId,
            pa6: part.pa6
        };

        // Limpiar todas las características primero
        for (let i = 1; i <= 8; i++) {
            inspsData[`ch${i}`] = null;
        }

        // Asignar las nuevas características (máximo 8)
        for (let i = 0; i < Math.min(characteristics.length, 8); i++) {
            inspsData[`ch${i + 1}`] = characteristics[i].charId;
        }

        if (insps) {
            // Actualizar existente
            Object.assign(insps, inspsData);
            await insps.save();
        } else {
            // Crear nuevo
            insps = await Insps.create(inspsData);
        }

        res.json({
            success: true,
            message: 'Asignación guardada correctamente',
            data: insps
        });
    } catch (error) {
        console.error('Error al guardar la asignación:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Obtener características asignadas a una parte
router.get('/obtener-asignaciones/:partId', async (req, res) => {
    const { partId } = req.params;
    try {
        const asignacion = await Insps.findOne({ partId: partId });
        const assignedCharIds = [];

        if (asignacion) {
            for (let i = 1; i <= 8; i++) {
                const charId = asignacion[`ch${i}`];
                if (charId) {
                    assignedCharIds.push(charId.toString()); // Convertir ObjectId a string
                }
            }
        }

        res.json({ 
            success: true, 
            assignedCharacteristics: assignedCharIds,
            pa6: asignacion?.pa6 || ''
        });
    } catch (error) {
        console.error('Error al obtener las asignaciones:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al obtener las asignaciones' 
        });
    }
});

module.exports = router;