{
  inputs = {
    garnix-lib.url = "github:garnix-io/garnix-lib?ref=0573417fc462b0eeed5d762c8fe08093afb35a3d";
    NodeJS.url = "github:garnix-io/nodejs-module?ref=bbdd7b1fb494235937a910ae84dc8c53f7f57d24";
  };

  nixConfig = {
    extra-substituters = [ "https://cache.garnix.io" ];
    extra-trusted-public-keys = [ "cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g=" ];
  };

  outputs = inputs: inputs.garnix-lib.lib.mkModules {
    modules = [
      inputs.NodeJS.garnixModules.default
    ];

    config = { pkgs, ... }: {
      nodejs = {
        nodejs-project = {
          buildDependencies = [  ];
          devTools = [  ];
          prettier = false;
          runtimeDependencies = [  ];
          src = ./.;
          testCommand = "npm run test";
          webServer = null;
        };
      };

      garnix.deployBranch = "master";
    };
  };
}
