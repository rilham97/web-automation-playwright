import reporter from 'cucumber-html-reporter';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if JSON report exists
const jsonReportPath = path.join(__dirname, '..', 'reports', 'cucumber', 'cucumber-report.json');

if (!fs.existsSync(jsonReportPath)) {
  console.error('❌ Cucumber JSON report not found. Please run tests first.');
  process.exit(1);
}

const options = {
  theme: 'bootstrap',
  jsonFile: jsonReportPath,
  output: path.join(__dirname, '..', 'reports', 'cucumber', 'cucumber-report.html'),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': 'SauceDemo',
    'Browser': 'Chrome',
    'Platform': 'Local',
    'Parallel': 'Scenarios',
    'Executed': 'Local'
  },
  failedSummaryReport: true,
  brandTitle: 'Playwright + Cucumber BDD Test Report',
  name: 'SauceDemo E2E Test Results'
};

try {
  reporter.generate(options);
  console.log('✅ Cucumber HTML report generated successfully!');
  console.log(`📊 Report location: ${options.output}`);
  console.log('🚀 Open the report in your browser to view results');
} catch (error) {
  console.error('❌ Error generating Cucumber HTML report:', error.message);
  process.exit(1);
} 