const fs = require('fs');
const path = require('path');

const base = path.join('jianlai-wiki-nuxt', 'public', 'images');
const src = path.join(base, 'official', 'jianlai-douyin', 'all-webp');

const dirs = ['banners', 'characters', 'locations', 'textures', 'icons', 'seals', 'ui'];

dirs.forEach(dir => {
    const dirPath = path.join(base, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

const assets = {
    "2024-09-29_剑来动画 最新壁纸请查收，共赏骊珠小镇的国风美学！_剑来_7419945011212455208_6.webp": "banners/home-hero.webp",
    "2024-08-19_剑来动画 剑气水墨风视觉盛宴，大家千呼万唤的剑来动画第一波壁纸来啦！_剑来_7404806582191639859_5.webp": "banners/characters-banner.webp",
    "2024-09-29_剑来动画 最新壁纸请查收，共赏骊珠小镇的国风美学！_剑来_7419945011212455208_1.webp": "banners/world-banner.webp",
    "2024-10-30_剑来动画 本周壁纸上新！剑气水墨写意，月下氛围丛生！_剑来_7431558830942670099_2.webp": "banners/cultivation-banner.webp",
    "2024-09-20_剑来动画 第八集壁纸已上线，邀诸位道友共赏~_剑来_7416423194460048655_10.webp": "banners/swordsmanship-banner.webp",
    "2024-08-19_剑来动画 剑气水墨风视觉盛宴，大家千呼万唤的剑来动画第一波壁纸来啦！_剑来_7404806582191639859_12.webp": "banners/factions-banner.webp",
    "2024-10-05_剑来动画 “只信手中剑，不信世间邪”_剑来 _陈平安 _宁姚_7422167537309273380_7.webp": "banners/artifacts-banner.webp",
    "2024-10-05_剑来动画 新一集高清壁纸送上，请诸位道友一品国风美学。_剑来_7422179479201582376_3.webp": "textures/ink-wash-01.webp",
    "2024-10-05_剑来动画 水墨剑气尽显中式韵味，水墨壁纸送达，与四方道友共赏国风之美！_剑来_7422221738445901067_5.webp": "textures/ink-wash-02.webp"
};

for (const [key, dest] of Object.entries(assets)) {
    const srcPath = path.join(src, key);
    const destPath = path.join(base, dest);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${key} to ${dest}`);
    } else {
        console.log(`Source not found: ${srcPath}`);
    }
}
