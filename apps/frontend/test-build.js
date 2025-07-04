#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🧪 Testing frontend build...');

const distPath = path.join(process.cwd(), 'dist');
const indexPath = path.join(distPath, 'index.html');

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('❌ Build failed: dist directory not found');
  process.exit(1);
}

// Check if index.html exists
if (!fs.existsSync(indexPath)) {
  console.error('❌ Build failed: index.html not found in dist');
  process.exit(1);
}

// Check if index.html contains expected content
const indexContent = fs.readFileSync(indexPath, 'utf8');

if (!indexContent.includes('ORBIT IA')) {
  console.error('❌ Build failed: index.html does not contain "ORBIT IA"');
  process.exit(1);
}

// Check for CSS and JS files
const files = fs.readdirSync(distPath);
const hasCSS = files.some(file => file.endsWith('.css'));
const hasJS = files.some(file => file.endsWith('.js'));

if (!hasCSS) {
  console.warn('⚠️  Warning: No CSS files found in build');
}

if (!hasJS) {
  console.error('❌ Build failed: No JavaScript files found in build');
  process.exit(1);
}

console.log('✅ Frontend build test passed!');
console.log(`📁 Build directory: ${distPath}`);
console.log(`📄 Files generated: ${files.length}`);
console.log('🎉 All checks passed successfully!');

process.exit(0);

