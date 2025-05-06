import { pool} from '../connection/db';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

//obtener productos
export const getProduct = async (req: any, res: any) => {
  try {
    const { categoryId } = req.query;

    let query = `
      SELECT 
        p.IdProduct, 
        p.ProductName, 
        p.Description, 
        c.Category, 
        p.Price, 
        p.Image,
        p.Stock,
        p.OriginalPrice AS originalPrice,
        p.DiscountPercentage AS discountPercentage
      FROM Products p
      LEFT JOIN Category c ON p.IdCategory = c.IdCategory
    `;
    const values: any[] = [];

    if (categoryId && categoryId !== 'all') {
      query += " WHERE p.IdCategory = ?";
      values.push(Number(categoryId));
    }

    const [results]: any = await pool.query(query, values);

    const formattedResults = results.map((product: any) => ({
      IdProduct: product.IdProduct,
      ProductName: product.ProductName,
      Description: product.Description,
      Category: product.Category,
      Price: parseFloat(product.Price),
      Image: `http://localhost:3000/images/products/${product.Image}`,
      Stock: product.Stock,
      originalPrice: product.originalPrice !== null ? parseFloat(product.originalPrice) : null,
  discountPercentage: product.discountPercentage !== null ? parseFloat(product.discountPercentage) : null
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

//obtener categorias
export const getCategories = async (req: any, res: any) => {
    try {
      const [results]: any = await pool.query(`
        SELECT IdCategory, Category, Description 
        FROM category
      `);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      res.status(500).json({ error: "Error al obtener categorías" });
    }
};

//obtener detalles del producto
export const getProductDetails = async (req: any, res: any) => {
  const { id } = req.params;
  
    try {
      const query = `
        SELECT
          p.IdProduct,
          p.ProductName,
          p.Description,
          p.Price,
          p.Stock,
          p.Image,
          p.OriginalPrice,
          p.DiscountPercentage,
          c.Category,
          AVG(r.Rating) AS averageRating
        FROM Products p
        LEFT JOIN Category c ON p.IdCategory = c.IdCategory
        LEFT JOIN Reviews r ON p.IdProduct = r.IdProduct
        WHERE p.IdProduct = ?
        GROUP BY p.IdProduct;
      `;
      const values = [id]; // Usar el ID convertido a número
  
      const [results]: any = await pool.query(query, values);
  
      if (results.length === 0) {
        // No se encontró ningún producto con ese ID
        return res.status(404).json({ error: 'Product not found.' });
      }
  
      const productData = results[0];
  
      const formattedProduct = {
        IdProduct: productData.IdProduct,
        ProductName: productData.ProductName,
        Description: productData.Description,
        Price: productData.Price, 
        Stock: productData.Stock, 
        Image: `http://localhost:3000/images/products/${productData.Image}`,
        Category: productData.Category,
        averageRating: productData.averageRating || 0, 
        OriginalPrice: productData.OriginalPrice, 
        DiscountPercentage: productData.DiscountPercentage, 
        CreatedAt: productData.CreatedAt,
      };
  
      // Se retorna el producto encontrado
      res.status(200).json(formattedProduct); // Devolver el objeto formateado, no un array
  
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      // En caso de error interno del servidor
      res.status(500).json({ error: 'Error retrieving product details.' });
    }
};

// Enviar una reseña
export const sendReview = async (req: any, res: any) => {
  const { IdUser, IdProduct, comment, rating } = req.body;
  if (!IdUser || !IdProduct || !comment || !rating) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    const query = `
      INSERT INTO Reviews (Review, Rating, IdProduct, IdUser, CreatedAt)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const values = [comment, rating, IdProduct, IdUser];
    const [result]: any = await pool.query(query, values);
    
    if (result.affectedRows > 0) {
      return res.status(201).json({
        IdReview: result.insertId,  // Agregado: el ID generado
        IdUser: IdUser,
        IdProduct: IdProduct,
        Review: comment,
        Rating: rating,
        CreatedAt: new Date().toISOString(),
      });
    }
    return res.status(500).json({ message: 'Review insertion failed.' });
  } catch (error) {
    console.error("Error sending review:", error);
    res.status(500).json({ message: 'Error sending review.' });
  }
};

// Obtener reseñas por IdProduct
export const getReviews = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        IdReview,
        Review,
        Rating,
        IdProduct,
        IdUser,
        CreatedAt
      FROM Reviews
      WHERE IdProduct = ?
      ORDER BY CreatedAt DESC
    `;
    const values = [id];
    const [results]: any = await pool.query(query, values);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this product.' });
    }

    // Extraer los IdUser únicos de las reseñas
    const userIds = [...new Set(results.map((r: any) => r.IdUser))];

    const userServiceUrl = 'http://localhost:4001/api/users';
    const userResponse = await axios.get(userServiceUrl, {
      params: { ids: userIds.join(',') }
    });

    // Suponemos que userResponse.data es un arreglo de usuarios con IdUser y username
    const users = userResponse.data;
    const userMap: { [key: number]: string } = {};
    users.forEach((user: any) => {
      userMap[user.IdUser] = user.UserName;
    });

    // Mapear las reseñas agregando el username obtenido del otro microservicio
    const reviewsWithUsername = results.map((review: any) => ({
      ...review,
      username: userMap[review.IdUser] || `User ${review.IdUser}`
    }));

    res.status(200).json(reviewsWithUsername);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: 'Error fetching reviews.' });
  }
};

//Añadir al carrito
export const addCart = async (req: any, res: any) => {
  const { IdUser, IdProduct, Quantity } = req.body;

  if (!IdUser || !IdProduct || !Quantity) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Verificar si ya existe en el carrito
    const checkQuery = `
      SELECT Quantity FROM cart WHERE IdUser = ? AND IdProduct = ?
    `;
    const [checkResult]: any = await pool.query(checkQuery, [IdUser, IdProduct]);

    if (checkResult.length > 0) {
      // Ya existe, actualizar cantidad
      const newQuantity = checkResult[0].Quantity + Quantity;
      const updateQuery = `
        UPDATE cart SET Quantity = ?, CreatedAt = NOW()
        WHERE IdUser = ? AND IdProduct = ?
      `;
      const [updateResult]: any = await pool.query(updateQuery, [newQuantity, IdUser, IdProduct]);

      if (updateResult.affectedRows > 0) {
        return res.status(200).json({
          message: 'Cart updated successfully.',
          cart: {
            IdUser: IdUser,
            IdProduct: IdProduct,
            Quantity: newQuantity,
            UpdatedAt: new Date().toISOString(),
          }
        });
      }

      return res.status(500).json({ message: 'Failed to update cart.' });

    } else {
      // No existe, hacer insert
      const insertQuery = `
        INSERT INTO cart (IdUser, IdProduct, Quantity, CreatedAt)
        VALUES (?, ?, ?, NOW())
      `;
      const [insertResult]: any = await pool.query(insertQuery, [IdUser, IdProduct, Quantity]);

      if (insertResult.affectedRows > 0) {
        return res.status(201).json({
          message: 'Product added to cart.',
          cart: {
            IdUser: IdUser,
            IdProduct: IdProduct,
            Quantity: Quantity,
            CreatedAt: new Date().toISOString(),
          }
        });
      }

      return res.status(500).json({ message: 'Failed to add product to cart.' });
    }

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: 'Error adding to cart.' });
  }
};

