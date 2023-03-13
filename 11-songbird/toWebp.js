// to start: node webp.js

import path from "path";
import { fileURLToPath } from "url";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";

(async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  console.log([path.resolve(__dirname, "assets/images/*.{jpg,png}").replace(/\\/g, "/")]);

  await imagemin([path.resolve(__dirname, "assets/images/*.{jpg,png}").replace(/\\/g, "/")],
    {
      destination: path.resolve(__dirname, "assets/webp/").replace(/\\/g, "/"),
      plugins: [imageminWebp({ quality: 70 })]
    });

  console.log("Images optimized");
})();
