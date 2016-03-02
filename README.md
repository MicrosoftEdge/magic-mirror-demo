#Magic Mirror

##Overview
The magic mirror project is a great IoT & maker project to get started in making a Windows 10 UWP web application. This web application will be powered by an Azure website that talks directly to different Windows 10 clients. Since a mirror device doesn't generally recieve input from a keyboard and mouse, our website will provide a screen that will run great on a laptop or phone device to setup a users profile. The login experience will be driven by the [Project Oxford APIs](https://www.projectoxford.ai/). We will be using a client side Windows API ([mediaCapture](https://msdn.microsoft.com/en-us/library/windows/apps/windows.media.capture.aspx)) to detect faces from the devices camera, and the [Oxford Face API](https://www.projectoxford.ai/face) service to do the actually match Faces to profiles.

##Run Locally

###Prerequisites

- [Node](https://nodejs.org/en/)

###Setting up a local server

To run the project locally, clone the project and navigate to the root folder through the command prompt. Once there, run the following commands: 
```
npm i
node server.js 
```
This will install/update all the node packages and create a local node server. Take note of the port that the server is using. Go to your browser and type: `http://localhost:your-port-number/` to verify it is working.

On the prompt, you will see that the there is a warning regarding connecting to the database. To solve this, you need to add local environment variables to your project. For MSFT folks, you can do this by saving the following file to the root folder: \\\\iefs\Users\apavia\WebApps\magicMirror\environment.json

###Making a UWP hosted web app

Once you have set your local environment variables, you'll need to create UWP hosted web app that points to the local server. 

We won't go over the steps on how to create the hosted web app here because [this tutorial](http://microsoftedge.github.io/WebAppsDocs/en-US/win10/CreateHWA.htm) already does a great job going over it. While following the tutorial, use `http://localhost:your-port-number/create` as the hosted web app's starting URL.

You will also need to declare camera capabilities on the **appxmanifest**. If you are using Visual Studio, you can double-click `package.appxmanifest` on the solution explorer, go to `Capabilities` tab, and select **Webcam**.

If you are not using Visual Studio, you can open the `package.appxmanifest` and add the snippet below within the `<Package>` tags:
```
<Capabilities>
  <DeviceCapability Name="webcam" />
</Capabilities>
```

 
 
