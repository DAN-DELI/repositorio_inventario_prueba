import pool from "../config/db.js";

export const UserModel = {
  // 1. Obtener todos los usuarios
  getAll: async () => {
    const [users] = await pool.query("SELECT * FROM users");
    return users;
  },

  // 2. Obtener un usuario por ID
  findById: async (id) => {
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return user[0] || null;
  },

  // 3. Obtener usuario por documento
  findByDocument: async (document) => {
    const [user] = await pool.query("SELECT * FROM users WHERE document = ?", [document]);
    return user[0] || null;
  },

  // 4. Actualizar usuario
  update: async (id, data) => {
    const [result] = await pool.query("UPDATE users SET ? WHERE id = ?", [data, id]);
    if (result.affectedRows === 0) return null;

    const [updatedUser] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return updatedUser[0];
  },

  // 5. Eliminar usuario
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // 6. Crear un nuevo usuario
  create: async (newUser) => {
    const { name, document, email, password_hash } = newUser;
    const [result] = await pool.query(
      "INSERT INTO users (name, document, email, password_hash) VALUES (?, ?, ?, ?)",
      [name, document, email, password_hash],
    );

    const [createdUser] = await pool.query("SELECT * FROM users WHERE id = ?", [result.insertId]);
    return createdUser[0];
  },

  // 7. Actualizar refresh_token
  updateRefreshToken: async (userId, refresh_token) => {
    await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?",
      [refresh_token, userId]
    );
  },

  // 8. Buscar usuario por refresh_token
  findByRefreshToken: async (refresh_token) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE refresh_token = ?",
      [refresh_token]
    );
    return rows[0] || null
  },

  // 9. Borra el refresh_token
  revokeRefreshToken: async (userId) => {
    await pool.query("UPDATE users SET refresh_token = NULL WHERE id = ?",
      [userId]
    );
  },

  // 10. Consultar permisos del usuario
  getPermissiosUser: async (id) => {
    return await pool.query(`SELECT DISTINCT p.action_name
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      INNER JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ?;`,
      [id]);
  }
};
