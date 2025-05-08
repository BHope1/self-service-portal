; Microsoft Cleanup Optimizer Setup Script
[Setup]
AppName=Microsoft Cleanup Optimizer
AppVersion=1.0
DefaultDirName={autopf}\CleanupOptimizer
DefaultGroupName=Cleanup Optimizer
OutputDir=.
OutputBaseFilename=CleanupInstaller
SetupIconFile=app_icon.ico
Compression=lzma
SolidCompression=yes
LicenseFile=license.txt

[Files]
Source: "dist\main.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Cleanup Optimizer"; Filename: "{app}\main.exe"
Name: "{group}\Uninstall Cleanup Optimizer"; Filename: "{uninstallexe}"