#Magic Mirror

##Overview

The Magic Mirror is a great weekend IoT project. It leverages a Windows 10 Universal Windows Platform (UWP) hosted web application powered by Azure website services. Since a mirror device doesn't generally receive input from a keyboard and mouse, our website will provide a screen that will run great on a laptop or phone device to setup a users profile. The login experience will be driven by the [Project Oxford APIs](https://www.projectoxford.ai/). We will be using a client side Windows API ([mediaCapture](https://msdn.microsoft.com/en-us/library/windows/apps/windows.media.capture.aspx)) to detect faces from the devices camera, and the [Oxford Face API](https://www.projectoxford.ai/face) service to do the actually match Faces to profiles.

##Building Materials

You will need the following materials to build the Magic Mirror:

* [2-Way Mirrored Acrylic Sheets](http://www.tapplastics.com/product/plastics/cut_to_size_plastic/two_way_mirrored_acrylic/558)
* [Medicine Cabinet](http://www.homedepot.com/p/Glacier-Bay-15-1-4-in-x-26-in-Surface-Mount-Framed-Mirrored-Swing-Door-Medicine-Cabinet-in-White-S1627-12-B/100576352)
* [23.6" Screen LED-lit Monitor](http://www.amazon.com/Samsung-SD300-S24D300HL-Certified-Refurbished/dp/B015X024AA/ref=sr_1_25?ie=UTF8&qid=1454975315&sr=8-25&keywords=24+inch+samsung+monitor)
* [LifeCam HD-3000](https://www.microsoft.com/accessories/en-us/products/webcams/lifecam-hd-3000/t3h-00011)
* Raspberry Pi 2 or 3
* Micro SD card
* Micro USB cord and USB power adapter
* HDMI cord

##Assembly Process

Coming soon...

##Installing the app 

Once the mirror is assembled and wired up, you can install the Magic Mirror app on your Raspberry Pi (RP). Don't worry if you don't have a PC, you can also do it with a Mac.

###Deploying with a PC

Prerequisites:

* Visual Studio (2013+)
* Windows 10 SDK installed in Visual Stuido

Steps:

1. In Visual Studio, click File > New Project > JavaScript Templates > Windows > Hosted Web Apps
2. Go to Solution explorer, click on package.appxmanifest > Application and set http://webreflections.azurewebsites.net/mirror as the start page
3. Within the package.appxmanifest view, click the Content URIs tab and insert http://webreflections.azurewebsites.net/ with ALL WinRT Access
4. Click the Capabilities tab and select Webcam
5. Change the taget architecture to ARM
6. Click play (it should say *Remote Machine*)
7. A prompt should appear asking you for the *Machine Name*. Set IPv4 of your RP as the *Machine Name* and select *Universal* for the *Require Authentication*
8. and voilà... You have succesfully installed the Magic Mirror hosted web app in your RP running Windows IoT core.

If you want a tutorial with pretty pictures, you can find it [here](https://microsoftedge.github.io/WebAppsDocs/en-US/win10/DeployToPiWithVS.htm).

###Deploying with a Mac

Coming soon...

## Contributing

For guidelines on contributing to this project, please refer to [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).

##Run Locally

###Prerequisites

Begin with installing [Node](https://nodejs.org/en/).

###Setting up a local server

To run the project locally, clone the project and navigate to the root folder through the command prompt. Once there, run the following commands:
```
npm i
node server.js
```
This will install/update all the node packages and create a local node server. Take note of the port that the server is using. Go to your browser and type: `http://localhost:your-port-number/` to verify it is working.

On the prompt, you will see that the there is a warning regarding connecting to the database. To solve this, you need to add local environment variables to your project.

You will have to make your own environment.json file. Instructions for doing this will be provided soon.

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

If you are developeing on Windows, we have provided a dummy UWP app that you can run locally. It is located in **\Magic Mirror UWP App** folder.

###Setting up Node IDE in Visual Studio 2015 for backend debugging

There is a great VS plugin that can enable you to debug your node project.

Here are the steps to set it up.

1. If you don't have VS 2015 installed already. You can do so by getting it from [here](https://www.visualstudio.com/downloads/download-visual-studio-vs)
2. Install VS plugin by gettting it from [here] (https://www.visualstudio.com/en-us/features/node-js-vs.aspx)
3. Start Visual Studio and choose to 'Create New Project'
4. In the 'New Project' dialog window go to Templates -> JavaScript -> Node.js
5. Choose 'From Existing Node.js' Code as project type
6. Select location of your existing Node project
7. Done


###Tips for Newcomers Using Node.js###
We are using the following technologies to build our view:

* [Express](http://expressjs.com/)
* [Handlebars.js](http://handlebarsjs.com/)




