#!/bin/bash

# 🚀 Load environment variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

# 🚀 Database credentials from .env
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_NAME=${DB_NAME}
BACKUP_DIR="./backups"
TIMESTAMP=$(date +'%Y-%m-%d_%H-%M-%S')
TABLE_BACKUP_DIR="$BACKUP_DIR/${DB_NAME}_backup_$TIMESTAMP"

# 🔄 Create a timestamped backup directory
mkdir -p "$TABLE_BACKUP_DIR"

# 🛑 Backup each table separately
echo "🔄 Backing up each table in: $TABLE_BACKUP_DIR"
TABLES=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -D "$DB_NAME" -Bse "SHOW TABLES;")

for TABLE in $TABLES; do
    echo "📂 Backing up table: $TABLE"
    mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --single-transaction --routines --triggers "$DB_NAME" "$TABLE" > "$TABLE_BACKUP_DIR/${TABLE}.sql"
    
    if [ $? -eq 0 ]; then
        echo "✅ Table $TABLE backed up successfully!"
    else
        echo "❌ Failed to back up table $TABLE!"
    fi
done

# 🗑️ (Optional) Delete backup folders older than 7 days
# Uncomment the line below to enable automatic cleanup
# find "$BACKUP_DIR" -type d -name "${DB_NAME}_backup_*" -mtime +7 -exec rm -r {} \;

echo "✅ All tables backed up successfully in: $TABLE_BACKUP_DIR"
