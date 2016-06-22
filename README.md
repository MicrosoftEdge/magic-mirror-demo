# :zap:Magic Mirror:zap:

##Overview

We took the magic mirror concept a step further by enabling user recognition :smiley:. The mirror can recognize registered users and personalize the experience accordingly.

The Magic Mirror is a fun weekend IoT project that showcases the power of [Universal Windows Platform (UWP) hosted web apps](https://microsoftedge.github.io/WebAppsDocs/en-US/win10/HWA.htm). Please check out the instructions below to see how you can build it yourself :rocket:.

The client side was coded against standard web technologies (CSS, HTML, JS) :heart:, and the back-end leverages the power of NodeJS and Mongo hosted on Azure. The client side implements Windows API ([mediaCapture](https://msdn.microsoft.com/en-us/library/windows/apps/windows.media.capture.aspx)) to detect faces from the devices camera, and the [Microsoft's Cognitive Services Face API](https://www.projectoxford.ai/face) to match Faces to profiles.

##User Flow

Before using the magic mirror, users need to create a profile using the desktop app. You need a profile so the mirror can recognize you and adapt to your needs.

##Assembly Process

Please see the [assembly process section](.github/ASSEMBLY.md).

##Installing the apps

You have to deploy two Hosted Web apps (HWA). The first HWA allows you to create your profile and is meant to run on your desktop. The second HWA powers the Magic Mirror UI that runs on the Raspberry Pi 2/3.

###Deploying on a PC

Prerequisites:

* Visual Studio (2013+)
* Windows 10 SDK installed in Visual Stuido

Steps to deploy the Profile Creator app to your desktop:

1. In Visual Studio, go to Solution explorer, click on package.appxmanifest > Application and set http://webreflections.azurewebsites.net/create as the start page
2. On the ribbon, change the target architecture to match that of your PC (e.g. x64)
3. Set the debugging target to "Local machine" (changing the architecture in step 2 probably did this for you)
4. Click play to start the app running on your local machine
5. Follow the prompts on the create experience to save a profile for yourself

Steps to deploy the Magic Mirror app to the Raspberry Pi 2:

1. In Visual Studio, click File > New Project > JavaScript Templates > Windows > Hosted Web apps
2. Go to Solution explorer, click on package.appxmanifest > Application and set http://webreflections.azurewebsites.net/mirror as the start page
3. Within the package.appxmanifest view, click the Content URIs tab and insert http://webreflections.azurewebsites.net/ with WinRT Access *All*
4. Click the Capabilities tab and select *Webcam* :camera:
5. On the ribbon, Change the taget architecture from *Any CPU* to *ARM*
6. Click play (it should say *Remote Machine*)
7. A prompt should appear asking you for the *Machine Name*. Set the IPv4 of your RP as the *Machine Name* and select *Universal* for the *Require Authentication*
8. and voilà! :gift: You have succesfully installed the Magic Mirror hosted web app in your RP running Windows IoT core.

You can find a tutorial of how to deploy HWA using Visual Studio [here](https://microsoftedge.github.io/WebAppsDocs/en-US/win10/DeployToPiWithVS.htm).

###Deploying on a Mac

Coming soon...

## Contributing

For guidelines on contributing to this project, please refer to the [contributing section](.github/CONTRIBUTING.md).

##Run Locally

Please see the [run locally section](.github/RUNLOCALLY.md).

## Credits

The [weather icons](https://thenounproject.com/Yorlmar%20Campos/collection/good-weather/) were created by [Yorlmar Campos](http://www.rnsfonts.com/) under a [Creative Commons Attribution 3.0 license](http://creativecommons.org/licenses/by/3.0/us/).

##Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
