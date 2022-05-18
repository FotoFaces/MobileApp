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
npm start

## Needed
sudo npm install expo-cli --global
sudo npm install expo-image-picker
sudo npm install form-data-encoder
sudo npm install formdata-node
sudo npm install react-native-md5 --save
sudo npm install @react-native-async-storage/async-storage
sudo npm install local-storage --save
sudo npm install camera
sudo npm install lottie-react-native
sudo expo install expo-camera
sudo expo install expo-face-detector
sudo npm install eas-cli

## Build local apk
eas build --profile production --platform android --local