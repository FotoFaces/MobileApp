# MobileApp
Mobile App for the FotoFaces Project

How to execute:
1º Install node:

sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

sudo apt -y install nodejs

2º Install expo-cli with npm:
npm install expo-cli --global

3º Change to the project location and run:
npm start

4º Open the metro bundler with the localhost link reffered in the terminal

5º Open app with web browser OR open with expo Go app in a smartphone and scan the qr code


## ArchLinux
pacman -Syu nodejs-lts-gallium
npm install expo-cli --global
npm start

## Needed
npm install expo-image-picker
npm install form-data-encoder
npm install formdata-node
npm install react-native-md5 --save

npm install @react-native-async-storage/async-storage
npm install local-storage --save
npm install camera
expo install expo-camera
expo install expo-face-detector
npm install react-native-md5 --save
