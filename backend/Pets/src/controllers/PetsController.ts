import { pool } from '../connection/db';
import axios from 'axios';

//conexion al microservicios de usuarios
const USERS_SERVICE_URL = 'http://localhost:4001/api/users';

//obtener mascotas
export const getPets = async (req: any, res: any) => {
  try {

    const [results]: any = await pool.query(`
      SELECT 
        p.IdPet, 
        p.PetName, 
        s.SpeciesName, 
        p.Breed, 
        p.Age, 
        p.Image, 
        ps.PetStatus, 
        p.IdUser
      FROM pets p
      LEFT JOIN petstatus ps ON p.IdPetStatus = ps.IdPetStatus
      LEFT JOIN species s ON p.IdSpecies = s.IdSpecies
      `);

      const formattedPets = results.map((pet: any) => ({
        ...pet,
        Image: pet.Image
          ? `http://localhost:3000/uploads/pets/${pet.Image}`
          : null,
      }));
  
    res.json(formattedPets);

  } catch (error) {
    console.error('❌ Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al obtener las mascotas' });
  }
};

//obtener Estados de la Mascota
export const getPetStatus = async (req: any, res: any) => {
  try {
      // Ejecutar la consulta
      const [rows] = await pool.query('SELECT IdPetStatus, PetStatus FROM PetStatus');

      // Enviar los resultados
      res.json(rows);

  } catch (error) {
      console.error('Error obteniendo PetStatus:', error);
      res.status(500).json({ error: 'Error en el servidor' });
  }
};

