{
  description = "A reproducible Playwright environment";

  # Inputs are your dependencies, like nixpkgs
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  # Outputs are the build results of your flake
  outputs = { self, nixpkgs }:
    let
      # System architecture (e.g., x86_64-linux)
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      # Define a development shell
      devShells.${system}.default = pkgs.mkShell {
        # Packages available in the shell
        buildInputs = [
          pkgs.nodejs_20
          pkgs.playwright
        ];

        # Environment variables set inside the shell
        # This is the magic: point Playwright to the Nix-built browsers
        PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";

        # Run a command when you first enter the shell
        shellHook = ''
          echo "✅ Playwright Nix Environment Ready"
          echo "📦 Browsers are at: $PLAYWRIGHT_BROWSERS_PATH"
        '';
      };
    };
}