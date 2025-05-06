import { pool } from '../connection/db';
const jwt = require('jsonwebtoken');
import bcrypt from 'bcrypt';

//Obtener todos los usuarios
export const getUsers = async (req: any, res: any) => {
  try {
      const [Users] = await pool.query('SELECT IdUser, Name, LastName, UserName, Email, Password, PhoneNumber, Address FROM Users');
      res.json(Users);
  } catch (error) {
      console.error('Error obteniendo Usuarios', error);
      res.status(500).json({ error: 'Error en el servidor' });
  }
};

//Obtener un usuario por id
export const getUserById = async (req: any, res: any) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'El id del usuario es obligatorio' });
      }
  
      const [results]: any = await pool.query(
        `
        SELECT u.IdUser, r.RolName, u.Name, u.LastName, u.UserName, u.Email, u.Password, u.PhoneNumber, u.Address
        FROM users u
        LEFT JOIN Roles r ON u.IdRole = r.IdRole
        WHERE u.IdUser = ?
        `,
        [id]
      );
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.status(200).json(results[0]);
    } catch (error) {
      console.error('❌ Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

//obtener Roles
export const getRoles = async (req: any, res: any) => {
    try {
        const [Roles] = await pool.query('SELECT IdRole, RolName FROM Roles');
        res.json(Roles);
    } catch (error) {
        console.error('Error obteniendo Roles:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

//Registro de Usuarios
export const registerUsers = async (req: any, res: any) => {
    try {
      // Se reciben las variables con los nombres que envía el frontend
        const {
        Role,
        Name,
        LastName,
        UserName,
        Email,
        Password,
        ConfirmPassword,
        PhoneNumber,
        Address,
        } = req.body;
  
      // Verifica que todos los campos estén presentes
        if (
        !Role ||
        !Name ||
        !LastName ||
        !UserName ||
        !Email ||
        !Password ||
        !ConfirmPassword || 
        !PhoneNumber ||
        !Address
        ) {
        return res
            .status(400)
            .json({ error: "Todos los campos son obligatorios" });
      }
  
      // Verificamos que Password y ConfirmPassword coincidan
        if (Password !== ConfirmPassword) {
            return res.status(400).json({ error: "Las contraseñas no coinciden" });
        }
  
      // Verificar si ya existe un usuario con el mismo Email o UserName
        const [existingUser]: any = await pool.query(
            "SELECT * FROM users WHERE Email = ? OR UserName = ?",
            [Email, UserName]
        );
        if (existingUser.length > 0) {
            return res
            .status(400)
            .json({ error: "El usuario o Email ya está en uso" });
        }
    
        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);
    
        // Insertar usuario en la base de datos
        const sql =
            "INSERT INTO users (IdRole, Name, LastName, UserName, Email, Password, PhoneNumber, Address, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        const values = [
            Role,
            Name,
            LastName,
            UserName,
            Email,
            hashedPassword,
            PhoneNumber,
            Address,
        ];
    
        await pool.query(sql, values);
    
        res.status(201).json({ message: "✅ Usuario registrado correctamente" });
        } catch (error) {
        console.error("❌ Error en el registro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
};  

//inicio de sesion
export const loginUsers = async (req: any, res: any) => {
    try {
        const { UserName, Password } = req.body;

      // Verificar que ambos campos estén presentes
        if (!UserName || !Password) {
            return res.status(400).json({ message: 'Por favor, completa todos los campos.' });
        }

      // Consultar el usuario en la base de datos
        const query = 'SELECT * FROM users WHERE UserName = ?';
        const [rows]: any = await pool.query(query, [UserName]);

      // Verificar si el usuario existe
        if (!rows || rows.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];

      // Verificar la contraseña
        const validPassword = await bcrypt.compare(Password, user.Password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
            }

      // Generar el token JWT
        const token = jwt.sign({ IdUser: user.IdUser, UserName: user.UserName }, 'secret_key', { expiresIn: '1h' });

      // Enviar la respuesta con el token y el nombre de usuario
        res.json({ token, UserName: user.UserName, IdUser: user.IdUser });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//Obtener Veterinario
export const getVeterinarian = async (req: any, res: any) => {
  try {
    const { IdVeterinarian } = req.params;
    if (!IdVeterinarian) {
      return res.status(400).json({ error: 'IdVeterinarian es requerido' });
    }

    const [rows]: any = await pool.query(
      `SELECT 
         IdVeterinarian,
         Name,
         Clinic,
         Phone,
         Rfc,
         Email,
         Adress,
         CreatedAt
       FROM Veterinarians
       WHERE IdVeterinarian = ?`,
      [IdVeterinarian]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo veterinario:', (error as Error).message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};