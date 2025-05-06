import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path = require('path');
import FormData from 'form-data';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

dotenv.config();

const app = express();
app.use(cors());

//imagenes de productos
app.use('/images', express.static(path.join(__dirname, '../public/images')));

//subida de imagenes de mascotas
app.use('/uploads', async (req:any, res:any) => {
  try {
    const imagePath = req.originalUrl.replace('/uploads', ''); // captura todo lo que sigue
    const proxyUrl = `http://localhost:4002/uploads${imagePath}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      return res.status(response.status).send('Imagen no encontrada en el microservicio Pets');
    }

    const buffer = await response.arrayBuffer();
    res.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('Error al obtener la imagen del microservicio Pets:', error);
    res.status(500).send('Error interno al obtener la imagen');
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//URL del servicio de productos
const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || "http://localhost:4000/api/products";
//URL del servicio de usuarios
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || "http://localhost:4001/api/users";
//URL del servicio de mascotas
const PETS_SERVICE_URL = process.env.PETS_SERVICE_URL || "http://localhost:4002/api/pets";


app.get("/", (req, res) => {
    res.send("API Gateway Se esta ejecutando");
});


{/* Puerto 4000: Productos */}

//obtener productos
app.get("/api/products", async (req, res) => {
  try {
    // Reenviar la query completa
    const respuesta = await axios.get(PRODUCTS_SERVICE_URL, {
      params: req.query
    });

    res.json(respuesta.data);
  } catch (error) {
    console.error("Error al obtener productos:", (error as Error).message);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

//Obtener detalles de un producto
app.get('/api/products/details/:Id', async (req, res) => {
  try {
    const { Id } = req.params;
    // Redirigir a la ruta del microservicio: /details/:IdCart
    const respuesta = await axios.get(`${PRODUCTS_SERVICE_URL}/details/${Id}`);
    res.json(respuesta.data);
  } catch (error: any) {
    console.error("Error al obtener los detalles del producto:", error.message);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

//obtener categorias
app.get("/api/products/getCategories", async (req, res) => {
    try {
        const url = `${PRODUCTS_SERVICE_URL}/getCategories`;
          const respuesta = await axios.get(url);
          res.json(respuesta.data);
      } catch (error) {
          console.error("Error al obtener categorias:", (error as Error).message);
          res.status(500).json({ error: "Error al obtener las categorias" });
          } 
});

//Enviar una reseña
app.post('/api/products/sendReview', async (req, res) => {
  try {
    const respuesta = await axios.post(`${PRODUCTS_SERVICE_URL}/sendReview`, req.body);
    res.json(respuesta.data);
  } catch (error: any) {
    console.error("Error al enviar la reseña:", error.message);
    res.status(500).json({ error: "Error al enviar la reseña" });
  }
});

//Obtener reseñas por producto
app.get('/api/products/getReviews/:IdProduct', async (req, res) => {
  try {
    const { IdProduct } = req.params;
    const respuesta = await axios.get(`${PRODUCTS_SERVICE_URL}/getReviews/${IdProduct}`);
    res.json(respuesta.data);
  } catch (error: any) {
    console.error("Error al obtener reseñas:", error.message);
    res.status(500).json({ error: "Error al obtener las reseñas" });
  }
});
  
//Añadir producto al carrito
app.post('/api/products/addCart', async (req, res) => {
  try {
    const respuesta = await axios.post(`${PRODUCTS_SERVICE_URL}/addCart`, req.body);
    res.json(respuesta.data);
  } catch (error: any) {
    console.error("Error al añadir al carrito:", error.message);
    res.status(500).json({ error: "Error al añadir al carrito" });
  }
});

//Obtener conteo de productos en el carrito por IdUser
app.get('/api/products/cartCount/:IdUser', async (req, res) => {
  try {
    const { IdUser } = req.params;
    const respuesta = await axios.get(`${PRODUCTS_SERVICE_URL}/cartCount/${IdUser}`);
    res.json(respuesta.data);
  } catch (error: any) {
    console.error("Error al obtener el contador del carrito:", error.message);
    res.status(500).json({ error: "Error al obtener el contador del carrito" });
  }
});

//obtener carrito
app.get('/api/products/getCart/:IdUser', async (req, res) => {
  try {
    const { IdUser } = req.params;
    const respuesta = await axios.get(`${PRODUCTS_SERVICE_URL}/getCart/${IdUser}`);
    res.json(respuesta.data);
  } catch (error: any) {
    console.error("Error fetching cart items:", error.message);
    res.status(500).json({ error: "Error fetching cart items" });
  }
});

//actualizar conteo del carrito
app.patch('/api/products/updateCartItem/:IdCart', async (req, res) => {
  try {
    const { IdCart } = req.params;
    // Pasar el cuerpo de la solicitud (req.body) a axios
    const respuesta = await axios.patch(`${PRODUCTS_SERVICE_URL}/updateCartItem/${IdCart}`, req.body);
    res.json(respuesta.data);
  } catch (error: any) {
    console.error("Error updating cart item:", error.message);
    // Es mejor enviar el código de estado original del microservicio si está disponible
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({ 
      error: "Error updating cart item",
      details: error.response?.data || error.message 
    });
  }
});

//eliminar producto del carrito
app.delete('/api/products/deleteCartItem/:IdCart', async (req, res) => {
  try {
    const { IdCart } = req.params;
    const respuesta = await axios.delete(`${PRODUCTS_SERVICE_URL}/deleteCartItem/${IdCart}`);
    res.json(respuesta.data);
  } catch (error: any) {
    console.error("Error deleting cart item:", error.message);
    res.status(500).json({ error: "Error deleting cart item" });
  }
});

//Vaciar carrito del usuario
app.delete('/api/products/deleteCart', async (req, res) => {
  try {
    const { userId } = req.body;
    const response = await axios.delete(`${PRODUCTS_SERVICE_URL}/deleteCart`, {
      data: { userId }
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Error emptying cart via gateway:', error.message);
    res.status(500).json({ error: 'Error vaciando el carrito' });
  }
});

// Obtener wishlist de un usuario
app.get('/api/products/getWishlist/:userId', async (req, res) => {
  console.log('GET /api/products/getWishlist/', req.params.userId);
  try {
    const response = await axios.get(`${PRODUCTS_SERVICE_URL}/getWishlist/${req.params.userId}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching wishlist.' });
  }
});

