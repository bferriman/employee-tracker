# employee-tracker

## Description

A Node application that allows the user to view and modify company info, including departments, roles, and employees.

## Usage

App is launched with 'node index.js' after running 'npm install'.  Interaction is through simple command line prompts.

## Opportunities for further Development

There are a lot of update and delete functions that I have not yet had time to implement.  There is also more that I could do to enforce rules regarding managers, for example add a boolean is_management collumn to the roles table, which would allow me to only display appropriate options when adding/modifying an employees manager.

## Credits

This app uses the Inquirer npm package for command line interface and the mysql npm package for database interfacing.

## License

Copyright (c) Benjamin Ferriman. All rights reserved.

Licensed under the [MIT](https://github.com/bferriman/portfolio/blob/master/LICENSE.txt) license.