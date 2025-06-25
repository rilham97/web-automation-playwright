#!/usr/bin/env node

/**
 * NUCLEAR OPTION: Post-test screenshot injection
 * This script runs after Cucumber tests complete to inject screenshots into Allure result JSON files
 * Enhanced with scenario prefix matching for better accuracy
 * Usage: node scripts/nuclear-option.js
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Nuclear Option: Direct Allure JSON manipulation
 * Injects screenshot attachments directly into Allure result JSON files
 * Enhanced with scenario-prefix matching for improved accuracy
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
    
    // Find all failure screenshots (assertion-failure pattern with scenario prefixes)
    const screenshotFiles = await glob('screenshots/assertion-failure*.png');
    
    if (screenshotFiles.length === 0) {
      console.log('⚠️ No failure screenshots found (assertion-failure) - nothing to inject');
      return;
    }
    
    console.log(`📸 Found ${screenshotFiles.length} failure screenshot(s) with scenario prefixes`);
    
    let injectionsPerformed = 0;
    
    // Create a mapping of failed tests with their timestamps and scenario info
    const failedTests = [];
    for (const resultFile of allureResultFiles) {
      try {
        const jsonContent = fs.readFileSync(resultFile, 'utf8');
        const allureResult = JSON.parse(jsonContent);
        
        if (allureResult.status === 'failed') {
          // Extract scenario identifiers from test name and labels
          const scenarioId = extractScenarioIdentifier(allureResult);
          
          failedTests.push({
            file: resultFile,
            name: allureResult.name,
            scenarioId: scenarioId,
            startTime: allureResult.start,
            stopTime: allureResult.stop || allureResult.start,
            data: allureResult
          });
        }
      } catch (error) {
        console.error(`❌ Failed to read ${resultFile}:`, error.message);
      }
    }
    
    if (failedTests.length === 0) {
      console.log('⚠️ No failed tests found - nothing to inject');
      return;
    }
    
    console.log(`\n🎯 Found ${failedTests.length} failed test(s) to process`);
    
    // Create screenshot data with extracted scenario prefixes and timestamps
    const screenshots = screenshotFiles.map(screenshot => {
      const filename = path.basename(screenshot);
      const timestampMatch = filename.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/);
      const scenarioMatch = filename.match(/assertion-failure-(.+?)-\d{4}-\d{2}-\d{2}T/);
      
      let screenshotTime = 0;
      if (timestampMatch) {
        // Convert filename timestamp to milliseconds
        const timestamp = timestampMatch[1].replace(/-/g, ':').replace('T', 'T').replace('Z', 'Z');
        screenshotTime = new Date(timestamp.replace(/(\d{2}):(\d{2}):(\d{2}):(\d{3})Z/, '$1:$2:$3.$4Z')).getTime();
      }
      
      return {
        path: screenshot,
        filename: filename,
        scenarioPrefix: scenarioMatch ? scenarioMatch[1] : null,
        timestamp: screenshotTime
      };
    }).sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp
    
    console.log(`📸 Found ${screenshots.length} screenshot(s) with scenario prefixes and timestamps`);
    
    // Enhanced matching: First try exact scenario prefix match, then fall back to timestamp
    const usedScreenshots = new Set();
    
    for (const failedTest of failedTests) {
      console.log(`\n🔍 Processing: ${failedTest.name}`);
      console.log(`  🎯 Scenario ID: ${failedTest.scenarioId}`);
      console.log(`  🕒 Test time: ${failedTest.startTime} - ${failedTest.stopTime}`);
      
      let bestMatch = null;
      
      // Strategy 1: Try exact scenario prefix match first
      const exactMatch = screenshots.find(screenshot => 
        !usedScreenshots.has(screenshot.path) && 
        screenshot.scenarioPrefix && 
        failedTest.scenarioId && 
        screenshot.scenarioPrefix.toLowerCase().includes(failedTest.scenarioId.toLowerCase().replace(/\s+/g, '-'))
      );
      
      if (exactMatch) {
        bestMatch = exactMatch;
        console.log(`  🎯 Found exact scenario match: ${bestMatch.filename}`);
      } else {
        // Strategy 2: Fall back to closest timestamp match
        let minTimeDiff = Infinity;
        for (const screenshot of screenshots) {
          if (usedScreenshots.has(screenshot.path)) {
            continue; // Skip already used screenshots
          }
          
          // Calculate time difference between test failure and screenshot
          const timeDiff = Math.abs(screenshot.timestamp - failedTest.stopTime);
          
          if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            bestMatch = screenshot;
          }
        }
        
        if (bestMatch) {
          console.log(`  🕒 Using timestamp match: ${bestMatch.filename} (${minTimeDiff}ms difference)`);
        }
      }
      
      if (!bestMatch) {
        console.log('  📸 No available screenshots remaining');
        continue;
      }
      
      // Mark this screenshot as used
      usedScreenshots.add(bestMatch.path);
      
      try {
        const matchingScreenshot = bestMatch.path;
        const allureResult = failedTest.data;
        
        // Create attachment object
        const timestamp = Date.now();
        const attachmentUuid = `nuclear-${timestamp}-${Math.random().toString(36).substring(2, 15)}`;
        const attachment = {
          name: 'Failure Screenshot (Nuclear Option)',
          source: `${attachmentUuid}-attachment.png`,
          type: 'image/png'
        };
        
        // Inject attachment ONLY into the FIRST failed step (to avoid duplicates)
        let injected = false;
        const failedStep = allureResult.steps.find(step => step.status === 'failed');
        if (failedStep && (!failedStep.attachments || failedStep.attachments.length === 0)) {
          failedStep.attachments = failedStep.attachments || [];
          failedStep.attachments.push(attachment);
          console.log('  ✅ Attachment injected into first failed step');
          injected = true;
        } else if (failedStep && failedStep.attachments && failedStep.attachments.length > 0) {
          console.log('  ⏭️ First failed step already has attachment - skipping to avoid duplicates');
        } else {
          // Fallback: inject into main test attachments only if none exist
          if (!allureResult.attachments || allureResult.attachments.length === 0) {
            allureResult.attachments = allureResult.attachments || [];
            allureResult.attachments.push(attachment);
            console.log('  ✅ Attachment injected into main test');
            injected = true;
          } else {
            console.log('  ⏭️ Main test already has attachment - skipping to avoid duplicates');
          }
        }
        
        if (injected) {
          // Write the modified JSON back
          fs.writeFileSync(failedTest.file, JSON.stringify(allureResult, null, 2));
          
          // Create the attachment file in allure-results
          const attachmentPath = path.join('allure-results', `${attachmentUuid}-attachment.png`);
          fs.copyFileSync(matchingScreenshot, attachmentPath);
          
          console.log(`  ✅ JSON updated: ${failedTest.file}`);
          console.log(`  ✅ Attachment created: ${attachmentPath}`);
          injectionsPerformed++;
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to process ${failedTest.file}:`, error.message);
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

/**
 * Extract scenario identifier from Allure result for matching with screenshot prefixes
 * @param {Object} allureResult - The Allure test result JSON object
 * @returns {string} Scenario identifier for matching
 */
function extractScenarioIdentifier(allureResult) {
  try {
    // Extract from test name (priority 1)
    if (allureResult.name) {
      const cleanName = allureResult.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
      return cleanName;
    }
    
    // Extract from labels (priority 2)
    if (allureResult.labels) {
      const storyLabel = allureResult.labels.find(label => label.name === 'story');
      const featureLabel = allureResult.labels.find(label => label.name === 'feature');
      
      if (storyLabel && featureLabel) {
        return `${featureLabel.value}-${storyLabel.value}`.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
      } else if (storyLabel) {
        return storyLabel.value.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
      }
    }
    
    return 'unknown-test';
  } catch (error) {
    console.error('Error extracting scenario identifier:', error.message);
    return 'unknown-test';
  }
}

// Run the nuclear option
nuclearOptionInjectScreenshots(); 