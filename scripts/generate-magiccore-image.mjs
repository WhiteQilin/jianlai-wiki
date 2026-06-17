import fs from "node:fs/promises";
import path from "node:path";

const prompt = process.argv.slice(2).join(" ").trim();

if (!prompt) {
  console.error('Usage: node scripts/generate-magiccore-image.mjs "your prompt here"');
  process.exit(1);
}

const apiKey = process.env.FUEL_API_KEY;
if (!apiKey) {
  console.error("Missing FUEL_API_KEY");
  process.exit(1);
}

const response = await fetch("https://fuel.magiccoreai.com/v1/images/generations", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-image-2",
    prompt,
    size: "1024x1024"
  })
});

const json = await response.json();

if (!response.ok) {
  console.error("Image API failed:");
  console.error(JSON.stringify(json, null, 2));
  process.exit(1);
}

const outDir = path.resolve("public/images/generated");
await fs.mkdir(outDir, { recursive: true });

const filename = `magiccore-${Date.now()}.png`;
const outPath = path.join(outDir, filename);

if (json?.data?.[0]?.b64_json) {
  const buffer = Buffer.from(json.data[0].b64_json, "base64");
  await fs.writeFile(outPath, buffer);
} else if (json?.data?.[0]?.url) {
  const imgRes = await fetch(json.data[0].url);
  if (!imgRes.ok) {
    console.error("Failed to download generated image URL");
    process.exit(1);
  }
  const arr = Buffer.from(await imgRes.arrayBuffer());
  await fs.writeFile(outPath, arr);
} else {
  console.error("No image data returned:");
  console.error(JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log(`Saved image to: ${outPath}`);