import qrcode from "qrcode-terminal";
import { createServer } from "vite";

const useHttps = process.argv.includes("--https");
const mode = useHttps ? "https" : "development";

const server = await createServer({
  mode,
  configFile: "vite.config.js"
});

await server.listen();
server.printUrls();

const networkUrls = server.resolvedUrls?.network || [];

if (networkUrls.length > 0) {
  console.log("");
  console.log("QR codes for phone testing:");

  for (const url of networkUrls) {
    console.log("");
    console.log(url);
    qrcode.generate(url, { small: true });
  }
}

const close = async () => {
  await server.close();
  process.exit(0);
};

process.on("SIGINT", close);
process.on("SIGTERM", close);