// Añadir/quitar de wishlist
app.post('/api/products/toggleWishlist', async (req, res) => {
  console.log('POST /api/products/toggleWishlist', req.body);
  try {
    const response = await axios.post(`${PRODUCTS_SERVICE_URL}/toggleWishlist`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating wishlist.' });
  }
});

{/* Puerto 4001: Usuarios */}

//Obtener Uusuarios
app.get("/api/users", async (req, res) => {
  try {
      const url = `${USERS_SERVICE_URL}`;
      const respuesta = await axios.get(url);
      res.json(respuesta.data);
  } catch (error) {
      console.error("Error al obtener usuarios:", (error as Error).message);
      res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

//Obtener usuario por id
app.get("/api/users/getUserById/:Id", async (req, res) => {
  try {
    const { Id } = req.params;
    const url = `${USERS_SERVICE_URL}/getUserById/${Id}`;
    
    const respuesta = await axios.get(url); // No necesitas pasar req.body
    
    res.status(respuesta.status).json(respuesta.data);
  } catch (error: any) {
    console.error("Error al obtener el usuario:", error.message);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

//obtener roles
app.get("/api/users/getRoles", async (req, res) => {
    try {
      const url = `${USERS_SERVICE_URL}/getRoles`;
        const respuesta = await axios.get(url);
        res.json(respuesta.data);
    } catch (error) {
        console.error("Error al obtener roles:", (error as Error).message);
        res.status(500).json({ error: "Error al obtener los roles" });
        }  
});

//registrar usaurios
app.post("/api/users/registerUsers", async (req, res) => {
    try {
        const url = `${USERS_SERVICE_URL}/registerUsers`;
        const respuesta = await axios.post(url, req.body);
        res.status(respuesta.status).json(respuesta.data);
    } catch (error) {
        console.error("Error al registrar usuario:", (error as Error).message);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
});

//Inicio de sesion
app.post("/api/users/loginUsers", async (req, res) => {
    try {
        const url = `${USERS_SERVICE_URL}/loginUsers`;
        const respuesta = await axios.post(url, req.body);
        res.status(respuesta.status).json(respuesta.data);
    } catch (error) {
        console.error("Error al Iniciar sesion", (error as Error).message);
        res.status(500).json({ error: "Error al intentar iniciar sesion" });
    }
});

//obtener veterinario por id
app.get('/api/users/getVeterinarian/:IdVeterinarian', async (req, res) => {
  try {
    const { IdVeterinarian } = req.params;
    const respuesta = await axios.get(
      `${USERS_SERVICE_URL}/getVeterinarian/${IdVeterinarian}`
    );
    res.status(respuesta.status).json(respuesta.data);
  } catch (error) {
    console.error('Error al obtener veterinario:', (error as Error).message);
    res.status(500).json({ error: 'Error al obtener veterinario' });
  }
});

{/* Puerto 4002: Mascotas */}

//Obtener mascotas por id del usuario
app.get("/api/pets/getPetsByUser/:IdUser", async (req, res) => {
  try {
    const { IdUser } = req.params;
    const url = `${PETS_SERVICE_URL}/getPetsByUser/${IdUser}`;
    const respuesta = await axios.get(url);
    res.status(respuesta.status).json(Array.isArray(respuesta.data) ? respuesta.data : []);
  } catch (error) {
    console.error("Error al obtener Mascotas:", (error as Error).message);
    res.status(500).json({ error: "Error al obtener a las Mascotas" });
  }
});

//Obtener detalles medicos de la mascota por id
app.get('/api/pets/details/:IdPet', async (req,res) => {
  const { IdPet } = req.params;
  const url = `${PETS_SERVICE_URL}/details/${IdPet}`;
  const response = await axios.get(url);
  res.json(response.data);
});

//Registro de Mascotas
app.post("/api/pets/register", upload.single('Imagen'), async (req, res) => {
  try {
      const form = new FormData();

      // Añadir los campos del body manualmente
      Object.entries(req.body).forEach(([key, value]) => {
          form.append(key, value as string);
      });

      // Añadir el archivo si existe
      if (req.file) {
        form.append('imagen', req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });
      }
      

      const respuesta = await axios.post(`${PETS_SERVICE_URL}/register`, form, {
          headers: form.getHeaders(),
      });

      res.status(respuesta.status).json(respuesta.data);
  } catch (error) {
      console.error("Error al insertar la Mascota:", error);
      res.status(500).json({ error: "Error al insertar a tu Mascota" });
  }
});

//Obtener el estado de las mascotas
app.get("/api/pets/getPetStatus", async (req, res) => {
  try {
      const url = `${PETS_SERVICE_URL}/getPetStatus`;
      const respuesta = await axios.get(url);
      res.json(respuesta.data);
  } catch (error) {
      console.error("Error al obtener estados de mascotas:", (error as Error).message);
      res.status(500).json({ error: "Error al obtener los estados de las mascotas" });
  }
});

//Obtener las especies de mascotas
app.get("/api/pets/getPetSpecies", async (req, res) => {
  try {
      const url = `${PETS_SERVICE_URL}/getPetSpecies`;
      const respuesta = await axios.get(url);
      res.json(respuesta.data);
  } catch (error) {
      console.error("Error al obtener especies de mascotas:", (error as Error).message);
      res.status(500).json({ error: "Error al obtener las especies de las mascotas" });
  }
});

//Obtener Citas
app.get('/api/pets/getAppointments/:petId', async (req, res) => {
  const { petId } = req.params;
  const url = `${PETS_SERVICE_URL}/getAppointments/${petId}`;
  const respuesta = await axios.get(url);
  res.status(respuesta.status).json(respuesta.data);
});

//Obtener mascotas
app.get("/api/pets/getPets", async (req, res) => {
  try {
    const url = `${PETS_SERVICE_URL}/getPets`;
    const respuesta = await axios.get(url);
    res.json(respuesta.data);
  } catch (error) {
    console.error("Error al obtener las Mascotas:", (error as Error).message);
    res.status(500).json({ error: "Error al obtener a las Mascotas" });
  }
});

//Obtener mascotas por id
app.get("/api/pets/getPetById/:IdPet", async (req, res) => {
  try {
    const { IdPet } = req.params;
    const url = `${PETS_SERVICE_URL}/getPetById/${IdPet}`;
    const respuesta = await axios.get(url);
    res.status(respuesta.status).json(respuesta.data);
  } catch (error) {
    console.error("Error al obtener Mascotas:", (error as Error).message);
    res.status(500).json({ error: "Error al obtener a las Mascotas" });
  }
});

//Actualizar Imagen de la mascota
app.put("/api/pets/updateImage/:petId", upload.single("image"), async (req: any, res: any) => {
  try {
    const { petId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó una imagen." });
    }

    // Creamos un FormData como si fuera un cliente
    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Hacemos la petición al microservicio de mascotas
    const response = await axios.put(
      `${PETS_SERVICE_URL}/updateImage/${petId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("Error al subir la imagen:", error.message);
    res.status(500).json({ error: "No se pudo subir la imagen." });
  }
});

//Obtener mascotas en adopcion
app.get("/api/pets/adoption", async (req, res) => {
  try {
    const url = `${PETS_SERVICE_URL}/adoption`;
    const respuesta = await axios.get(url);
    res.json(respuesta.data);
  } catch (error) {
    console.error("Error al obtener las Mascotas:", (error as Error).message);
    res.status(500).json({ error: "Error al obtener a las Mascotas" });
  }
});

//Puerto de ApiGateway
const PORT = process.env.PORT || 3000;

//Inicializar ApiGateway
app.listen(PORT, () => {
    console.log(`API Gateway Se esta ejecutando en el puerto:  ${PORT}`);
});
