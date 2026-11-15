# Mayordomo Familiar RD — PWA

Aplicación web progresiva (PWA) optimizada para celulares **Android** para la administración financiera integral, presupuesto familiar, ahorro, inversiones, compras en supermercados e inventario del hogar en República Dominicana (DOP$).

## Características PWA
- Instalable en pantalla de inicio en **Android (Chrome / Edge / Samsung Internet)** e iOS Safari.
- Navegación inferior ergonómica para uso con una mano en dispositivos móviles.
- Funcionamiento **sin conexión (Offline)** mediante Service Worker (`vite-plugin-pwa` + Workbox) y persistencia local en `LocalStorage`.
- Exportación de reportes en **PDF**, **Excel (.xlsx)**, **CSV** y copias de seguridad **JSON**.
- Asistente **Mayordomo AI** (conectado a Gemini en línea y motor de análisis local sin conexión).

## Desarrollo Local
```bash
npm install
npm run dev
```

## Compilación de Producción
```bash
npm run lint
npm run build
```

## Despliegue en GitHub y Vercel
1. Sube este repositorio a **GitHub** (`git init`, `git add .`, `git commit -m "PWA lista para Vercel"`, `git push`).
2. En **Vercel**, importa el repositorio desde GitHub.
3. Vercel detectará automáticamente la configuración de `vercel.json`:
   - Framework: `Vite`
   - Build Command: `vite build`
   - Output Directory: `dist`
4. *(Opcional para el módulo Gemini AI en línea)* En **Vercel > Settings > Environment Variables**, agrega:
   - `GEMINI_API_KEY` = tu clave de API de Google Gemini.
5. Haz clic en **Deploy**.
6. Abre la URL HTTPS de Vercel en **Google Chrome en tu celular Android** y toca **"Instalar App"** en la barra superior o en el menú `⋮ > Instalar aplicación`.