//contador del carrito
export const cartCount = async (req: any, res: any) => {
  const { IdUser } = req.params;

  if (!IdUser) {
    return res.status(400).json({ message: 'Missing IdUser parameter.' });
  }

  try {
    const query = `
      SELECT SUM(Quantity) AS count
      FROM cart
      WHERE IdUser = ?
    `;
    const values = [IdUser];
    const [results]: any = await pool.query(query, values);

    const count = results[0]?.count ?? 0;

    return res.status(200).json({ IdUser, cartCount: count });
  } catch (error) {
    console.error("Error counting cart items:", error);
    res.status(500).json({ message: 'Error fetching cart count.' });
  }
};

// Obtener carrito por id usuario
export const getCart = async (req: any, res: any) => {
  const { IdUser } = req.params;

  if (!IdUser) {
    return res.status(400).json({ message: 'Missing required IdUser parameter.' });
  }

  try {
    const query = `
      SELECT c.IdCart, c.IdUser, c.IdProduct, c.Quantity, 
      p.ProductName, p.Price, p.Image
      FROM cart c
      LEFT JOIN products p ON c.IdProduct = p.IdProduct
      WHERE c.IdUser = ?
    `;
    
    const [results]: any = await pool.query(query, [IdUser]);
    
    // Mapear los resultados al formato esperado
    const formattedCart = results.map((cart: any) => ({
      IdCart: cart.IdCart,
      IdUser: cart.IdUser,
      producto: {
        IdProduct: cart.IdProduct,
        ProductName: cart.ProductName,
        Description: cart.Description,
        Price: cart.Price,
        Image: `http://localhost:3000/images/products/${cart.Image}`
      },
      Quantity: cart.Quantity,
    }));
  
    return res.status(200).json(formattedCart);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ message: 'Error fetching cart items.' });
  }
};

// Actualizar conteo del carrito
export const updateCartItem = async (req: any, res: any) => {
  const { IdCart } = req.params; // Corregido: no usar req.params.IdCart
  const { Quantity } = req.body;
  
  console.log("UpdateCartItem called with:", { IdCart, Quantity });

  if (!IdCart || !Quantity) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  if (Quantity <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor que cero' });
  }

  try {
    const query = `
      UPDATE cart
      SET Quantity = ?, CreatedAt = NOW()
      WHERE IdCart = ?
    `;
    const [result]: any = await pool.query(query, [Quantity, IdCart]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Cart item updated successfully.' });
    }
    return res.status(404).json({ message: 'Cart item not found.' });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({ message: 'Error updating cart item.' });
  }
};

