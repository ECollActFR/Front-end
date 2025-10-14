# Neutria - Environmental Monitoring API

Neutria is a RESTful API built with Symfony and API Platform designed to monitor and track environmental metrics in different rooms or spaces. The system captures various environmental data points like temperature, humidity, CO2 levels, luminosity, and noise levels.

## Overview

Neutria provides a comprehensive solution for monitoring environmental conditions across multiple rooms. Each room can have different types of sensors (capture types), and the system records measurements over time, allowing for historical tracking and analysis.

### Key Features

- **Multi-room monitoring**: Track environmental metrics across multiple rooms/spaces
- **Flexible capture types**: Support for temperature, humidity, CO2, luminosity, and noise measurements
- **Historical data tracking**: Store and retrieve historical environmental data
- **Equipment management**: Associate equipment with rooms to track resources
- **Acquisition systems**: Manage data acquisition systems linked to specific rooms
- **RESTful API**: Full CRUD operations via API Platform
- **Interactive documentation**: Swagger/OpenAPI documentation auto-generated

## Technologies Used

- **Symfony 7.3** - Modern PHP framework
- **API Platform 4.2** - REST and GraphQL API framework
- **Doctrine ORM 3.5** - Database abstraction and ORM
- **PHP 8.2+** - Latest PHP version
- **MariaDB/MySQL** - Database server
- **LexikJWTAuthenticationBundle** - JWT authentication
- **Docker & Docker Compose** - Containerization
- **Nginx** - Web server
- **Carbon** - DateTime manipulation library

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git
- (Optional) Make

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd neutria/Back-end
```

### 2. Environment Configuration

The project includes environment templates. The default configuration works out of the box with Docker.

```bash
cd api
cp .env.template .env
```

Key environment variables:
- `APP_ENV`: Application environment (`dev` or `prod`)
- `APP_SECRET`: Application secret key
- `DATABASE_URL`: Database connection string
- `JWT_PASSPHRASE`: Passphrase for JWT encryption

### 3. Start Docker Containers

```bash
docker compose up -d
```

This will start three services:
- **nginx**: Web server (accessible at http://localhost:8000)
- **php**: PHP-FPM service
- **database**: MariaDB database

### 4. Install Dependencies

```bash
docker compose exec php composer install
```

### 5. Database Setup

Create the database and run migrations:

```bash
# Create database
docker compose exec php php bin/console doctrine:database:create

# Run migrations
docker compose exec php php bin/console doctrine:migrations:migrate
```

### 6. Load Sample Data (Optional)

To populate the database with sample data:

```bash
docker compose exec php php bin/console doctrine:fixtures:load
```

This will create:
- 5 capture types (Temperature, Humidity, CO2, Luminosity, Noise)
- 6 sample rooms (Bureau A1, Bureau A2, Open Space, Reunion, Kitchen, Hall)
- Sample environmental captures for each room

### 7. Generate JWT Keys (if using authentication)

```bash
docker compose exec php php bin/console lexik:jwt:generate-keypair
```

## Usage

### Access Points

- **API Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api (Interactive Swagger UI)
- **Database**: localhost:3306

### API Endpoints

#### Rooms

- `GET /api/rooms` - List all rooms
- `GET /api/rooms/{id}` - Get a specific room
- `GET /api/rooms/{id}/last` - Get room with last captures by type
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/{id}` - Update a room (full)
- `PATCH /api/rooms/{id}` - Update a room (partial)
- `DELETE /api/rooms/{id}` - Delete a room

#### Captures

- `GET /api/captures` - List all captures (paginated)
- `GET /api/captures/{id}` - Get a specific capture

Pagination parameters:
- `?page=1` - Page number
- `?itemsPerPage=30` - Items per page

#### Capture Types

- `GET /api/capture_types` - List all capture types
- `GET /api/capture_types/{id}` - Get a specific capture type
- `POST /api/capture_types` - Create a new capture type
- `PUT /api/capture_types/{id}` - Update a capture type
- `DELETE /api/capture_types/{id}` - Delete a capture type

#### Equipment

- `GET /api/equipment` - List all equipment
- `GET /api/equipment/{id}` - Get specific equipment
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

#### Acquisition Systems

