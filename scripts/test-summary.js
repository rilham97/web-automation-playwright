#!/usr/bin/env node

/**
 * Test Summary Script
 * Reads Allure result files and provides a concise test execution summary
 * Usage: node scripts/test-summary.js
 */

import fs from 'fs';
import { glob } from 'glob';

async function generateTestSummary() {
  try {
    console.log('\n📊 TEST EXECUTION SUMMARY');
    console.log('='.repeat(50));
    
    // Find all Allure result JSON files
    const allureResultFiles = await glob('allure-results/*-result.json');
    
    if (allureResultFiles.length === 0) {
      console.log('⚠️ No test results found in allure-results/');
      return;
    }
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    const failedTestDetails = [];
    
    // Process each result file
    for (const resultFile of allureResultFiles) {
      try {
        const jsonContent = fs.readFileSync(resultFile, 'utf8');
        const allureResult = JSON.parse(jsonContent);
        
        totalTests++;
        
        switch (allureResult.status) {
          case 'passed':
            passedTests++;
            break;
          case 'failed':
            failedTests++;
            failedTestDetails.push({
              name: allureResult.name,
              file: resultFile,
              labels: allureResult.labels || []
            });
            break;
          case 'skipped':
            skippedTests++;
            break;
          default:
            console.log(`⚠️ Unknown status: ${allureResult.status} for ${allureResult.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to process ${resultFile}:`, error.message);
      }
    }
    
    // Calculate success rate
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
    
    // Output summary
    console.log(`\n📈 Results:`);
    console.log(`   Total Scenarios: ${totalTests}`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   ⏭️ Skipped: ${skippedTests}`);
    console.log(`   📊 Success Rate: ${successRate}%`);
    
    // Show failed test details if any
    if (failedTests > 0) {
      console.log(`\n❌ FAILED SCENARIOS:`);
      failedTestDetails.forEach((test, index) => {
        console.log(`   ${index + 1}. ${test.name}`);
        
        // Extract feature/story information from labels
        const feature = test.labels.find(l => l.name === 'feature')?.value || 'Unknown Feature';
        const story = test.labels.find(l => l.name === 'story')?.value || 'Unknown Story';
        console.log(`      📁 Feature: ${feature}`);
        console.log(`      📖 Story: ${story}`);
      });
    }
    
    // Overall status
    if (failedTests === 0) {
      console.log(`\n🎉 ALL TESTS PASSED! 🎉`);
    } else {
      console.log(`\n⚠️ ${failedTests} test(s) failed. Check details above.`);
    }
    
    console.log('='.repeat(50));
    console.log(''); // Add empty line
    
  } catch (error) {
    console.error('❌ Failed to generate test summary:', error.message);
    process.exit(1);
  }
}

// Run the summary generator
generateTestSummary(); 