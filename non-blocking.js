const fs = require('fs');

// Start reading the file asynchronously
fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File contents:', data);
});

// This line executes immediately, even though readFile is still working
console.log('This line is printed while the file is being read');
