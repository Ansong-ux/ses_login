@echo off
echo Starting Computer Engineering Department System Setup...

set PG_PSQL="C:\Program Files\PostgreSQL\17\bin\psql.exe"

echo.
echo Step 1: Killing any existing processes on port 3001...
npx kill-port 3001

echo.
echo Step 2: Clearing npm cache...
npm cache clean --force

echo.
echo Step 3: Running database setup scripts...
echo Please make sure PostgreSQL is running and your database credentials are correct in .env

echo Running script 11-fix-users-table.sql...
%PG_PSQL% -U postgres -d ce_department_db -f scripts/11-fix-users-table.sql

echo Running script 02-create-tables.sql...
%PG_PSQL% -U postgres -d ce_department_db -f scripts/02-create-tables.sql

echo Running script 12-create-missing-tables.sql...
%PG_PSQL% -U postgres -d ce_department_db -f scripts/12-create-missing-tables.sql

echo Running script 03-insert-sample-data.sql...
%PG_PSQL% -U postgres -d ce_department_db -f scripts/03-insert-sample-data.sql

echo Running script 10-create-fee-structure.sql...
%PG_PSQL% -U postgres -d ce_department_db -f scripts/10-create-fee-structure.sql

echo.
echo Step 4: Starting development server...
npm run dev

echo.
echo Setup finished. Press any key to close this window.
pause 