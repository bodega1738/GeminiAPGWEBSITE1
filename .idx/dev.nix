# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.nodemon
    pkgs.bun
    pkgs.docker
    pkgs.docker-compose
    pkgs.curl  # For Encore CLI installation
  ];

  # Sets environment variables in the workspace
  env = {
    NODE_ENV = "development";
    ENCORE_RUNTIME_ENV = "local";
  };
  
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "vscodevim.vim"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # Frontend (Vite + React)
        frontend = {
          # Run the Vite development server
          command = ["bash" "-lc" "npm run dev -- --port $PORT --host 0.0.0.0"];
          manager = "web";
          cwd = "frontend";
          env = {
            # Environment variables for Vite
            PORT = "$PORT";
            VITE_API_URL = "$VITE_API_URL";
          };
        };
        
        # Backend (Encore.ts)
        backend = {
          # Run the Encore development server
          command = ["bash" "-lc" "encore run --port $PORT"];
          manager = "web";
          cwd = "backend";
          env = {
            # Environment variables for Encore
            PORT = "$PORT";
            ENCORE_RUNTIME_ENV = "local";
          };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Install Encore CLI
        install-encore = ''
          curl -fsSL https://encore.dev/install.sh | bash
          export PATH="$HOME/.local/bin:$PATH"
          encore version
        '';
        # Install dependencies for both frontend and backend
        frontend-install = "cd frontend && npm install";
        backend-install = "cd backend && bun install";
      };
      
      # Runs when the workspace is started
      onStart = {
        # Start both services in background
        start-frontend = "cd frontend && npm run dev";
        start-backend = "cd backend && encore run";
      };
    };
  };
}
