import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function assetUploadPlugin() {
  return {
    name: 'asset-upload-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/upload-asset', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => body += chunk);
          req.on('end', () => {
            try {
              const { assetKey, dataUrl } = JSON.parse(body);
              if (assetKey && dataUrl) {
                const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');

                const targetFiles: string[] = [];
                if (assetKey === 'escudo') {
                  targetFiles.push('public/escudo-oficial.png', 'src/assets/escudo-oficial.png');
                } else if (assetKey === 'jpx') {
                  targetFiles.push('public/patrocinador-jpx-studio.png', 'src/assets/patrocinador-jpx-studio.png');
                } else if (assetKey === 'jpx-white') {
                  targetFiles.push('public/patrocinador-jpx-studio-white.png', 'src/assets/patrocinador-jpx-studio-white.png');
                } else if (assetKey === 'proton') {
                  targetFiles.push('public/patrocinador-proton-contabeis.png', 'src/assets/patrocinador-proton-contabeis.png');
                } else if (assetKey === 'nato') {
                  targetFiles.push('public/patrocinador-nato-gym.png', 'src/assets/patrocinador-nato-gym.png');
                } else if (assetKey === 'hero_bg_0') {
                  targetFiles.push('public/foto-time-1.png');
                } else if (assetKey === 'hero_bg_1') {
                  targetFiles.push('public/foto-time-2.png');
                } else if (assetKey === 'hero_bg_2') {
                  targetFiles.push('public/foto-time-3.png');
                } else if (assetKey.startsWith('slot_')) {
                  const dir = path.resolve(__dirname, 'public/sponsors');
                  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                  targetFiles.push(`public/sponsors/${assetKey}.png`);
                }

                targetFiles.forEach((relPath) => {
                  const fullPath = path.resolve(__dirname, relPath);
                  const parent = path.dirname(fullPath);
                  if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
                  fs.writeFileSync(fullPath, buffer);
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, files: targetFiles }));
                return;
              }
            } catch (err) {
              console.error('Error handling asset upload:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/save-sponsors-data') {
          let body = '';
          req.on('data', (chunk: any) => body += chunk);
          req.on('end', () => {
            try {
              fs.writeFileSync(path.resolve(__dirname, 'public/sponsors-data.json'), body);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
              return;
            } catch (err) {
              console.error('Error saving sponsors data:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
          });
          return;
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), assetUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
