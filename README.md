#Magic Mirror

##Run Locally

###Setting up a local server

To run the project locally, clone the project and navigate to the root folder through the command prompt. Once there, run the following command: 
```
node server.js. 
```
This will create a local node server. Take note of the port that the server is using. Go to your browser and type: `http://localhost:your-port-number/` to verify is working.

On the prompt, you will see that the there is a warning regarding connecting to the database. To solve this, you need to add local environment variables to your project. More specifically, you need to set:
- **CUSTOMCONNSTR_MONGOLAB_URI**: your connection string to your MongoDB service (e.g. MongoLab)
- **OXFORD_SECRET_KEY**: your secret API key to the [Oxford service](https://www.projectoxford.ai/)

You can find the demo API keys here: //iefs/Users/apavia/WebApps/magicMirror/environment.txt

###Making a UWP hosted web app

Once you have set your local environment variables, let's create a UWP hosted web app that points to your local server. This will allow the app to access the camera. 

We won't go over the steps on how to create the hosted web app here because  [this tutorial](http://microsoftedge.github.io/WebAppsDocs/en-US/win10/CreateHWA.htm) already does a great job going over it. You need to change your hosted web app's starting URL to `http://localhost:your-port-number/` so it points to your local server. Since our app will be using the camera, you need to declare this too.
