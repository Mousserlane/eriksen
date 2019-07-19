const chalk = require('chalk');
const os = require('os');
const { spawn } = require('child_process');
const readline = require('readline').createInterface(
  process.stdin,
  process.stdout
);

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
  // TODO push tag feature
}

function getCommitMessage(promptMessage) {
  return new Promise(resolve => {
    readline.question(promptMessage, cm => {
      readline.close();
      resolve(cm);
    });
  });
}

async function eriksenCLI(args) {
  const parsedArgs = parseArguments(args);
  const releaseType = parsedArgs[0];
  const versionString = parsedArgs[1];

  let commitMessage = '';
  let concatedString = '';

  const cm = await getCommitMessage('Enter commit message: \n');
  commitMessage = cm;

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
    concatedString,
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
