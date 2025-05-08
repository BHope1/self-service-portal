import subprocess
import sys
import os

# Handle PyInstaller path
if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.dirname(__file__)

script_path = os.path.join(base_path, "Cleanup-Optimize.ps1")

# Run PowerShell script
subprocess.run([
    "powershell",
    "-ExecutionPolicy", "Bypass",
    "-File", script_path
])

# Wait for user before closing
os.system("pause")