//obtener mascotas por id del usuario
export const getPetsByUser = async (req: any, res: any) => {
  try {
    const IdUser = req.params.IdUser;
    if (!IdUser) return res.status(400).json({ error: "IdUser es requerido" });

    // Consulta SQL actualizada con JOIN a petweightcontrol
    const [results] = await pool.query(`
      SELECT 
        p.IdPet,
        p.PetName,
        s.SpeciesName,
        p.Breed,
        p.Age,
        p.Image,
        ps.PetStatus,
        p.IdUser,
        (SELECT Weight 
        FROM petweightcontrol 
        WHERE IdPet = p.IdPet 
        ORDER BY RecordDate DESC 
        LIMIT 1) AS LastWeight
      FROM pets p
      LEFT JOIN petstatus ps ON p.IdPetStatus = ps.IdPetStatus
      LEFT JOIN species s ON p.IdSpecies = s.IdSpecies
      WHERE p.IdUser = ?
    `, [IdUser]);

    // Procesar resultados
    const petsWithData = await Promise.all(
      (results as any[]).map(async (pet) => {
        let ownerName = "Desconocido";
        try {
          const response = await axios.get(`http://localhost:4001/api/users/${pet.IdUser}`);
          ownerName = response.data.Name;
        } catch (error) {
          console.error(`Error obteniendo usuario: ${error}`);
        }

        return {
          ...pet,
          Owner: ownerName,
          Image: pet.Image ? `http://localhost:3000/uploads/pets/${pet.Image}` : null,
          LastWeight: pet.LastWeight || "No registrado" // Manejo de null
        };
      })
    );

    res.status(200).json(petsWithData);

  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//registro de mascotas
export const insertPet = async (req: any, res: any) => {
  const connection = await pool.getConnection(); // Obtener conexión para transacción
  try {
      await connection.beginTransaction(); // Iniciar transacción

      // 1. Insertar mascota en tabla 'pets' (sin el campo Weight)
      const { PetName, IdSpecies, Breed, Age, IdUser, IdPetStatus, Weight } = req.body;
      const Image = req.file?.filename || null;

      // Validaciones
      if (!PetName || !IdSpecies || !Breed || !Age || !IdUser || !IdPetStatus || !Weight) {
          return res.status(400).json({ message: 'Faltan datos requeridos' });
      }

      // Insertar en 'pets'
      const [petResult] = await connection.execute(
          `INSERT INTO pets (PetName, Breed, Age, IdUser, IdPetStatus, CreatedAt, Image, IdSpecies)
           VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`,
          [PetName, Breed, Age, IdUser, IdPetStatus, Image, IdSpecies]
      );

      // 2. Obtener ID de la mascota insertada
      const IdPet = (petResult as any).insertId; 

      // 3. Insertar peso inicial en 'petweightcontrol'
      await connection.execute(
          `INSERT INTO petweightcontrol (IdPet, Weight, RecordDate, Notes)
           VALUES (?, ?, CURDATE(), ?)`,
          [IdPet, Weight, "Peso inicial de la mascota"]
      );

      await connection.commit(); // Confirmar transacción
      res.status(201).json({ message: 'Mascota y peso inicial registrados' });

  } catch (error) {
      await connection.rollback(); // Revertir en caso de error
      console.error('Error:', error);
      res.status(500).json({ message: 'Error al registrar' });
  } finally {
      connection.release(); // Liberar conexión
  }
};

//Actualizar imagen de la mascota
export const updatePetImage = async (req: any, res: any) => {
  try {
    const petId = Number(req.params.petId);

    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ningún archivo de imagen.' });
    }

    const imageUrl = `${req.file.filename}`; // Ruta accesible (ajústala si sirves archivos con Express.static)
    console.log('Received file:', req.file);

    // Consulta SQL para actualizar la imagen
    const [result] = await pool.execute(
      'UPDATE pets SET Image = ? WHERE IdPet = ?',
      [imageUrl, petId]
    );

    console.log(`Imagen actualizada correctamente para mascota ID ${petId}: ${imageUrl}`);
    
    res.status(200).json({ 
      message: 'Imagen subida y actualizada correctamente.', 
      newImageUrl: imageUrl 
    });

  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({ message: 'Error interno al actualizar la imagen.' });
  }
};

//obtener Especie
export const getPetSpecies = async (req: any, res: any) => {
    try {
        const [Species] = await pool.query('SELECT IdSpecies, SpeciesName FROM Species');
        res.json(Species);
    } catch (error) {
        console.error('Error obteniendo la especie:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

//Obtener detalles de la mascota por id
export const getPetDetails = async (req: any, res: any) => {
  const { IdPet } = req.params;

  try {
    //Consultas para registros, vacunaciones y desparasitaciones
    const [records] = await pool.query(
      `SELECT r.RecordDate, rt.RecordTypes AS Type, r.Description, r.Notes
      FROM petrecords r
      LEFT JOIN recordtypes rt ON r.IdRecordTypes = rt.IdRecordTypes
      WHERE r.IdPet = ? ORDER BY r.RecordDate DESC`, [IdPet]);

    const [vaccinations] = await pool.query(
      `SELECT pv.VaccinationDate, pv.NextDue, v.VaccineName, sv.StatusName, pv.Notes
      FROM PetVaccinations pv
      LEFT JOIN Vaccines v ON pv.IdVaccine = v.IdVaccine
      LEFT JOIN StatusVaccination sv ON pv.IdStatus = sv.IdStatus
      WHERE pv.IdPet = ? ORDER BY pv.VaccinationDate DESC`, [IdPet]);

    const [dewormings] = await pool.query(
      `SELECT pd.DewormingDate, pd.NextDue, d.DewormerName, pd.Notes
      FROM PetDewormings pd
      LEFT JOIN Dewormers d ON pd.IdDewormer = d.IdDewormer
      WHERE pd.IdPet = ? ORDER BY pd.DewormingDate DESC`, [IdPet]);

    const [WeightControl] = await pool.query(
      `SELECT Weight,RecordDate,Notes
      FROM petweightcontrol
      WHERE IdPet = ? ORDER BY RecordDate DESC;`, [IdPet]);

    // Respuesta con los datos de la mascota y las demás consultas
    return res.json({
      records,
      vaccinations,
      dewormings,
      WeightControl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
};

//Obtener citas de la mascota por id
export const getAppointmentsByPet = async (req: any, res: any) => {
  try {
    const { petId } = req.params;
    if (!petId) {
      return res.status(400).json({ error: 'petId es requerido' });
    }

    // 1) Traigo las citas de la tabla “appoinments”
    const [rows]: any[] = await pool.query(
      `SELECT
         IdAppoinment       AS IdAppointment,
         AppoinmentDate     AS AppointmentDate,
         Reason,
         IdVeterinarian,
         IdStatusAppoinment AS IdStatusAppointment,
         CreatedAt,
         UpdateAt           AS UpdatedAt
       FROM appoinments
       WHERE IdPet = ?`,
      [petId]
    );

    console.log(`Encontradas ${rows.length} citas para la mascota ${petId}`);

    // 2) Enriquecer con datos del veterinario a través del Gateway
    const enriched = await Promise.all(
      rows.map(async (appt: any) => {
        try {
          const vetRes = await axios.get(
            // Ahora USERS_SERVICE_URL está bien formateado
            `${USERS_SERVICE_URL}/getVeterinarian/${appt.IdVeterinarian}`
          );
          appt.Veterinarian = vetRes.data;
        } catch (vetErr) {
          console.error('Error fetching veterinarian:', vetErr);
          appt.Veterinarian = null;
        }
        return appt;
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

//Obtener mascota por id
export const getPetById = async (req: any, res: any) => {
  const { IdPet } = req.params;
  try {
    const [rows]: any = await pool.query(`SELECT 
        p.IdPet, 
        p.PetName, 
        s.SpeciesName, 
        p.Breed, 
        p.Age, 
        p.Image, 
        ps.PetStatus, 
        p.IdUser
      FROM pets p
      LEFT JOIN petstatus ps ON p.IdPetStatus = ps.IdPetStatus
      LEFT JOIN species s ON p.IdSpecies = s.IdSpecies
      Where IdPet = ?`, [IdPet]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }


    const pet = rows[0];

    // 🖼️ Formatear la URL completa de la imagen:
    const formattedPet = {
      ...pet,
      Image: pet.Image
        ? `http://localhost:3000/uploads/pets/${pet.Image}`
        : null, // o una imagen por defecto si prefieres
    };

    res.status(200).json(formattedPet);
  } catch (error) {
    console.error("Error al obtener la mascota:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener todas las mascotas en adopción
export const getPetsInAdoption = async (req: any, res: any) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        p.IdPet, 
        p.PetName, 
        s.SpeciesName, 
        p.Breed, 
        p.Age, 
        p.Image, 
        ps.PetStatus, 
        p.IdUser,
        (SELECT Weight 
        FROM petweightcontrol 
        WHERE IdPet = p.IdPet 
        ORDER BY RecordDate DESC 
        LIMIT 1) AS LastWeight
      FROM pets p
      LEFT JOIN petstatus ps ON p.IdPetStatus = ps.IdPetStatus
      LEFT JOIN species s ON p.IdSpecies = s.IdSpecies
      WHERE ps.PetStatus = 'En adopci?n'
    `);

    const formattedPets = rows.map((pet: any) => ({
      ...pet,
      Image: pet.Image
        ? `http://localhost:3000/uploads/pets/${pet.Image}`
        : null, // o imagen por defecto
    }));

    res.status(200).json(formattedPets);
  } catch (error) {
    console.error("Error al obtener mascotas en adopción:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Actualizar los datos de una mascota
/*export const updatePet = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { PetName, Species, Breed, Age, Weight, IdPetStatus, IdUser } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'El ID de la mascota es obligatorio' });
        }

        const sql = 'UPDATE pets SET PetName = ?, Species = ?, Breed = ?, Age = ?, Weight = ?, IdPetStatus = ?, IdUser = ? WHERE IdPet = ?';
        const values = [PetName, Species, Breed, Age, Weight, IdPetStatus, IdUser, id];

        const [result]: any = await pool.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        res.status(200).json({ message: '✅ Mascota actualizada correctamente' });
    } catch (error) {
        console.error('❌ Error inesperado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};*/

// Eliminar una mascota de la base de datos
/*export const deletePet = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'El ID de la mascota es obligatorio' });
        }

        const sql = 'DELETE FROM pets WHERE IdPet = ?';
        const [result]: any = await pool.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        res.status(200).json({ message: '✅ Mascota eliminada correctamente' });
    } catch (error) {
        console.error('❌ Error inesperado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};*/