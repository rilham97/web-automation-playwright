#!/usr/bin/env node

/**
 * Debug Step Definitions Loading
 * Helps diagnose why step definitions aren't being loaded by Cucumber
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

console.log('🔍 DEBUG: Step Definitions Analysis');
console.log('=====================================\n');

// 1. Check step definition files exist
console.log('1. Step Definition Files:');
const stepDefGlob = path.join(projectRoot, 'features/step_definitions/**/*.js');
const stepDefFiles = glob.sync(stepDefGlob);

if (stepDefFiles.length === 0) {
  console.log('❌ No step definition files found!');
  console.log(`   Searched in: ${stepDefGlob}`);
} else {
  console.log(`✅ Found ${stepDefFiles.length} step definition files:`);
  stepDefFiles.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    const stats = fs.statSync(file);
    console.log(`   - ${relativePath} (${stats.size} bytes)`);
  });
}

console.log('');

// 2. Check file contents for step definitions
console.log('2. Step Definition Content Analysis:');
for (const file of stepDefFiles) {
  const relativePath = path.relative(projectRoot, file);
  const content = fs.readFileSync(file, 'utf-8');
  
  // Count step definitions
  const givenMatches = content.match(/Given\(/g) || [];
  const whenMatches = content.match(/When\(/g) || [];
  const thenMatches = content.match(/Then\(/g) || [];
  
  const totalSteps = givenMatches.length + whenMatches.length + thenMatches.length;
  
  console.log(`   📄 ${relativePath}:`);
  console.log(`      - Given: ${givenMatches.length}`);
  console.log(`      - When: ${whenMatches.length}`);
  console.log(`      - Then: ${thenMatches.length}`);
  console.log(`      - Total: ${totalSteps}`);
  
  // Check for import issues
  if (content.includes('import') && !content.includes('from \'@cucumber/cucumber\'')) {
    console.log(`      ⚠️  No @cucumber/cucumber import found`);
  }
  
  // Check for ES module syntax
  if (content.includes('require(')) {
    console.log(`      ⚠️  Uses CommonJS require() - may need ES module syntax`);
  }
}

console.log('');

// 3. Try to import step definition files manually
console.log('3. Manual Step Definition Import Test:');
for (const file of stepDefFiles) {
  const relativePath = path.relative(projectRoot, file);
  try {
    console.log(`   🔄 Importing ${relativePath}...`);
    
    // Dynamic import
    const module = await import(file);
    console.log(`   ✅ Successfully imported ${relativePath}`);
    
    // Check what was exported
    const exports = Object.keys(module);
    if (exports.length > 0) {
      console.log(`      - Exports: ${exports.join(', ')}`);
    } else {
      console.log(`      - No named exports (likely side-effect import)`);
    }
    
  } catch (error) {
    console.log(`   ❌ Failed to import ${relativePath}:`);
    console.log(`      Error: ${error.message}`);
    
    // Check for specific error types
    if (error.message.includes('PENDING')) {
      console.log(`      🚨 CRITICAL: Cucumber instance in PENDING status!`);
      console.log(`         This means step definitions can't register with Cucumber`);
    }
  }
}

console.log('');

// 4. Check Cucumber configuration
console.log('4. Cucumber Configuration Analysis:');
const configPath = path.join(projectRoot, 'cucumber.config.js');

if (fs.existsSync(configPath)) {
  console.log(`   ✅ Found cucumber.config.js`);
  
  try {
    const config = await import(configPath);
    console.log(`   ✅ Successfully imported configuration`);
    
    // Check default profile
    const defaultConfig = config.default?.default;
    if (defaultConfig) {
      console.log(`   📋 Default profile import paths:`);
      defaultConfig.import?.forEach(importPath => {
        console.log(`      - ${importPath}`);
      });
    }
  } catch (error) {
    console.log(`   ❌ Failed to import configuration: ${error.message}`);
  }
} else {
  console.log(`   ❌ No cucumber.config.js found`);
}

console.log('');

// 5. Environment check
console.log('5. Environment Information:');
console.log(`   - Node.js: ${process.version}`);
console.log(`   - Platform: ${process.platform}`);
console.log(`   - Working Directory: ${process.cwd()}`);
console.log(`   - Project Root: ${projectRoot}`);

// Check package.json type
const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  console.log(`   - Package Type: ${packageJson.type || 'commonjs'}`);
  
  // Check Cucumber version
  const cucumberVersion = packageJson.devDependencies?.['@cucumber/cucumber'] || 
                         packageJson.dependencies?.['@cucumber/cucumber'];
  console.log(`   - Cucumber Version: ${cucumberVersion || 'not found'}`);
}

console.log('\n🔍 Debug Analysis Complete');
console.log('===========================\n');

// 6. Recommendations
console.log('💡 Debugging Recommendations:');
console.log('');
console.log('If step definitions are being skipped:');
console.log('1. Run: npm run debug:cucumber:step-definitions');
console.log('2. Run: npm run debug:cucumber:import');  
console.log('3. Check for Cucumber instance PENDING status errors');
console.log('4. Verify ES module imports are correct');
console.log('5. Ensure no conflicting Cucumber versions');
console.log(''); 