const chalk = require('chalk');
const os = require('os');
const { exec } = require('child_process');
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
  return Object.keys(parsedArgs);
}

// function pushTag(version) {
//   return new Promise((resolve, reject) => {
//     const push = spawn('git', ['push', 'origin', version]);
//     console.log('Pushing tag to origin...');
//     push.stdout.on('data', data => {
//       console.log(chalk.blue('Tag successfully passed'));
//       resolve(200);
//     });
//     push.stderr.on('data', err => {
//       reject(err);
//     });
//     push.on('close', code => {
//       console.log(chalk.white(`tag pushed`));
//     });
//   });
// }

function usage() {
  console.log(chalk.white(`
    eriksen is a git tag assistant that automatically create an annotated git tag for your releases.
    
    usage:
      eriksen ${chalk.green("<release-flag>")}


    release flags can be:


    --beta:           used to create a tag with ${chalk.green("_beta")} suffix
    --stable:         used to create a tag with ${chalk.green("_stable")} suffix
    --production:     used to create a tag with ${chalk.green("_production")} suffix
    --help:           used to print the guide
  `))
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
    case 'help':
      return usage();
      // break;
    default:
      console.log(chalk.red('argument not found!'));
      return usage();
      // break;
  }
  
  const cm = await getCommitMessage('Enter commit message: \n');
  commitMessage = cm;

  //   const gitProcess = spawn('git', [
  //     'tag',
  //     '-a',
  //     concatedString,
  //     '-m',
  //     commitMessage
  //   ]);

  const gitProcess = exec(
    `git tag -a ${concatedString} -m '${commitMessage}' &&
  git push origin ${concatedString}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red(`An error occured: ${error}`));
      } else {
        console.log(
          chalk.blue(
            `Process completed, tag ${concatedString} has been successfully created and pushed`
          )
        );
      }
    }
  );

  // gitProcess.stdout.on('data', data => {
  //   console.log(chalk.blue(`creating tag: ${data}`));
  // });

  // gitProcess.stderr.on('data', err => {
  //   console.log(chalk.red(`Error while creating your tag: ${err}`));
  //   gitProcess.kill('SIGKILL');
  // });

  // gitProcess.on('close', code => {
  //   console.log(chalk.white(`process exited with code: ${code}`));
  // });
  //   console.log(chalk.white('arguments', parsedArgs));
}

module.exports.eriksenCLI = eriksenCLI;
