import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');
const ghostLinks = new Map();
const existingFiles = new Set();

function collectFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      collectFiles(fullPath);
    } else if (file.endsWith('.md') && !file.startsWith('_') && !fullPath.includes('_meta') && !fullPath.includes('_templates')) {
      const relPath = path.relative(contentDir, fullPath).replace(/\\/g, '/').replace(/\.md$/, '');
      existingFiles.add(relPath);
    }
  }
}

collectFiles(contentDir);

function scanRelationships(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanRelationships(fullPath);
    } else if (file.endsWith('.md') && !file.startsWith('_') && !fullPath.includes('_meta') && !fullPath.includes('_templates')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const sourceRelPath = path.relative(contentDir, fullPath).replace(/\\/g, '/').replace(/\.md$/, '');
      
      const lines = content.split(/\r?\n/);
      let inRelationships = false;
      
      for (const line of lines) {
        if (line.startsWith('relationships:')) {
          inRelationships = true;
          continue;
        }
        
        if (inRelationships) {
          if (line.match(/^[a-zA-Z]/) && !line.startsWith(' ')) {
            inRelationships = false;
            continue;
          }
          
          const linkMatch = line.match(/link:\s*['"]?([^'"]+)['"]?/);
          if (linkMatch) {
            const targetPath = linkMatch[1].replace(/^\//, '');
            if (targetPath && targetPath.trim() !== '' && !existingFiles.has(targetPath)) {
              if (!ghostLinks.has(targetPath)) {
                ghostLinks.set(targetPath, { count: 0, sources: new Set() });
              }
              const entry = ghostLinks.get(targetPath);
              entry.count++;
              entry.sources.add(sourceRelPath);
            }
          }
        }
      }
    }
  }
}

scanRelationships(contentDir);

const sortedGhosts = Array.from(ghostLinks.entries())
  .map(([target, data]) => ({
    target,
    count: data.count,
    sources: Array.from(data.sources)
  }))
  .sort((a, b) => b.count - a.count);

console.log(`Total existing files: ${existingFiles.size}`);
console.log(`Total unique ghost links: ${sortedGhosts.length}`);
console.log('\nTop Ghost Links:');
for (const ghost of sortedGhosts.slice(0, 20)) {
  console.log(`- ${ghost.target} (${ghost.count} inbound)`);
  console.log(`  Sources: ${ghost.sources.join(', ')}`);
}

fs.writeFileSync('ghost-links-report.json', JSON.stringify(sortedGhosts, null, 2));
