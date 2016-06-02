# :zap:Magic Mirror:zap:

##Overview

We took the magic mirror concept a step further by enabling user recognition :smiley:. The mirror can recognize registered users and personalize the experience accordingly.

The Magic Mirror is a fun weekend IoT project that showcases the power of [Universal Windows Platform (UWP) hosted web apps](https://microsoftedge.github.io/WebAppsDocs/en-US/win10/HWA.htm). Please check out the instructions below to see how you can build it yourself :rocket:.

The client side was coded against standard web technologies (CSS, HTML, JS) :heart:, and the back-end leverages the power of NodeJS and Mongo hosted on Azure. The client side implements Windows API ([mediaCapture](https://msdn.microsoft.com/en-us/library/windows/apps/windows.media.capture.aspx)) to detect faces from the devices camera, and the [Microsoft's Cognitive Services Face API](https://www.projectoxford.ai/face) to match Faces to profiles.

Since a mirror device doesn't generally receive input from a keyboard and mouse, our web app provides a view that allows users to personalize the experience.

##Assembly Process

Please see the [assembly process section](.github/ASSEMBLY.md).

##Installing the app

Once the mirror is assembled and wired up, you can install the Magic Mirror app on your Raspberry Pi (RP). Don't worry if you don't have a PC, you can also do it with a Mac.

###Deploying on a PC

Prerequisites:

* Visual Studio (2013+)
* Windows 10 SDK installed in Visual Stuido

Steps:

1. In Visual Studio, click File > New Project > JavaScript Templates > Windows > Hosted Web Apps
2. Go to Solution explorer, click on package.appxmanifest > Application and set http://webreflections.azurewebsites.net/mirror as the start page
3. Within the package.appxmanifest view, click the Content URIs tab and insert http://webreflections.azurewebsites.net/ with WinRT Access *All*
4. Click the Capabilities tab and select *Webcam* :camera:
5. On the ribbon, Change the taget architecture from *Any CPU* to *ARM*
6. Click play (it should say *Remote Machine*)
7. A prompt should appear asking you for the *Machine Name*. Set the IPv4 of your RP as the *Machine Name* and select *Universal* for the *Require Authentication*
8. and voilà! :gift: You have succesfully installed the Magic Mirror hosted web app in your RP running Windows IoT core.

If you want a tutorial with pretty pictures, you can find it [here](https://microsoftedge.github.io/WebAppsDocs/en-US/win10/DeployToPiWithVS.htm).

###Deploying on a Mac

Coming soon...

## Contributing

For guidelines on contributing to this project, please refer to the [contributing section](.github/CONTRIBUTING.md).

##Run Locally

Please see the [run locally section](.github/RUNLOCALLY.md).

## Credits

The [weather icons](https://thenounproject.com/Yorlmar%20Campos/collection/good-weather/) were created by [Yorlmar Campos](http://www.rnsfonts.com/) under a [Creative Commons Attribution 3.0 license](http://creativecommons.org/licenses/by/3.0/us/).