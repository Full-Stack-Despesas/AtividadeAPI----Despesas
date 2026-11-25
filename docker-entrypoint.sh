#!/bin/sh
set -e

echo "Executando migrations e seeders no banco ${MYSQL_HOST}:${MYSQL_PORT}..."
cd /app/src/database
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
cd /app

exec "$@"
