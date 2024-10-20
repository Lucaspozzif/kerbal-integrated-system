import type { ModuleOptions } from "webpack";

export const rules: Required<ModuleOptions>["rules"] = [
  // Add support for native node modules
  {
    // Handle PNG, JPEG, GIF image files
    test: /\.(png|jpe?g|gif|svg|ttf|eot|woff|woff2)$/i,
    type: "asset/resource",
  },
  {
    // Handle native modules with .node extensions
    test: /native_modules[/\\].+\.node$/,
    use: "node-loader",
  },
  {
    // Handle JavaScript and .node files in node_modules
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    // Handle TypeScript (.ts/.tsx) files
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  },
];
