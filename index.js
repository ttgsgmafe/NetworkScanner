const prompt = require('prompt');
const cliSelect = require('cli-select');
const termCursor = require('terminal-cursor');
const chalk = require('chalk');
const Table = require('cli-table3');
const find = require('local-devices');
var portscanner = require('portscanner');

const ports = require('./ports.json');

// let cursor = new termCursor(1, 1);
// cursor.hide();

let rpiMACPrefix = "b8:27:eb";
let rpi4MACPrefix = "dc:a6:32";

console.log('\n---------------- RPI Network Scanner ----------------\n');
console.log(`${chalk.bold("Choose an option to get started:")}`);

cliSelect({
    values: ['Only Locate RPis and Quit', 'Locate RPis and port scan', 'Scan all network devices'],
    valueRenderer: (value, selected) => {
        if (selected) {
            return chalk.blue.underline(value);
        }
        return value;
    },
}).then(async (res) => {
	switch(res.id) {
		case 0:
			getNetworkRPi(true, (res) => {
				console.log('complete');
			});
			break;
		case 1:
			await getNetworkRPi(true, async (res) => {
				await portScanDevices(res);
			});
			break;
		case 2:
			await getNetworkRPi(false, async (res) => {
				await portScanDevices(res);
			});
			break;
	}
	console.log(chalk.bold('> Selected: ') + chalk.yellow(res.value));
});

async function getNetworkRPi(rpi, cb) {
	let spinner = await workingAnim();
	let units = [];

	find().then(async devices => {
		await devices.forEach(async device => {
			if(device.mac !== '' && device.mac !== '?') {
				if(rpi) {
					if(device.mac.includes(rpiMACPrefix)) {
						device['hardware'] = 'Raspberry Pi 3 or earlier';
						units.push(device);

					} else if(device.mac.includes(rpi4MACPrefix)) {
						device['hardware'] = 'Raspberry Pi 4';
						units.push(device);
					}
				} else {
					units.push(device);
				}
			}
		});

		clearInterval(spinner);
		console.log('\nScan Complete!\n');

		tableOutput(units);
		return cb(units);
	});
}

async function portScanDevices(devices) {

	let commonPorts = ports.map(x => { return x.port; });

	console.log('\nStarting port scan...\n');
	devices.forEach(async (device, idx) => {
		console.log(`Scanning Device ${idx} - ${device.ip}:\n`);
		portscanner.findAPortInUse(commonPorts, device.ip).then(port => {
			// get the port info
			let portInfo = ports.find(x => x.port == port);

			console.log(`Port ${port} is in use!\n${portInfo.use}: ${portInfo.des}`);
	  	});
	// 	await portscanner.findAPortNotInUse([80, 8080, 443, 8443, 22, 3000, 3010], device.ip).then(port => {
	// 		console.log(`Port ${port} is available!`);
	//   });
	});
}

// accepts an array of objects
function tableOutput(data) {
	// Format the output
	let cols = [],
	rows = [];

	Object.keys(data[0]).forEach(key => {
		cols.push(key);
	});

	data.forEach(obj => {
		let row = [];
		Object.keys(obj).forEach((elem, idx) => {
			row.push(obj[elem]);
		});
		rows.push(row);
	});

	let table = new Table({
		head: cols 
	});

	table.push(...rows);
	console.log(chalk.bold('Network Devices'));
	console.log(table.toString());
}

function workingAnim() {
	var P = ["\\", "|", "/", "-"];
	var x = 0;
	return setInterval(function() {
		process.stdout.write("\rScanning " + P[x++] + "  ");
		x &= 3;
	}, 250);
}
