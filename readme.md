[![CircleCI](https://circleci.com/gh/mike-lischke/a4tstool/tree/master.svg?style=svg)](https://circleci.com/gh/mike-lischke/a4tstool/tree/master)

# **a4tstool**

This project is a Typescript port of the ANTLR4 tool, which is written in Java. The port is a self contained tool, which does not need anything beside Node.js. It will therefore run on all devices that support Node.js, without the need to install Java.

The code currently does not fully compile (though the tests do). The code in the runtime folder was generated using the [java2ts tool](https://github.com/mike-lischke/java2typescript). Some of the files have already been cleaned up and, besides improving the java2ts converter, this will be the main task here, in the near future.

It is planned to publish the new TS runtime in the ANTLR4 main project as well as an own Node.js module. It will work with the latest ANTLR4 version (in opposition to the antlr4ts project).
