# Catálogo de Cuentas Contables (Full-Stack Assessment)

Sistema de gestión y visualización de catálogo contable jerárquico bajo principios de Arquitectura Limpia (Clean Architecture), Domain-Driven Design (DDD) y principios SOLID, estructurado en backend (NestJS) y frontend (React + Vite).

---

## 🚀 Cómo correr el proyecto

### Requisitos previos
- **Node.js**: v22 o superior (compatible con `.nvmrc`).
- **npm**: v10 o superior.

### Instalación y arranque
```bash
# 1. Instalar dependencias en raíz, backend (api) y frontend (web)
npm install

# 2. Levantar API y Frontend concurrentemente en modo desarrollo
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend (API)**: [http://localhost:3000](http://localhost:3000)

### Scripts disponibles
| Comando | Descripción |
|---|---|
| `npm run dev` | Ejecuta API y Frontend en paralelo con recarga en caliente |
| `npm run dev:api` | Ejecuta únicamente el backend (`api`) |
| `npm run dev:web` | Ejecuta únicamente el frontend (`web`) |
| `npm run build` | Compila ambos proyectos para producción |
| `npm test` | Ejecuta la suite de pruebas unitarias con Vitest |
| `npm run lint` | Análisis estático y linter en ambos proyectos con oxlint |

---

## 🏛️ Arquitectura del Proyecto

Tanto en el backend como en el frontend se implementó una **Arquitectura en Capas desacopladas (Clean Architecture)** complementada con **Domain-Driven Design (DDD)** y principios **SOLID**:

```
tech-assessment-starter-fullstack/
├── api/                                # Backend en NestJS
│   └── src/
│       ├── modules/catalog/            # Módulo de Catálogo Contable
│       │   ├── domain/                 # Entidades, Value Objects, Políticas y Contratos
│       │   │   ├── entities/           # Account (Entidad), AccountCode (VO), Enums
│       │   │   ├── policies/           # Políticas de Creación, Eliminación y Movimiento
│       │   │   ├── repositories/       # Interfaz CatalogAccountRepository y contratos
│       │   │   └── errors/             # Excepciones de dominio tipadas
│       │   ├── infrastructure/         # Repositorios en memoria y seed data
│       │   ├── application/            # Casos de uso de negocio (Use Cases)
│       │   ├── presentation/           # Controladores, DTOs y Filtros de Excepciones HTTP
│       │   └── catalog.module.ts       # Inyección de dependencias (useClass / useFactory)
│       └── app.module.ts
│
└── web/                                # Frontend en React + Vite
    └── src/
        └── features/                   # Feature modular del catálogo
            ├── domain/                 # Modelos de árbol y contratos de interfaz
            ├── infrastructure/         # Repositorio HTTP (consumo de endpoints)
            ├── application/            # Casos de uso en el cliente (Use Cases)
            └── presentation/           # Componentes UI desacoplados y Custom Hooks
                ├── components/         # TreeToolbar, TreeNodeItem, NodeBadges, NodeRowActions, etc.
                └── hooks/              # Hooks con TanStack Query (useCatalogTree, mutaciones)
```

### Principios SOLID aplicados:
- **S (Single Responsibility)**: Cada clase, caso de uso y componente React posee una responsabilidad única (ej. `NodeBadges` solo representa metadata, `CreateAccountUseCase` solo gestiona altas, `AccountMovementPolicy` evalúa si admite asientos contables).
- **O (Open/Closed)**: Abstracciones mediante contratos de repositorio (`CatalogAccountRepository`) permitiendo cambiar la persistencia sin modificar lógica de aplicación.
- **L (Liskov Substitution)**: Las implementaciones en memoria y HTTP respetan los contratos de sus interfaces base sin efectos colaterales.
- **I (Interface Segregation)**: DTOs, modelos y props de componentes están divididos en interfaces concisas y específicas.
- **D (Dependency Inversion)**: Casos de uso y controladores dependen de abstracciones, inyectadas mediante el contenedor IoC de NestJS (`CATALOG_ACCOUNT_REPOSITORY` con `useClass`).

---

## ⚙️ Reglas de Negocio Implementadas

1. **Estructura y Longitud de Código**:
   - `1 dígito` → **Clase**
   - `2 dígitos` → **Grupo**
   - `4 dígitos` → **Cuenta**
   - `6 dígitos` → **Subcuenta**
   - Validación estricta de códigos exclusivamente numéricos mediante el Value Object `AccountCode`.
2. **Jerarquía y Padre**: El padre de una cuenta es su prefijo en el nivel anterior (ej. padre de `110505` es `1105`, de `1105` es `11`, de `11` es `1`). Las Clases no tienen padre.
3. **Existencia del Padre (`AccountCreationPolicy`)**: No se puede registrar una cuenta si su cuenta padre no existe en el catálogo.
4. **Protección contra Eliminación (`AccountDeletionPolicy`)**: No se puede eliminar una cuenta que contenga cuentas hijas asociadas.
5. **Cuentas Imputables vs Agrupadoras (`AccountMovementPolicy`)**: Únicamente las cuentas hoja (sin hijas) admiten movimientos o asientos contables directos (`allowsMovements: true`).
6. **Unicidad de Código**: Cada código de cuenta es único en todo el catálogo contable.
7. **Herencia de Naturaleza**: Cada Clase define su naturaleza contable (`DEBIT` o `CREDIT`), y todos sus grupos, cuentas y subcuentas descendientes la heredan automáticamente.

---

## 🛠️ Tecnologías Utilizadas

### Backend (`api/`)
- **Node.js 22** con soporte nativo ECMAScript Modules (ESM).
- **NestJS 12**: Framework modular empresarial para APIs RESTful.
- **TypeScript**: Tipado estricto (`strict: true`, `NodeNext` module resolution).
- **Vitest**: Suite de pruebas unitarias rápida y moderna para las reglas del dominio y repositorio.
- **Oxlint**: Linter ultrarrápido basado en Rust.

### Frontend (`web/`)
- **React 19**: Biblioteca de UI basada en componentes funcionales.
- **Vite 8**: Herramienta de compilación y empaquetado de alto rendimiento.
- **TanStack Query (React Query) v5**: Gestión del estado del servidor, caché reactivo e invalidación automática tras mutaciones (`useMutation`, `useQuery`).
- **CSS Nativo Moderno**: Diseño responsivo, badges dinámicos por nivel/naturaleza y animaciones para el árbol jerárquico.

---

## 📌 Endpoints API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/catalog/accounts` | Retorna el árbol contable jerárquico con indicador `allowsMovements` |
| `POST` | `/catalog/accounts` | Crea una cuenta validando unicidad, existencia del padre y herencia |
| `DELETE` | `/catalog/accounts/:code` | Elimina una cuenta hoja (bloquea si tiene hijas con código `400 Bad Request`) |

---

## 💡 Conclusión

El proyecto fue diseñado para demostrar cómo la separación de responsabilidades y el modelado de dominio enriquecido resuelven la complejidad contable de manera limpia y escalable. Al aislar la lógica central en entidades y políticas puras en TypeScript, las reglas de negocio quedan completamente protegidas de cambios en frameworks, bases de datos o bibliotecas de interfaz. 

La integración con **TanStack Query** en el frontend asegura una sincronización instantánea y consistente con el servidor, brindando al usuario una experiencia fluida al navegar, expandir, crear y eliminar cuentas dentro del catálogo jerárquico.
