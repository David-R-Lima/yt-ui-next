import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};
module.exports = {
  allowedDevOrigins: ['sensible-marmoset-violently.ngrok-free.app'],
}
export default nextConfig;
