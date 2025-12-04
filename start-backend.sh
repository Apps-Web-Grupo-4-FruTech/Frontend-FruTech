#!/bin/bash

# Script para iniciar el servidor JSON
echo "Iniciando servidor JSON en puerto 3000..."

# Verificar si el puerto está en uso
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "El puerto 3000 ya está en uso. Deteniendo proceso anterior..."
    kill -9 $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null
    sleep 1
fi

# Iniciar el servidor
cd "$(dirname "$0")"
npx json-server --watch server/db.json --routes server/routes.json --port 3000

