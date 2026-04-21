-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS inventario_adso;

-- 2. Crear el usuario restringido a localhost
CREATE USER 'app_user'@'localhost' IDENTIFIED BY '#ADSO_node';

-- 3. Asignar todos los privilegios de ESA base de datos a ESTE usuario
GRANT ALL PRIVILEGES ON inventario_adso.* TO 'app_user'@'localhost';

-- 4. Aplicar los cambios de privilegios inmediatamente
FLUSH PRIVILEGES;

-- 5. Seleccionar la base de datos para empezar a crear las tablas
USE inventario_adso;

-- 6. Crear la tabla de Categorías (Debe ir primero porque no depende de nadie)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_ud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_up TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Crear la tabla de Productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    created_ud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_up TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Definición de la Llave Foránea con restricción de eliminación
    CONSTRAINT fk_product_category 
    FOREIGN KEY (category_id) 
    REFERENCES categories(id)
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
);

-- 8. Modificamos la tabla productos para poder almacenar los precios
ALTER TABLE products ADD COLUMN price DECIMAL(10, 2) AFTER name;

-- 9. Crear la tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    document VARCHAR(20) NOT NULL UNIQUE, 
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(250),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- ESQUEMA DE PRUEBA PARA LA RELACION DE USER CON SUS PERMISOS: 

-- === TABLA USERS & PERMISSIONS ===
-- 10. Crear tabla de Roles (Admin, Empleado, etc.)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- Ej: 'admin', 'vendedor'
    description VARCHAR(255)
);

-- 11. Crear tabla de Permisos (La unidad mínima de acción)
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_name VARCHAR(100) NOT NULL UNIQUE, -- Ej: 'products.create', 'users.delete'
    description VARCHAR(255)
);


-- === TABLAS => RELACION ROL Y PERMISOS ===

-- 12. Tabla intermedia: Usuarios <-> Roles
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 13. Tabla intermedia: Roles <-> Permisos
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);