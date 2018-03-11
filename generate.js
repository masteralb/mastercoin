const fs = require('fs');
const astring = require('astring')
const acorn = require('acorn')

const cryptoFolder = process.env.CRYPTO_FOLDER || './app/images/crypto';

let code = [
    'export default function getCoinImage(coin) {',
    'const coin_image = coin + \'.png\'',
    'switch (coin_image) {',
];

const files = fs.readdirSync(cryptoFolder);


files.forEach(file => {
    code.push(`case '${file}':`)
    code.push(`return require('./${file}')`)
});

code.push('default:')
code.push(`return require('./default.png')`)
code.push('}')
code.push('}')

code = code.join('\n') + '\n'

const ast = acorn.parse(code, { 
    ecmaVersion: 6, 
    sourceType: 'module' 
})

const stream = astring.generate(ast, {
  output: process.stdout,
})