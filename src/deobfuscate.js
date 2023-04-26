import { Deobfuscator } from './index.js';

if ((scriptArgs.length !== 2 && scriptArgs.length !== 4) || (scriptArgs.length === 4 && scriptArgs[2] !== '-o')) {
    console.log('Usage: qjs --stack-size 10000000 --std -m deobfuscaste.js <input file> [-o <output file>]');
    std.exit(1);
}

let input_file = scriptArgs[1];
let ext = input_file.split('.').pop();
let input_file_name = input_file.substring(0, input_file.lastIndexOf('.'));
let output_file = scriptArgs[3] || `${input_file_name}.cleaned.${ext}`;

let opts = {
    rename: false,
    ecmaVersion: 'latest',
    output: scriptArgs[3] || output_file,
    loose: false,
    sourceType: 'script'
};

var source = std.loadFile(scriptArgs[1]);
source = new Deobfuscator().deobfuscateSource(source, opts).then((result) => {
    let f = std.open(opts.output, 'w');
    f.puts(result);
    f.close();
});
