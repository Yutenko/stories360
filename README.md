# stories360

Online Service for creating your own Virtual Reality Worlds just by uploading plain 2D and / or 360° images, wrapping it up with some background music for atmosphere

## Getting Started

The original service is running on a debian 8 system

### Prerequisites

You need to install

* MySQL 5.6
* NodeJS 6.0 or higher
* wkhtmltox 12.x (creating PDFs from HTML on the fly)
* a mail account for sending emails (no server SMTP, just gmail for instance)

optional
* NGINX as webserver (Apache2 will also just do fine)


### SETUP Database and NodeJS-Modules

MySQL 
on the CLI - run the following command where username is your OWN username to MySQL, -p will ask you for the password for this user,
or just import from a Graphical Interface like phymyadmin

```
> cd stories360
> mysql -u username -p webvr < sqldump/webvr.sql
```

Install the needed NodeJS Modules from the stories360-root directory, this will install all modules from the package.json-File

```
> cd stories360
> sudo npm install
```

## Configuring NGINX (optional)

If you're using NGINX, you have to reverse proxy the NodeJS and map it to an internal port (preconfigured 3020), so that your webserver can still listen to 80 and NodeJS can use an internal port. Also you need to make sure to upgrade the http-Header, so that your Clients can upgrade from XHR-Longpolling to Websockets via ws://

```
upstream stories360 {
 server localhost:3020;
}
 
server {
 listen 80;
 server_name YOURURL www.YOURURL;
 
 location / {
  alias /path/to/stories360;
  try_files $uri @stories360;
 }
 
 location /client {
  alias /path/to/stories360/client;
  try_files $uri @stories360;
 }
 
 location @stories360 {
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $proxy_host;
  proxy_set_header X-NginX-Proxy true;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
 
  proxy_redirect off;
  
  proxy_pass http://stories360;
 }
}
```

## Apply Sourcecode changes

Stories360 is written in ES6 and ES7 Syntax on the client side which babel will polyfill and transpile to ES5 and lower. You can configure webpack by editing webpack.config.js 

```
> cd stories360
> webpack
```

### Software-Architecture in Short

* Stories360 is written with React for the View
* material-ui for the precompiled css-Styles
* NodeJS and Socket.io for realtime communication between the editor and the VR-Scene
* every new VR Scene creates a three new ids (one for the editor, one for public sharing, one for private sharing)
* Uploads go into /client/uploads/CUSTOMID
* server creates multiple files from uploads (thumbnails for faster preview, you see from the source)

### State-Management

* Stories360 uses Reacts unidirectional dataflow through components for simple state changes
* for more advanced UI / Model Changes, Mob-X is used with observer pattern and ESNext Decorators which observes the
  functional state of a React Component Lifecycle
  
```
  @observable for changing data-structures
  @computed get is called by a property lookup on the observed data-structures
  @action @action.bound for changing state from external files (bound just binds the this-reference to the mob-x Observer)
  @Observer is used to decorate a Class as having data-strutures that contain observable data-structures
```

### Translation

Translation file is in /client/lang/de.json for the german language, if you want to translate it, create an en.json for instance and change the content, the menu for changing the languages can be implemented by yourself or you just change de.json with en.json and change the path in the /client/lang/translation.js

```
import DE from '../lang/YOURLANGUAGEFILENAME.json'

var T = {
 'DE':DE,
 'EN':EN
}

export function translate (path) {
 return T['EN'][path]
}
```



## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


