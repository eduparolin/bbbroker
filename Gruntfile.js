// module.exports = function (grunt) {
//     grunt.initConfig({
//         mocha_istanbul: {
//             coverage: {
//                 src: 'modules/**/', // a folder works nicely
//                 options: {
//                     mask: '*.spec.es6',
//                     includes: ['**/*.es6'],
//                     excludes: ['**/*.spec.es6']
//                 }
//             }
//         },
//         mochaTest: {
//             test: {
//                 src: ['**/*.spec.es6']
//             }
//         },
//         istanbul_check_coverage: {
//             default: {
//                 options: {
//                     coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
//                     check: {
//                         lines: 80,
//                         statements: 80
//                     }
//                 }
//             }
//         }
//
//     });
//
//     grunt.event.on('coverage', function (lcovFileContents, done) {
//         // Check below on the section "The coverage event"
//         done();
//     });
//
//     grunt.loadNpmTasks('grunt-mocha-istanbul');
//     grunt.loadNpmTasks('grunt-mocha-test');
//
//     grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
//     grunt.registerTask('test', ['mochaTest']);
// };