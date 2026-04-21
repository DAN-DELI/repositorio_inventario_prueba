# Matriz RBAC - Inventario ADSO

| Rol | Permiso Específico | Campo de Acción | Descripción |
|-----|-------------------|-----------------|-------------|
| user | category.get | GET /categories | Visualizar categorías |
| user | product.get | GET /products | Visualizar productos |
| admin | category.get | GET /categories | Visualizar categorías |
| admin | category.post | POST /categories | Crear categorías |
| admin | category.put | PUT /categories/:id | Actualizar categorías |
| admin | category.delete | DELETE /categories/:id | Eliminar categorías |
| admin | product.get | GET /products | Visualizar productos |
| admin | product.post | POST /products | Crear productos |
| admin | product.put | PUT /products/:id | Actualizar productos |
| admin | product.delete | DELETE /products/:id | Eliminar productos |
| admin | user.get | GET /users | Visualizar usuarios |
| admin | user.post | POST /users | Crear usuarios |
| admin | user.put | PUT /users/:id | Actualizar usuarios |
| admin | user.delete | DELETE /users/:id | Eliminar usuarios |