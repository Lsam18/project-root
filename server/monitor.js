// monitor.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

let logs = [];

function startMonitoring() {
  setInterval(() => {
    // Use PowerShell command to fetch recent RDP log entries
    exec('Get-WinEvent -LogName "Microsoft-Windows-TerminalServices-LocalSessionManager/Operational" | Select-Object -Property TimeCreated, Message', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error fetching logs: ${err}`);
        return;
      }

      const newLogs = parseEventLogs(stdout);
      logs = logs.concat(newLogs);
      
      // Save logs to file
      fs.writeFileSync(path.join(__dirname, '../data/logs.json'), JSON.stringify(logs, null, 2));
    });
  }, 5000); // Interval of 5 seconds
}

function parseEventLogs(rawData) {
  // Parse raw PowerShell output into a usable JSON format
  const logEntries = rawData.split('\n').filter(line => line.trim() !== '');
  return logEntries.map(entry => {
    return {
      time: new Date().toISOString(),
      message: entry.trim()
    };
  });
}

function getLogData() {
  return logs;
}

module.exports = {
  startMonitoring,
  getLogData
};
