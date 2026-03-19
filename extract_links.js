const fs = require('fs');
const path = require('path');

// Function to recursively find all files in a directory
const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('.next')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (['.tsx', '.ts', '.jsx', '.js', '.md', '.mdx'].some(ext => file.endsWith(ext))) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const allFiles = walkSync('./src');
const links = new Set();
const servicesSq = new Set();
const servicesEn = new Set();
const blogSq = new Set();
const blogEn = new Set();

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Extract static href="..."
  const hrefMatches = content.match(/href=["']([^"']+)["']/g);
  if (hrefMatches) {
    hrefMatches.forEach(match => {
      const link = match.replace(/href=["']/, '').replace(/["']$/, '');
      if ((link.startsWith('/') || link.startsWith('http')) && !link.includes('$') && !link.includes('{')) {
        links.add(link);
      }
    });
  }

  // Extract Markdown links [text](/link)
  const mdMatches = content.match(/\]\((/[^\)]+)\)/g);
  if (mdMatches) {
    mdMatches.forEach(match => {
      const link = match.replace(/\]\(/, '').replace(/\)$/, '');
      if (!link.includes('$') && !link.includes('{')) links.add(link);
    });
  }

  // If it's services.ts, parse slugs
  if (file.includes('services.ts')) {
    let currentLang = 'sq';
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.includes('en: {')) currentLang = 'en';
      const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
      if (slugMatch) {
         if (currentLang === 'sq') servicesSq.add(slugMatch[1]);
         if (currentLang === 'en') servicesEn.add(slugMatch[1]);
      }
    });
  }

  // If it's blog.ts, parse slugs
  if (file.includes('blog.ts')) {
    let currentLang = 'sq';
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.includes('en: {')) currentLang = 'en';
      const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
      if (slugMatch) {
         if (currentLang === 'sq') blogSq.add(slugMatch[1]);
         if (currentLang === 'en') blogEn.add(slugMatch[1]);
      }
    });
  }
});

// Generate dynamic links
servicesSq.forEach(slug => links.add(`/sq/sherbimet/${slug}`));
servicesEn.forEach(slug => links.add(`/en/services/${slug}`));
blogSq.forEach(slug => links.add(`/sq/blogu/${slug}`));
blogEn.forEach(slug => links.add(`/en/blog/${slug}`));

// Basic navigation paths
const allStaticPaths = [
  '/', '/sq', '/en',
  '/sq/sherbimet', '/en/services',
  '/sq/portofolio', '/en/portfolio',
  '/sq/blogu', '/en/blog',
  '/sq/kontakti', '/en/contact'
];
allStaticPaths.forEach(p => links.add(p));

// Sort and format as Markdown checklist
const formattedLinks = Array.from(links)
  .sort()
  .map(link => {
    const fullUrl = link.startsWith('http') ? link : `https://elektronova.online${link}`;
    return `- [ ] [${fullUrl}](${fullUrl})`;
  })
  .join('\n');

const markdownContent = `# Elektronova Full Website Links Audit

Here is the complete list of all internal and dynamic links extracted from the source code. You can click on them one by one to verify that there are no 404s.

${formattedLinks}

*Total Links Found: ${links.size}*
`;

const destPath = 'C:\\Users\\Gaming\\.gemini\\antigravity\\brain\\9ff63034-4584-46a9-93e5-20eee5fccf2c\\all_website_links.md';
fs.writeFileSync(destPath, markdownContent);
console.log('Artifact created at:', destPath);
