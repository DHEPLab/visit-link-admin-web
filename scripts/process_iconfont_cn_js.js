import fs from "node:fs";
import path from "node:path";
import https from "node:https";

/* Usage: node ./scripts/process_iconfont_cn_js.js --res=https://at.alicdn.com/t/font_1901605_1mrmcd6g6xr.js --output=./src/icons
 *   Note: previous all the svg icons hosting in iconfont.cn, but we lost the management for this project, also the iconfont.cn is not friendly for global usage.
 *   Origin iconfont.cn project: https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=1901605
 */

const args = process.argv.slice(2);
let resUrl = "";
let outputFolder = "";

args.forEach((arg) => {
  if (arg.startsWith("--res=")) {
    resUrl = arg.split("=")[1];
  } else if (arg.startsWith("--output=")) {
    outputFolder = arg.split("=")[1];
  }
});

if (!resUrl || !outputFolder) {
  console.error("Usage: node script.js --res=<url> --output=<folder>");
  process.exit(1);
}

https
  .get(resUrl, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      const symbolRegex = /<symbol[^>]*>([\s\S]*?)<\/symbol>/g;
      const symbols = [...data.matchAll(symbolRegex)];

      if (!symbols) {
        console.error("No symbols found in the JS file.");
        return;
      }

      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
      }

      symbols.forEach((symbol) => {
        const [fullMatch, innerContent] = symbol;
        const idMatch = fullMatch.match(/id="([^"]+)"/);
        if (!idMatch) return;

        const symbolId = idMatch[1];
        const viewBoxMatch = fullMatch.match(/viewBox="([^"]+)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 1024 1024";

        const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" xml:space="preserve">
  ${innerContent}
</svg>`;

        // Save SVG to file
        const filePath = path.join(outputFolder, `${symbolId}.svg`);
        fs.writeFileSync(filePath, svgContent.trim(), "utf8");
        console.log(`Saved ${filePath}`);
      });
    });
  })
  .on("error", (err) => {
    console.error("Error fetching JS file:", err);
  });
