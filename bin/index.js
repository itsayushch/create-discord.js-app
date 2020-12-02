#!/usr/bin/env node
const program = require('commander');
const mkdirp = require('mkdirp');
const path = require('path');
const { copySync } = require('fs-extra');


class Handler {
	renamedOption(originalName, newName) {
		return val => val;
	}

	mkdir(base, dir) {
		const loc = path.join(base, dir);

		console.log(`   \x1b[36mcreate\x1b[0m : ${loc}${path.sep}`);
		mkdirp.sync(loc, parseInt('0755', 8));
	}

	createApp(base, lang) {
		const loc = path.join(base, '.');

		copySync(
			path.join(__dirname, '..', 'templates', lang),
			loc
		);

		const prompt = process.platform === 'win32' && process.env._ === undefined ? '>' : '$';

		if (base !== '.') {
			console.log();
			console.log('   \x1b[36mChange directory:\x1b[0m');
			console.log('     %s cd %s', prompt, base);
		}

		console.log();
		console.log('   \x1b[36mInstall dependencies:\x1b[0m');
		console.log('     \x1b[36m%s npm install', prompt);
		console.log();
		console.log('   \x1b[36mRun the bot:\x1b[0m');

		console.log('     %s npm start', prompt);


		console.log();
	}
}

const handler = new Handler();

program
	.name('express')
	.version(require('../package.json').version, '--version')
	.usage('[dir] [options] ')
	.option('-js, --js', 'add js support', handler.renamedOption('--js', '--lang=js'))
	.option('-ts', '--ts', 'add ts support', handler.renamedOption('--ts', '--lang=js'))
	.option('-l, --lang <lang>', 'add <lang> support (js|ts) (defaults to js)')
	.parse(process.argv);

const destinationPath = program.args.shift() || '.';

let lang = 'js-bot-plain';

if (program.lang) {
	switch (program.lang) {
		case 'js':
			lang = 'js-bot-plain';
			break;
		case 'ts':
			lang = 'ts-bot-plain';
			break;
		default:
			break;
	}
}

if (destinationPath !== '.') handler.mkdir(destinationPath, '.');
handler.createApp(destinationPath, lang);