- `GET /api/acquisition_systems` - List all acquisition systems
- `GET /api/acquisition_systems/{id}` - Get a specific system
- `POST /api/acquisition_systems` - Create a new system
- `PUT /api/acquisition_systems/{id}` - Update a system
- `DELETE /api/acquisition_systems/{id}` - Delete a system

### API Examples

#### Get all rooms with pagination

```bash
curl -X GET "http://localhost:8000/api/rooms?page=1"
```

#### Get a room with its last captures by type

```bash
curl -X GET "http://localhost:8000/api/rooms/1/last"
```

Response example:
```json
{
  "id": 1,
  "name": "Bureau A1",
  "description": "Bureau individuel côté sud",
  "createdAt": "2025-10-10 12:30:00",
  "lastCapturesByType": [
    {
      "type": {
        "id": 1,
        "name": "Temperature",
        "description": "Mesure température en °C"
      },
      "capture": {
        "id": 42,
        "value": "21.5",
        "description": "Température",
        "createdAt": "2025-10-10T12:25:00+00:00",
        "dateCaptured": "2025-10-10T12:25:00+00:00"
      }
    }
  ]
}
```

#### Create a new room

```bash
curl -X POST "http://localhost:8000/api/rooms" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lab 1",
    "description": "Research laboratory"
  }'
```

#### Get paginated captures

```bash
curl -X GET "http://localhost:8000/api/captures?page=1&itemsPerPage=20"
```

## Data Model

### Room
Represents a physical space being monitored.

**Attributes:**
- `id`: Unique identifier
- `name`: Room name (max 15 characters)
- `description`: Room description (optional)
- `createdAt`: Creation timestamp
- `captureTypes`: Associated capture types (many-to-many)
- `captures`: Environmental captures (one-to-many)
- `equipment`: Equipment in the room (many-to-many)
- `acquisitionSystems`: Data acquisition systems (one-to-many)

### Capture
Represents a single environmental measurement.

**Attributes:**
- `id`: Unique identifier
- `value`: Measurement value (decimal 6,2)
- `description`: Capture description
- `room`: Associated room
- `type`: Type of capture (temperature, humidity, etc.)
- `createdAt`: Record creation timestamp
- `dateCaptured`: When the measurement was taken

### CaptureType
Defines types of environmental measurements.

**Attributes:**
- `id`: Unique identifier
- `name`: Type name (max 50 characters)
- `description`: Type description
- `createdAt`: Creation timestamp

**Default types:**
- Temperature (°C)
- Humidity (%)
- CO2 (ppm)
- Luminosity (lux)
- Noise (dB)

### Equipment
Represents equipment or devices in rooms.

**Attributes:**
- `id`: Unique identifier
- `name`: Equipment name
- `capacity`: Equipment capacity (optional)
- `createdAt`: Creation timestamp
- `rooms`: Associated rooms (many-to-many)

### AcquisitionSystem
Represents data acquisition systems attached to rooms.

**Attributes:**
- `id`: Unique identifier
- `name`: System name
- `room`: Associated room
- `createdAt`: Creation timestamp

## Project Structure

```
.
├── api/                          # Symfony application
│   ├── bin/                      # Console commands
│   ├── config/                   # Configuration files
│   │   ├── packages/             # Bundle configuration
│   │   ├── routes/               # Route definitions
│   │   └── jwt/                  # JWT keys (gitignored)
│   ├── migrations/               # Database migrations
│   ├── public/                   # Public web directory
│   ├── src/
│   │   ├── Controller/           # Custom controllers
│   │   │   └── RoomController.php
│   │   ├── DataFixtures/         # Database fixtures
│   │   │   └── AppFixtures.php
│   │   ├── Entity/               # Doctrine entities
│   │   │   ├── Room.php
│   │   │   ├── Capture.php
│   │   │   ├── CaptureType.php
│   │   │   ├── Equipment.php
│   │   │   └── AcquisitionSystem.php
│   │   └── Repository/           # Doctrine repositories
│   ├── var/                      # Cache and logs
│   ├── vendor/                   # Composer dependencies
│   ├── .env                      # Environment variables
│   └── composer.json             # PHP dependencies
├── build/                        # Docker build files
│   ├── nginx/                    # Nginx configuration
│   ├── php/                      # PHP-FPM configuration
│   └── database/                 # Database configuration
├── compose.yaml                  # Docker Compose configuration
└── README.md                     # This file
```

