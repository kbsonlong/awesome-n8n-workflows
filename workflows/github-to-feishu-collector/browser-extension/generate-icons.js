#!/usr/bin/env node

// GitHub收集器扩展图标生成器
// 需要安装: npm install canvas

const fs = require('fs');
const path = require('path');

// 检查是否有canvas模块，如果没有就使用简单的SVG方法
let Canvas, createCanvas, loadImage;
try {
    const canvas = require('canvas');
    Canvas = canvas.Canvas;
    createCanvas = canvas.createCanvas;
    loadImage = canvas.loadImage;
    console.log('✅ 使用Canvas API生成图标');
} catch (err) {
    console.log('⚠️ Canvas模块未安装，将生成SVG图标');
}

// 生成SVG图标
function generateSVGIcon(size) {
    const padding = Math.max(2, size * 0.1);
    const githubSize = size * 0.35;
    const arrowSize = size * 0.2;
    const tableSize = size * 0.35;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- 背景 -->
    <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0366d6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0256cc;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- 圆角背景 -->
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bgGrad)"/>
    
    <!-- 主内容区域 -->
    <rect x="${padding}" y="${padding}" width="${size - padding * 2}" height="${size - padding * 2}" 
          rx="${size * 0.1}" fill="#ffffff" opacity="0.95"/>
    
    <!-- GitHub图标区域 -->
    <rect x="${padding * 2}" y="${padding * 2}" width="${githubSize}" height="${githubSize}" 
          rx="${githubSize * 0.15}" fill="#24292f"/>
    
    <!-- GitHub文字 -->
    <text x="${padding * 2 + githubSize / 2}" y="${padding * 2 + githubSize / 2 + size * 0.06}" 
          text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" 
          font-size="${size * 0.08}" font-weight="bold">GH</text>
    
    <!-- 箭头 -->
    <g stroke="#28a745" stroke-width="${Math.max(1, size * 0.03)}" fill="none" stroke-linecap="round">
        <line x1="${padding * 2 + githubSize + size * 0.05}" y1="${padding * 2 + githubSize / 2}" 
              x2="${padding * 2 + githubSize + arrowSize}" y2="${padding * 2 + githubSize / 2}"/>
        <polyline points="${padding * 2 + githubSize + arrowSize - size * 0.06},${padding * 2 + githubSize / 2 - size * 0.04} 
                          ${padding * 2 + githubSize + arrowSize},${padding * 2 + githubSize / 2} 
                          ${padding * 2 + githubSize + arrowSize - size * 0.06},${padding * 2 + githubSize / 2 + size * 0.04}"/>
    </g>
    
    <!-- 飞书表格 -->
    <rect x="${size - padding * 2 - tableSize}" y="${padding * 2}" width="${tableSize}" height="${tableSize}" 
          rx="${tableSize * 0.1}" fill="#28a745"/>
    
    <!-- 表格线条 -->
    <g stroke="#ffffff" stroke-width="${Math.max(1, size * 0.015)}" opacity="0.9">
        <!-- 水平线 -->
        <line x1="${size - padding * 2 - tableSize + tableSize * 0.1}" y1="${padding * 2 + tableSize * 0.25}" 
              x2="${size - padding * 2 - tableSize * 0.1}" y2="${padding * 2 + tableSize * 0.25}"/>
        <line x1="${size - padding * 2 - tableSize + tableSize * 0.1}" y1="${padding * 2 + tableSize * 0.5}" 
              x2="${size - padding * 2 - tableSize * 0.1}" y2="${padding * 2 + tableSize * 0.5}"/>
        <line x1="${size - padding * 2 - tableSize + tableSize * 0.1}" y1="${padding * 2 + tableSize * 0.75}" 
              x2="${size - padding * 2 - tableSize * 0.1}" y2="${padding * 2 + tableSize * 0.75}"/>
        
        <!-- 垂直线 -->
        <line x1="${size - padding * 2 - tableSize + tableSize * 0.33}" y1="${padding * 2 + tableSize * 0.1}" 
              x2="${size - padding * 2 - tableSize + tableSize * 0.33}" y2="${padding * 2 + tableSize * 0.9}"/>
        <line x1="${size - padding * 2 - tableSize + tableSize * 0.66}" y1="${padding * 2 + tableSize * 0.1}" 
              x2="${size - padding * 2 - tableSize + tableSize * 0.66}" y2="${padding * 2 + tableSize * 0.9}"/>
    </g>
    
    ${size >= 48 ? `<!-- 底部文字 -->
    <text x="${size / 2}" y="${size - padding * 2}" text-anchor="middle" fill="#0366d6" 
          font-family="Arial, sans-serif" font-size="${size * 0.08}" font-weight="bold">收集器</text>` : ''}
