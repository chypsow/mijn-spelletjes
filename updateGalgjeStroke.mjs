import fs from "fs";
import path from "path"; // ✅ Gebruik `import` voor ES Modules

// Map met je SVG-bestanden
const folderPath = "./images/galgjeSvg"; // Pas aan naar jouw map

// Lees alle bestanden in de map
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error("Fout bij het lezen van de map:", err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file) === ".svg") {
            const filePath = path.join(folderPath, file);

            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) {
                    console.error(`Fout bij lezen van ${file}:`, err);
                    return;
                }

                const updatedData = data.replace(/style="stroke:black"/g, 'style="stroke:#efefef"');

                fs.writeFile(filePath, updatedData, "utf8", err => {
                    if (err) {
                        console.error(`Fout bij schrijven van ${file}:`, err);
                    } else {
                        console.log(`✅ Stroke-kleur aangepast in: ${file}`);
                    }
                });
            });
        }
    });
});
