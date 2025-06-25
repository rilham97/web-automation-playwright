#!/usr/bin/env node

/**
 * NUCLEAR OPTION: Post-test screenshot injection
 * This script runs after Cucumber tests complete to inject screenshots into Allure result JSON files
 * Usage: node scripts/nuclear-option.js
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Nuclear Option: Direct Allure JSON manipulation
 * Injects screenshot attachments directly into Allure result JSON files
 */
async function nuclearOptionInjectScreenshots() {
  try {
    console.log('🚀 NUCLEAR OPTION: Post-test screenshot injection starting...');
    
    // Find all Allure result JSON files
    const allureResultFiles = await glob('allure-results/*-result.json');
    if (allureResultFiles.length === 0) {
      console.error('❌ NUCLEAR OPTION: No Allure result files found');
      return;
    }
    
    console.log(`🎯 Found ${allureResultFiles.length} Allure result file(s)`);
    
    // Find all failure screenshots (assertion-failure pattern)
    const screenshotFiles = await glob('screenshots/assertion-failure*.png');
    
    if (screenshotFiles.length === 0) {
      console.log('⚠️ No failure screenshots found (assertion-failure) - nothing to inject');
      return;
    }
    
    console.log(`📸 Found ${screenshotFiles.length} failure screenshot(s)`);
    
    let injectionsPerformed = 0;
    
    // Process each result file
    for (const resultFile of allureResultFiles) {
      try {
        console.log(`\n🔍 Processing: ${resultFile}`);
        
        // Read and parse the JSON
        const jsonContent = fs.readFileSync(resultFile, 'utf8');
        const allureResult = JSON.parse(jsonContent);
        
        // Check if this test failed
        if (allureResult.status !== 'failed') {
          console.log('  ⏭️ Skipping - test passed');
          continue;
        }
        
        console.log(`  ❌ Failed test found: ${allureResult.name}`);
        
        // Find matching screenshot (use exact test name match or most recent)
        const testNameNormalized = allureResult.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Try exact match first
        let matchingScreenshot = screenshotFiles.find(screenshot => {
          const screenshotName = path.basename(screenshot).toLowerCase();
          return screenshotName.includes(testNameNormalized.substring(0, 30)); // First 30 chars for match
        });
        
        // If no exact match, use the most recent screenshot (by filename timestamp)
        if (!matchingScreenshot && screenshotFiles.length > 0) {
          matchingScreenshot = screenshotFiles
            .sort((a, b) => {
              // Extract timestamp from filename and sort by most recent
              const getTimestamp = (filename) => {
                const match = filename.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/);
                return match ? match[1] : '0';
              };
              return getTimestamp(b).localeCompare(getTimestamp(a));
            })[0];
          console.log('  🕒 Using most recent screenshot as fallback');
        }
        
        if (!matchingScreenshot) {
          console.log('  📸 No matching screenshot found');
          continue;
        }
        
        console.log(`  📸 Matching screenshot: ${matchingScreenshot}`);
        
        // Create attachment object
        const timestamp = Date.now();
        const attachmentUuid = `nuclear-${timestamp}-${Math.random().toString(36).substring(2, 15)}`;
        const attachment = {
          name: 'Failure Screenshot (Nuclear Option)',
          source: `${attachmentUuid}-attachment.png`,
          type: 'image/png'
        };
        
        // Inject attachment into the failed step
        let injected = false;
        const failedStep = allureResult.steps.find(step => step.status === 'failed');
        if (failedStep) {
          failedStep.attachments = failedStep.attachments || [];
          failedStep.attachments.push(attachment);
          console.log('  ✅ Attachment injected into failed step');
          injected = true;
        } else {
          // Fallback: inject into main test attachments
          allureResult.attachments = allureResult.attachments || [];
          allureResult.attachments.push(attachment);
          console.log('  ✅ Attachment injected into main test');
          injected = true;
        }
        
        if (injected) {
          // Write the modified JSON back
          fs.writeFileSync(resultFile, JSON.stringify(allureResult, null, 2));
          
          // Create the attachment file in allure-results
          const attachmentPath = path.join('allure-results', `${attachmentUuid}-attachment.png`);
          fs.copyFileSync(matchingScreenshot, attachmentPath);
          
          console.log(`  ✅ JSON updated: ${resultFile}`);
          console.log(`  ✅ Attachment created: ${attachmentPath}`);
          injectionsPerformed++;
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to process ${resultFile}:`, error.message);
      }
    }
    
    console.log(`\n🎉 NUCLEAR OPTION COMPLETE: ${injectionsPerformed} screenshot(s) injected!`);
    
    if (injectionsPerformed > 0) {
      console.log('\n🚀 Now run: npm run allure:generate');
      console.log('📊 Then run: npm run allure:serve');
      console.log('👀 Screenshots should now be visible in the Allure HTML report!');
    }
    
  } catch (error) {
    console.error('❌ NUCLEAR OPTION FAILED:', error.message);
    process.exit(1);
  }
}

// Run the nuclear option
nuclearOptionInjectScreenshots(); 