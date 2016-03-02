#Magic Mirror

##Run Locally

###Prerequisites

- [Node](https://nodejs.org/en/)

###Setting up a local server

To run the project locally, clone the project and navigate to the root folder through the command prompt. Once there, run the following commands: 
```
npm i
node server.js 
```
This will install/update all the node packages and create a local node server. Take note of the port that the server is using. Go to your browser and type: `http://localhost:your-port-number/` to verify is working.

On the prompt, you will see that the there is a warning regarding connecting to the database. To solve this, you need to add local environment variables to your project. More specifically, you need to run these two commands on the command prompt:
- `set CUSTOMCONNSTR_MONGOLAB_URI=[Your connection string]`
- `set OXFORD_SECRET_KEY=[Your API key]`

For MSFT folks, you can find the demo API keys here: \\\\iefs\Users\apavia\WebApps\magicMirror\environment.json

###Making a UWP hosted web app

Once you have set your local environment variables, you'll need to create UWP hosted web app that points to the local server. 

We won't go over the steps on how to create the hosted web app here because [this tutorial](http://microsoftedge.github.io/WebAppsDocs/en-US/win10/CreateHWA.htm) already does a great job going over it. While following the tutorial, use `http://localhost:your-port-number/` as the hosted web app's starting URL. 

You will also need to declare camera capabilities on the **appxmanifest**. If you are using Visual Studio, you can double-click `package.appxmanifest` on the solution explorer, go to `Declartions` tab, and select **Webcam**.

If you are not using Visual Studio, you can open the `package.appxmanifest` and add the snippet below within the `<Package>` tags:
```
<Capabilities>
  <DeviceCapability Name="webcam" />
</Capabilities>
```

 
 
