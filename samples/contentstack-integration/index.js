import secrets from './secrets';

// namespace everything in a function!
function main() {
  // keeping the old jQuery convention of $variable = DOM node
  const $output = document.querySelector('#output');

  $output.innerHTML = JSON.stringify(secrets,null,2);
}

main();