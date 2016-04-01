#Magic Mirror

##Overview

We took the magic mirror concept a step further by enabling user recognition. The smart mirror can recognize registered users and personalize the experience accordingly.

The Magic Mirror is a fun weekend IoT project that showcases the power of [Universal Windows Platform (UWP) hosted web apps](https://microsoftedge.github.io/WebAppsDocs/en-US/win10/HWA.htm). The client side was coded with standard web technologies (CSS, HTML, JS), and the back-end leverages the power of NodeJS and Mongo hosted by Azure.

The client side implements Windows API ([mediaCapture](https://msdn.microsoft.com/en-us/library/windows/apps/windows.media.capture.aspx)) to detect faces from the devices camera, and the [Microsoft's Cognitive Services Face API](https://www.projectoxford.ai/face) service to match Faces to profiles.

Since a mirror device doesn't generally receive input from a keyboard and mouse, our web app provides a view that allows users to personalize the experience. 


##Building Materials

You will need the following materials to assemble the Magic Mirror:

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
3. Within the package.appxmanifest view, click the Content URIs tab and insert http://webreflections.azurewebsites.net/ with WinRT Access *All*
4. Click the Capabilities tab and select *Webcam*
5. On the ribbon, Change the taget architecture from *Any CPU* to *ARM*
6. Click play (it should say *Remote Machine*)
7. A prompt should appear asking you for the *Machine Name*. Set the IPv4 of your RP as the *Machine Name* and select *Universal* for the *Require Authentication*
8. and voilà... You have succesfully installed the Magic Mirror hosted web app in your RP running Windows IoT core.

If you want a tutorial with pretty pictures, you can find it [here](https://microsoftedge.github.io/WebAppsDocs/en-US/win10/DeployToPiWithVS.htm).

###Deploying with a Mac

Coming soon...

## Contributing

For guidelines on contributing to this project, please refer to [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).

##Run Locally

To run the project locally, please see [.github/RUNLOCALLY.md](.github/RUNLOCALLY.md).


