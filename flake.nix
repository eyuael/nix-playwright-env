{
  description = "A reproducible Playwright TypeScript environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        # Development shell with TypeScript support
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ 
            nodejs_20 
            playwright-driver
            typescript
            nodePackages.ts-node
            nodePackages.npm
          ];
          
          PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
          
          shellHook = ''
            echo '✅ Playwright TypeScript Nix Environment Ready'
            echo '📦 Available commands:'
            echo '  npm install     - Install dependencies'
            echo '  npm run build   - Build TypeScript'
            echo '  npm test        - Run Playwright tests'
            echo '  npm run dev     - Run with ts-node'
            
            # Create screenshots directory if it doesn't exist
            mkdir -p screenshots
          '';
        };

        # Docker image package with TypeScript support (Linux only)
        packages = pkgs.lib.optionalAttrs (system == "x86_64-linux") {
          default = pkgs.dockerTools.buildLayeredImage {
            name = "playwright-typescript-app";
            tag = "latest";

            # Contents of the image
            contents = with pkgs; [
              nodejs_20
              playwright-driver
              typescript
              nodePackages.npm
              bash
              coreutils
              findutils
            ];

            # Command to run when the container starts
            config = {
              Cmd = [ "/bin/bash" "-c" "cd /app && npm install && npm run build && npm test" ];
              Env = [ 
                "PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}"
                "NODE_ENV=production"
              ];
              WorkingDir = "/app";
            };
          };

          # Additional package for development image
          dev-image = pkgs.dockerTools.buildLayeredImage {
            name = "playwright-typescript-dev";
            tag = "latest";

            contents = with pkgs; [
              nodejs_20
              playwright-driver
              typescript
              nodePackages.npm
              nodePackages.ts-node
              bash
              coreutils
              findutils
              git
            ];

            config = {
              Cmd = [ "/bin/bash" ];
              Env = [ 
                "PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}"
                "NODE_ENV=development"
              ];
              WorkingDir = "/app";
            };
          };
        };
      });
}