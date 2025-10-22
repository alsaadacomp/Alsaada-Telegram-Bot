-- Drop the existing unique constraint
DROP INDEX IF EXISTS "Setting_key_scope_userId_featureId_key";

-- Create a new unique constraint that handles nulls properly
CREATE UNIQUE INDEX "Setting_key_scope_userId_featureId_key" ON "Setting" (
  "key", 
  "scope", 
  COALESCE("userId", 0), 
  COALESCE("featureId", '')
);
