const fs = require('fs');
const path = require('path');

// Read package-lock.json
const packageLock = require('./package-lock.json');

// Create a new package.json object
const newPackage = {
  name: packageLock.name,
  version: packageLock.version,
  dependencies: {},
  devDependencies: {}
};

// Fill in dependencies and devDependencies
Object.entries(packageLock.dependencies).forEach(([name, info]) => {
  if (info.dev) {
    newPackage.devDependencies[name] = info.version;
  } else {
    newPackage.dependencies[name] = info.version;
  }
});

// Write the new package.json
fs.writeFileSync(
  path.join(__dirname, 'package.json'),
  JSON.stringify(newPackage, null, 2)
);

console.log('New package.json has been generated.');