</svg>`;
}

// 如果有Canvas，生成PNG，否则生成SVG
async function generateIcons() {
    const sizes = [16, 48, 128];
    const outputDir = path.join(__dirname);
    
    console.log('🚀 开始生成GitHub收集器扩展图标...');
    
    for (const size of sizes) {
        if (createCanvas) {
            // 使用Canvas生成PNG
            await generatePNGIcon(size, outputDir);
        } else {
            // 生成SVG
            const svg = generateSVGIcon(size);
            const filename = `icon${size}.svg`;
            fs.writeFileSync(path.join(outputDir, filename), svg);
            console.log(`✅ 生成 ${filename}`);
        }
    }
    
    if (!createCanvas) {
        console.log('\n💡 提示: SVG图标已生成。如需PNG格式，请安装canvas模块:');
        console.log('   npm install canvas');
        console.log('\n🔧 或者使用在线工具将SVG转换为PNG:');
        console.log('   https://cloudconvert.com/svg-to-png');
    }
    
    console.log('\n🎉 图标生成完成！');
}

// 使用Canvas生成PNG图标
async function generatePNGIcon(size, outputDir) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // 根据尺寸调整细节
    const padding = Math.max(2, size * 0.1);
    const githubSize = size * 0.35;
    const tableSize = size * 0.35;
    
    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#0366d6');
    gradient.addColorStop(1, '#0256cc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // 主背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    roundRect(ctx, padding, padding, size - padding * 2, size - padding * 2, size * 0.1);
    ctx.fill();
    
    // GitHub区域
    ctx.fillStyle = '#24292f';
    ctx.beginPath();
    roundRect(ctx, padding * 2, padding * 2, githubSize, githubSize, githubSize * 0.15);
    ctx.fill();
    
    // GitHub文字
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.08}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GH', padding * 2 + githubSize / 2, padding * 2 + githubSize / 2);
    
    // 箭头
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = Math.max(1, size * 0.03);
    ctx.lineCap = 'round';
    
    const arrowStart = padding * 2 + githubSize + size * 0.05;
    const arrowEnd = arrowStart + size * 0.15;
    const arrowY = padding * 2 + githubSize / 2;
    
    ctx.beginPath();
    ctx.moveTo(arrowStart, arrowY);
    ctx.lineTo(arrowEnd, arrowY);
    ctx.moveTo(arrowEnd - size * 0.04, arrowY - size * 0.03);
    ctx.lineTo(arrowEnd, arrowY);
    ctx.lineTo(arrowEnd - size * 0.04, arrowY + size * 0.03);
    ctx.stroke();
    
    // 飞书表格
    ctx.fillStyle = '#28a745';
    ctx.beginPath();
    roundRect(ctx, size - padding * 2 - tableSize, padding * 2, tableSize, tableSize, tableSize * 0.1);
    ctx.fill();
    
    // 表格线条
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, size * 0.015);
    ctx.globalAlpha = 0.9;
    
    const tableX = size - padding * 2 - tableSize;
    const tableY = padding * 2;
    
    // 水平线
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(tableX + tableSize * 0.1, tableY + tableSize * i * 0.25);
        ctx.lineTo(tableX + tableSize * 0.9, tableY + tableSize * i * 0.25);
        ctx.stroke();
    }
    
    // 垂直线
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(tableX + tableSize * (0.33 * i + 0.1), tableY + tableSize * 0.1);
        ctx.lineTo(tableX + tableSize * (0.33 * i + 0.1), tableY + tableSize * 0.9);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;
    
    // 底部文字（仅大尺寸显示）
    if (size >= 48) {
        ctx.fillStyle = '#0366d6';
        ctx.font = `bold ${size * 0.08}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('收集器', size / 2, size - padding * 2);
    }
    
    // 保存PNG文件
    const filename = `icon${size}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, filename), buffer);
    console.log(`✅ 生成 ${filename} (${size}x${size})`);
}

// 圆角矩形辅助函数
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// 执行生成
generateIcons().catch(console.error);