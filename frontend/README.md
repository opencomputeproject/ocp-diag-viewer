# OCP Diag Result Viewer Front End

The Front End is written with AngularJS and uses Angular CLI for building/linting/testing.<br/>
For all the commands below, make sure to be in the `frontend` directory before running them.

## Installing dependencies

1. Make sure `npm` is installed. Follow instructions at https://docs.npmjs.com/downloading-and-installing-node-js-and-npm if you don't have `npm` installed. On Linux systems, it is recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage node versions in the system.<br />
2. To ensure that you have successfully installed `npm`, run the command below<br />
`npm --version`<br/>
The result should be similar to below<br/>

> npm -v
9.4.0

3. After making sure `npm` is installed, run<br/>
`npm install`

## How to run the front end

1. In the `frontend` directory, run<br/>
`npm start`
2. The standalone front end will use test data in `ocp_diag_test_data.js`. Open the localhost link generated in the terminal (eg. `localhost:44737/`) to see the User Interface.


## How to run unit tests
1. For non-watch mode, run<br/> `npm run test`
2. For watch mode, run<br/> `npm run test-watch`

## How to run linting
1. `npm run lint`