const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/[locale]/portfolio/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

let imgIndex = 1;
content = content.replace(/image:\s*['"]\/images\/stock\/[^'"]+['"]/g, match => {
    const newImage = `image: "/images/portfolio/project-${imgIndex}.jpg"`;
    imgIndex++;
    return newImage;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced ' + (imgIndex - 1) + ' portfolio images successfully.');
