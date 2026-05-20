# Guia de Instalação — IPILVirtualLIB

## Pré-requisitos
- Node.js 18+
- PHP 8.1+
- MySQL 8.0+

## 1. Base de dados
```sql
CREATE DATABASE ipilvirtuallib CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Importar o schema:
```bash
mysql -u root -p ipilvirtuallib < docs/schema.sql
```

## 2. Backend (PHP)
```bash
cd backend
cp .env.example .env
# Editar .env com as credenciais da BD e o JWT_SECRET
php -S localhost:8000 -t public
```

## 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Aceder em: **http://localhost:5173**
