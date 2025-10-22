# ============================================
# Apply Database Schema - Migration Script
# ============================================

$ProjectPath = "F:\_Alsaada_Telegram_Bot\telegram-bot-template-main"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Database Schema Migration Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location $ProjectPath

# Step 1: Check Prisma status
Write-Host "Step 1: Checking current migration status..." -ForegroundColor Yellow
Write-Host ""
npx prisma migrate status
Write-Host ""

# Step 2: Validate Schema
Write-Host "Step 2: Validating schema.prisma..." -ForegroundColor Yellow
$validation = npx prisma validate 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Schema is valid!" -ForegroundColor Green
} else {
    Write-Host "  Schema has errors:" -ForegroundColor Red
    Write-Host $validation
    Write-Host ""
    Write-Host "Please fix schema errors before continuing." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Show pending changes
Write-Host "Step 3: Checking for pending changes..." -ForegroundColor Yellow
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script
Write-Host ""

# Step 4: Ask for confirmation
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ready to apply migration!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Create a new migration" -ForegroundColor White
Write-Host "  2. Apply changes to the database" -ForegroundColor White
Write-Host "  3. Generate Prisma Client" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "Do you want to continue? (Y/N)"

if ($confirmation -eq 'Y' -or $confirmation -eq 'y') {
    Write-Host ""
    Write-Host "Step 4: Creating and applying migration..." -ForegroundColor Yellow
    
    # Create migration name with timestamp
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $migrationName = "complete_database_system_$timestamp"
    
    Write-Host "Migration name: $migrationName" -ForegroundColor Cyan
    Write-Host ""
    
    # Apply migration
    npx prisma migrate dev --name $migrationName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  Migration Applied Successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        
        # Step 5: Generate Prisma Client
        Write-Host "Step 5: Generating Prisma Client..." -ForegroundColor Yellow
        npx prisma generate
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Prisma Client generated!" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "Step 6: Opening Prisma Studio to verify..." -ForegroundColor Yellow
        Write-Host "  Press Ctrl+C to close when done" -ForegroundColor Gray
        Write-Host ""
        
        # Open Prisma Studio
        npx prisma studio
        
    } else {
        Write-Host ""
        Write-Host "Migration failed!" -ForegroundColor Red
        Write-Host "Check errors above and try again." -ForegroundColor Yellow
    }
    
} else {
    Write-Host ""
    Write-Host "Migration cancelled." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan
