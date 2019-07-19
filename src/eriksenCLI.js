const chalk = require('chalk');
const os = require('os');
const { spawn } = require('child_process');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function parseArguments(rawArgs) {
  let parsedArgs = {};
  const slicedArgs = rawArgs.slice(2);

  slicedArgs.forEach(args => {
    Object.assign(parsedArgs, {
      ...parsedArgs,
      [args]: true
    });
  });
  console.log(parsedArgs);
  return Object.keys(parsedArgs);
}

function pushTag() {
  // do something
}
function eriksenCLI(args) {
  const parsedArgs = parseArguments(args);
  const releaseType = parsedArgs[0];
  const versionString = parsedArgs[1];

  let commitMessage = '';
  let concatedString = '';

  readline.setPrompt('Enter commit message:');
  readline.prompt();

  readline.on('line', cm => {
    commitMessage = cm;
    readline.close();
  });

  switch (releaseType) {
    case '--beta' || '-b':
      concatedString = `${versionString}_beta`;
      break;
    case '--stable' || '-s':
      concatedString = `${versionString}_stable`;
      break;
    case '--production' || '-p':
      concatedString = `${versionString}_production`;
      break;
    default:
      console.log('argument not found');
      break;
  }

  const gitProcess = spawn('git', [
    'tag',
    '-a',
    versionString,
    '-m',
    commitMessage
  ]);

  gitProcess.stdout.on('data', data => {
    console.log(chalk.blue(`creating tag: ${data}`));
  });

  gitProcess.stderr.on('data', data => {
    console.log(chalk.red(`Error while creating your tag: ${data}`));
    gitProcess.kill('SIGKILL');
  });

  gitProcess.on('close', code => {
    console.log(chalk.white(`process exited with code: ${code}`));
  });
  //   console.log(chalk.white('arguments', parsedArgs));
}

module.exports.eriksenCLI = eriksenCLI;
