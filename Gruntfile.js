module.exports = function(grunt) {

  grunt.initConfig({
    
    connect:{
      server:{
        options: {
          port: 80,
          keepalive: true,
          open:{
            target: 'http://localhost:<%= connect.server.options.port %>', // target url to open
            callback: function() {console.log("Application is running in browser")} // called when the app has opened
          }
        },
      }
    },

  });

 
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', ['connect']);
 
};