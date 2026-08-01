import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статичний експорт: Next збирає готовий HTML у папку out/,
  // Cloudflare Pages роздає її як статику — сервер не потрібен.
  output: "export",

  // Обов'язково разом з output: "export". Вбудований оптимізатор
  // зображень вимагає Node-сервера, якого в статиці немає.
  images: { unoptimized: true },

  // Кожен маршрут стає окремою папкою з index.html, тому статичний
  // хост коректно віддає /projects/slug/ без розширення .html.
  trailingSlash: true,
};

export default nextConfig;
