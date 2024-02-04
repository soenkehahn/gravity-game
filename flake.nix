{
  inputs.nixpkgs.url = "github:nixos/nixpkgs";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nix-filter.url = "github:numtide/nix-filter";
  outputs = { self, nixpkgs, flake-utils, nix-filter }:
    flake-utils.lib.eachSystem [ "x86_64-linux" ] (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        src = nix-filter.lib {
          root = ./.;
          exclude = [
            "flake.nix"
            "flake.lock"
          ];
        };
        packageJSON = pkgs.lib.importJSON ./package.json;
        node_modules = pkgs.mkYarnModules {
          pname = "gravity-game-node-modules";
          version = packageJSON.version;
          packageJSON = ./package.json;
          yarnLock = ./yarn.lock;
          nodejs = pkgs.nodejs;
        };
        bundleScript = pkgs.writeText "bundleScript" ''
          const esbuild = require("esbuild");
          const flow = require("esbuild-plugin-flow");

          esbuild
            .build({
              entryPoints: ["src/index.js"],
              outfile: "dist/main.js",
              bundle: true,
              loader: { ".js": "jsx" },
              plugins: [flow(/\.js$/)],
            })
            .catch(() => process.exit(1));
        '';
        bundle = pkgs.runCommand "gravity-game"
          {
            nativeBuildInputs = [ pkgs.nodejs ];
          }
          ''
            cp -r ${src} src
            chmod a+rwX -R src
            cd src
            cp -r ${node_modules}/node_modules .
            cp ${bundleScript} bundle.js
            node ./bundle.js
            cp -r dist $out
          '';

      in
      {
        packages.default = bundle;
      }
    );
}
