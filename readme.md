# **a4tstool**

This project is a Typescript port of the ANTLR4 tool, which is written in Java. It aims to be a self contained tool, which does not need anything beside Node.js. It will therefore run on all devices that support Node.js, without the need to install Java.

This is the initial check-in of the code which has been produced so far and does currently not fully compile. The code in the runtime folder was generated using the java2ts tool. Some of the files have already been cleaned up and, besides improving the java2ts converter, this will be the main task here, in the near future.

It is planned to publish the new TS runtime in the ANTLR4 main project as well as an own Node.js module. It will work with the latest ANTLR4 version (in opposition to the antlr4ts project).
