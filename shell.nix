{ pkgs ? import <nixpkgs> { config.allowUnfree = true; } }:
pkgs.mkShell {
  packages = [
    pkgs.nodejs_24
    pkgs.nodePackages_latest.typescript
    pkgs.nodePackages_latest.typescript-language-server
    pkgs.yarn
  ];
  shellHook = ''
    echo "node: $(node -v) | npm: $(npm -v) | typescript: $(tsc -v) | yarn: $(yarn -v)"
  '';
}
