#!/usr/bin/env node

/**
 * Debug Feature Files and Tag Analysis
 * Helps diagnose feature file parsing and tag matching issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

console.log('🔍 DEBUG: Feature Files and Tags Analysis');
console.log('==========================================\n');

// 1. Find all feature files
console.log('1. Feature Files Discovery:');
const featureGlob = path.join(projectRoot, 'features/**/*.feature');
const featureFiles = glob.sync(featureGlob);

if (featureFiles.length === 0) {
  console.log('❌ No feature files found!');
  console.log(`   Searched in: ${featureGlob}`);
  process.exit(1);
} else {
  console.log(`✅ Found ${featureFiles.length} feature files:`);
  featureFiles.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    const stats = fs.statSync(file);
    console.log(`   - ${relativePath} (${stats.size} bytes)`);
  });
}

console.log('');

// 2. Parse tags from all feature files
console.log('2. Tag Analysis:');
const allTags = new Set();
const taggedScenarios = [];

featureFiles.forEach(file => {
  const relativePath = path.relative(projectRoot, file);
  const content = fs.readFileSync(file, 'utf-8');
  
  console.log(`   📄 ${relativePath}:`);
  
  // Split content into lines for analysis
  const lines = content.split('\n');
  let currentScenario = null;
  let lineNumber = 0;
  
  lines.forEach(line => {
    lineNumber++;
    const trimmedLine = line.trim();
    
    // Check for tags (lines starting with @)
    if (trimmedLine.startsWith('@')) {
      const tags = trimmedLine.split(/\s+/).filter(tag => tag.startsWith('@'));
      tags.forEach(tag => {
        allTags.add(tag);
        console.log(`      🏷️  ${tag} (line ${lineNumber})`);
      });
      
      // Store tags for the next scenario
      if (currentScenario) {
        currentScenario.tags.push(...tags);
      } else {
        currentScenario = { tags: [...tags], file: relativePath };
      }
    }
    
    // Check for scenario/scenario outline
    if (trimmedLine.match(/^\s*(Scenario|Scenario Outline):/)) {
      const scenarioName = trimmedLine.replace(/^\s*(Scenario|Scenario Outline):\s*/, '');
      if (currentScenario) {
        currentScenario.name = scenarioName;
        currentScenario.line = lineNumber;
        taggedScenarios.push(currentScenario);
      }
      currentScenario = { tags: [], file: relativePath, name: scenarioName, line: lineNumber };
    }
  });
  
  // Add the last scenario if it exists
  if (currentScenario && currentScenario.name) {
    taggedScenarios.push(currentScenario);
  }
});

console.log('\n   🏷️  All Tags Found:');
Array.from(allTags).sort().forEach(tag => {
  console.log(`      - ${tag}`);
});

console.log('');

// 3. Analyze @sorting tagged scenarios specifically
console.log('3. @sorting Tag Analysis:');
const sortingScenarios = taggedScenarios.filter(scenario => 
  scenario.tags.includes('@sorting')
);

if (sortingScenarios.length === 0) {
  console.log('   ❌ No scenarios found with @sorting tag!');
} else {
  console.log(`   ✅ Found ${sortingScenarios.length} scenarios with @sorting tag:`);
  sortingScenarios.forEach(scenario => {
    console.log(`      📋 "${scenario.name}" in ${scenario.file}:${scenario.line}`);
    console.log(`         Tags: ${scenario.tags.join(' ')}`);
  });
}

console.log('');

// 4. Check tag expression parsing
console.log('4. Tag Expression Testing:');
const testTags = ['@sorting', '@smoke', '@login', '@cart', '@checkout'];

testTags.forEach(tag => {
  const matchingScenarios = taggedScenarios.filter(scenario => 
    scenario.tags.includes(tag)
  );
  console.log(`   ${tag}: ${matchingScenarios.length} scenarios`);
});

console.log('');

// 5. Test complex tag expressions
console.log('5. Complex Tag Expression Testing:');
const complexExpressions = [
  '@sorting and @smoke',
  '@login and not @data-driven',
  '@cart or @checkout'
];

complexExpressions.forEach(expression => {
  console.log(`   Testing: "${expression}"`);
  
  // Simple parser for basic expressions
  if (expression.includes(' and ')) {
    const [tag1, tag2] = expression.split(' and ').map(t => t.trim());
    const matches = taggedScenarios.filter(scenario => 
      scenario.tags.includes(tag1) && scenario.tags.includes(tag2)
    );
    console.log(`      Result: ${matches.length} scenarios`);
  } else if (expression.includes(' or ')) {
    const [tag1, tag2] = expression.split(' or ').map(t => t.trim());
    const matches = taggedScenarios.filter(scenario => 
      scenario.tags.includes(tag1) || scenario.tags.includes(tag2)
    );
    console.log(`      Result: ${matches.length} scenarios`);
  } else if (expression.includes(' and not ')) {
    const parts = expression.split(' and not ');
    const includeTag = parts[0].trim();
    const excludeTag = parts[1].trim();
    const matches = taggedScenarios.filter(scenario => 
      scenario.tags.includes(includeTag) && !scenario.tags.includes(excludeTag)
    );
    console.log(`      Result: ${matches.length} scenarios`);
  }
});

console.log('');

// 6. Feature file syntax validation
console.log('6. Feature File Syntax Validation:');
featureFiles.forEach(file => {
  const relativePath = path.relative(projectRoot, file);
  const content = fs.readFileSync(file, 'utf-8');
  
  console.log(`   📄 ${relativePath}:`);
  
  // Basic syntax checks
  if (!content.includes('Feature:')) {
    console.log(`      ❌ No 'Feature:' declaration found`);
  } else {
    console.log(`      ✅ Feature declaration found`);
  }
  
  const scenarioCount = (content.match(/^\s*(Scenario|Scenario Outline):/gm) || []).length;
  console.log(`      📊 Scenarios: ${scenarioCount}`);
  
  const stepCount = (content.match(/^\s*(Given|When|Then|And|But)/gm) || []).length;
  console.log(`      📊 Steps: ${stepCount}`);
  
  // Check for common syntax issues
  if (content.includes('\t')) {
    console.log(`      ⚠️  Contains tabs (should use spaces)`);
  }
  
  if (content.match(/^\s*@.*[^a-zA-Z0-9_-]/gm)) {
    console.log(`      ⚠️  Potentially invalid tag characters`);
  }
});

console.log('\n🔍 Feature Analysis Complete');
console.log('=============================\n');

// 7. Summary and recommendations
console.log('📊 Summary:');
console.log(`   - Feature files: ${featureFiles.length}`);
console.log(`   - Total scenarios: ${taggedScenarios.length}`);
console.log(`   - Unique tags: ${allTags.size}`);
console.log(`   - @sorting scenarios: ${sortingScenarios.length}`);
console.log('');

if (sortingScenarios.length === 0) {
  console.log('🚨 CRITICAL: No @sorting scenarios found!');
  console.log('   Check if @sorting tags are properly formatted in feature files.');
} else {
  console.log('✅ @sorting scenarios found - tag parsing should work correctly.');
} 