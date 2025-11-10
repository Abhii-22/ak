module.exports = {
  webpack: function(config, env) {
    // Disable service worker generation
    config.plugins = config.plugins.filter(plugin => 
      plugin.constructor.name !== 'GenerateSW' && 
      plugin.constructor.name !== 'InjectManifest'
    );
    
    return config;
  },
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      
      // Disable service worker in dev server
      config.historyApiFallback = true;
      
      return config;
    };
  }
};