// Eliminar producto del carrito
export const deleteCartItem = async (req: any, res: any) => {
  const { IdCart } = req.params; // Corregido: no usar req.params.IdCart

  if (!IdCart) {
    return res.status(400).json({ message: 'Missing required IdCart parameter.' });
  }

  try {
    const query = `
      DELETE FROM cart
      WHERE IdCart = ?
    `;
    const [result]: any = await pool.query(query, [IdCart]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Cart item deleted successfully.' });
    }
    return res.status(404).json({ message: 'Cart item not found.' });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({ message: 'Error deleting cart item.' });
  }
};

//Vaciar el carrito del usuario
export const deleteCart = async (req: any, res: any) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'Falta userId en body.' });
  }

  try {
    const query = `
      DELETE FROM cart
      WHERE IdUser = ?
    `;
    const [result]: any = await pool.query(query, [userId]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Carrito vaciado exitosamente.' });
    } else {
      return res.status(404).json({ message: 'No se encontraron items para ese usuario.' });
    }
  } catch (error) {
    console.error('Error vaciando carrito:', error);
    return res.status(500).json({ message: 'Error al vaciar el carrito.' });
  }
};

// Obtener wishlist de un usuario
export const getWishlist = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT w.IdProduct, p.ProductName, p.Price, p.Image
      FROM wishlist w
      JOIN products p ON w.IdProduct = p.IdProduct
      WHERE w.IdUser = ?
      ORDER BY w.CreatedAt DESC;
    `;
    const [rows]: any = await pool.query(query, [userId]);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ error: 'Error retrieving wishlist.' });
  }
};

// Añadir/quitar producto de wishlis
export const toggleWishlist = async (req: any, res: any) => {
  const { userId, productId } = req.body;
  try {
    // 1) ¿Ya está?
    const [exists]: any = await pool.query(
      'SELECT 1 FROM wishlist WHERE IdUser = ? AND IdProduct = ?',
      [userId, productId]
    );
    if (exists.length) {
      // eliminar
      await pool.query(
        'DELETE FROM wishlist WHERE IdUser = ? AND IdProduct = ?',
        [userId, productId]
      );
      return res.status(200).json({ message: 'Removed from wishlist.' });
    } else {
      // insertar
      await pool.query(
        'INSERT INTO wishlist (IdUser, IdProduct) VALUES (?, ?)',
        [userId, productId]
      );
      return res.status(201).json({ message: 'Added to wishlist.' });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return res.status(500).json({ error: 'Error updating wishlist.' });
  }
};

/*//Insertar un producto en la base de datos
export const insertProduct = async (req: any, res: any) => {
  try {
      const { ProductName, Description, Category, Price, Stock, Image} = req.body;  
      if (!ProductName || !Description || !Category || !Price || !Stock || !Image) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      if (isNaN(Price)) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
      }
      
      // Obtener la categoria
      let [statusResult]: any = await pool.query(
          'SELECT IdCategory FROM Category WHERE Category = ?',
          [Category]
      );

      let IdCategory;
      if (statusResult.length > 0) {
          // Si existe, usar el Id encontrado
          IdCategory = statusResult[0].IdCategory;
      } else {
          // Si NO existe, insertarlo y obtener el nuevo ID
          const [insertStatus]: any = await pool.query(
              'INSERT INTO category (Category) VALUES (?)',
              [Category]
          );
          IdCategory = insertStatus.insertId;
      }

      const sql = 'INSERT INTO products (ProductName, Description, IdCategory, Price, Stock, Image, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, now())';
      const values = [ProductName, Description, IdCategory, Price, Stock, Image];

      const [result] = await pool.query(sql, values);
      res.status(201).json({ message: '✅ Producto insertado correctamente' });
  } catch (error) {
      console.error('❌ Error inesperado:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar un producto en la base de datos
export const updateProduct = async (req: any, res: any) => {
  try {
      const { id } = req.params;
      const { ProductName, Description, IdCategory, Price, Stock, Image} = req.body;

      if (!id) {
      return res.status(400).json({ error: 'El id del producto es obligatorio' });
      }
      if (!ProductName || !Description || !IdCategory || !Price || !Stock || !Image) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
      if (isNaN(Price)) {
      return res.status(400).json({ error: 'El precio debe ser un número válido' });
      }

      const sql = 'UPDATE products SET ProductName = ?, Description = ?, IdCategory = ?, Price = ?, Stock = ?, Image = ? WHERE id = ?';
      const values = [ProductName, Description, IdCategory, Price, Stock, Image, id];

      const [result]: any = await pool.query(sql, values);
      if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.status(200).json({ message: '✅ Producto actualizado correctamente' })
  } catch (error) {
      console.error('❌ Error inesperado:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un producto en la base de datos
export const deleteProduct = async (req: any, res: any) => {
  try {
      const { id } = req.params;

      if (!id) {
      return res.status(400).json({ error: 'El id del producto es obligatorio' });
      }

      const sql = 'DELETE FROM products WHERE id = ?';
      const [result]: any = await pool.query(sql, [id]);
      if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.status(200).json({ message: '✅ Producto eliminado correctamente' });
  } catch (error) {
      console.error('❌ Error inesperado:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }

};*/