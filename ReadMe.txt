1. This application is developed using https server
For https:
Install openssl exe file
then run this 3 commands in the vs code terminal

openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem


During Configuration Select your country name (2 Letters) , you can skip the info. 

You are done with openssl set up

2. install necessary libraries/packages e.g npm install express
npm install https
npm install bodyParser etc others

3. then from the vs code terminal run: npm start and click on the localhostlink from the terminal

Thanks