## Development

### Useful Commands

#### Doctrine

```bash
# Create a new entity
docker compose exec php php bin/console make:entity

# Generate a migration after entity changes
docker compose exec php php bin/console make:migration

# Execute pending migrations
docker compose exec php php bin/console doctrine:migrations:migrate

# Check database schema sync
docker compose exec php php bin/console doctrine:schema:validate
```

#### Cache Management

```bash
# Clear cache
docker compose exec php php bin/console cache:clear

# Warm up cache
docker compose exec php php bin/console cache:warmup
```

#### Database Management

```bash
# Drop database (WARNING: deletes all data)
docker compose exec php php bin/console doctrine:database:drop --force

# Create database
docker compose exec php php bin/console doctrine:database:create

# Load fixtures (sample data)
docker compose exec php php bin/console doctrine:fixtures:load --no-interaction
```

#### Debugging

```bash
# View application logs
docker compose logs -f php

# View nginx logs
docker compose logs -f nginx

# View database logs
docker compose logs -f database

# List all routes
docker compose exec php php bin/console debug:router

# Check container configuration
docker compose exec php php bin/console debug:config

# Access PHP container shell
docker compose exec php bash
```

### Adding New Entities

1. Generate entity:
```bash
docker compose exec php php bin/console make:entity EntityName
```

2. Create migration:
```bash
docker compose exec php php bin/console make:migration
```

3. Run migration:
```bash
docker compose exec php php bin/console doctrine:migrations:migrate
```

4. Update fixtures if needed (`api/src/DataFixtures/AppFixtures.php`)

### Custom Endpoints

Custom endpoints are defined in controllers (e.g., `RoomController.php:21`). The `/api/rooms/{id}/last` endpoint demonstrates how to create custom operations that return aggregated data.

## Security Considerations

- JWT keys are auto-generated and stored in `api/config/jwt/`
- **Never commit** sensitive files:
  - `.env.local`
  - `config/jwt/private.pem`
  - `config/jwt/public.pem`
- Database credentials are defined in `compose.yaml` (change for production)
- CORS configuration in `config/packages/nelmio_cors.yaml`
- Use strong passwords and secrets in production environments

## Production Deployment

### Preparation

1. Update environment variables:
```bash
APP_ENV=prod
APP_DEBUG=0
```

2. Optimize Composer autoloader:
```bash
composer install --no-dev --optimize-autoloader
```

3. Clear and warm up cache:
```bash
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod
```

4. Set proper file permissions:
```bash
chmod -R 755 var/cache var/log
```

### Recommendations

- Use environment variables for sensitive configuration
- Enable HTTPS/SSL
- Configure proper database backups
- Implement rate limiting
- Monitor application logs
- Use a process manager (e.g., supervisord) for PHP-FPM
- Consider using Redis/Memcached for caching
- Implement proper monitoring (e.g., Prometheus, Grafana)

## Testing

```bash
# Run tests (when implemented)
docker compose exec php php bin/phpunit
```

## Troubleshooting

### Database Connection Issues

```bash
# Check database service status
docker compose ps database

# Verify database credentials in .env match compose.yaml
cat api/.env | grep DATABASE_URL
```

### Permission Issues

```bash
# Fix cache/log permissions
docker compose exec php chmod -R 777 var/cache var/log
```

### API Platform Not Showing

```bash
# Clear cache
docker compose exec php php bin/console cache:clear

# Check routes
docker compose exec php php bin/console debug:router | grep api
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow PSR-12 coding standards
- Use type hints for parameters and return types
- Document complex logic with comments
- Write meaningful commit messages

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for details.

## Authors

- Project maintained by the Neutria team

## Support

For issues, questions, or contributions, please use the GitHub issue tracker.

## Acknowledgments

- [Symfony](https://symfony.com/)
- [API Platform](https://api-platform.com/)
- [Doctrine ORM](https://www.doctrine-project.org/)
- [LexikJWTAuthenticationBundle](https://github.com/lexik/LexikJWTAuthenticationBundle)
- [Carbon](https://carbon.nesbot.com/)