# [<img src="https://www.raspberrypi.org/app/uploads/2018/03/RPi-Logo-Reg-SCREEN.png" width="64"/>](image.png) Raspberry Pi Network Scanner
Assists in detecting Raspberry Pi 3 & 4 units by MAC address. 

_Note: I've only tested this on Linux (deb) and MacOS (Mohave - M1)_  
_Let me know if you plan to use this on Windows, I would be happy to help!_  

### Testing MinSpec:  
NodeJS LTS: v14.17.6  
Tested on:   
    Big Sur OS 11  
    M1 (Apple Silicone)  
    8GB 

## Install and Use  

#### Clone the Project
```bash
$ git clone https://github.com/ttgsgmafe/NetworkScanner.git 
$ cd NetworkScanner  
```   
#### Install Node Packages 
```bash
$ npm i 
```
#### Run 
```bash
$ node index.js 
```


There are 3 options:  
1. __Only Locate RPis and Quit:__ _Returns a table of all detected RPis on the network. Detects > RPi3, and RPi4._  
2. __Locate RPis and port scan:__ _Returns devices from (1.) above and scans for common and currenly used ports_   
3. __Scan all network devices:__ _Scans all devices on the current network and returns used ports_  

## Port List  
The port listing is located in "ports.json" and contains common ports... mostly I'm looking for HTTP(s), Node, DB, and SSH- but the list can be extended if needed.  

