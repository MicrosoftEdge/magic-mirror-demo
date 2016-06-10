#Assembly Process

The assembly process requires manual work so please make sure you take the appropriate safety measures.

##Building Materials

You will need the following materials to assemble the Magic Mirror:

* [2-Way Mirrored Acrylic Sheets](http://www.tapplastics.com/product/plastics/cut_to_size_plastic/two_way_mirrored_acrylic/558)
  * Thickness: 1/8"
  * Width: 13”
  * Length: 23 5/8”
* [Medicine Cabinet](http://www.homedepot.com/p/Glacier-Bay-15-1-4-in-x-26-in-Surface-Mount-Framed-Mirrored-Swing-Door-Medicine-Cabinet-in-White-S1627-12-B/100576352)
* [23.6" Screen LED-lit Monitor](http://www.amazon.com/Samsung-SD300-S24D300HL-Certified-Refurbished/dp/B015X024AA/ref=sr_1_25?ie=UTF8&qid=1454975315&sr=8-25&keywords=24+inch+samsung+monitor)
* [LifeCam HD-3000](https://www.microsoft.com/accessories/en-us/products/webcams/lifecam-hd-3000/t3h-00011)
* Raspberry Pi 2 or 3
* Micro SD card
* Micro USB cord and USB power adapter
* HDMI cord
* Gorilla glue
* Black tape
* Scissors
* Multibit screwdriver
* Cutting pliers
* Power drill

##Step 1: Cabinet + 2-way mirror

The frame of the medical cabinet is held together by staples. You can use the screwdriver to take them off. Please be careful not to shater the mirror. Once the staples are gone, you can remove the one-way mirror and replace it with the two-way mirror. Glue each corner together as seen on the picture below.

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/frame.jpg)

##Step 2: Drilling

Drill a hole on top of the cabinet. Make sure the hole is big enough for the Camera's USB end to go through.  

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/drill_magic_mirror.JPG)

At the bottom of the back of the cabinet, drill another hole so you can pass the power cables through.

##Step 3: Making the monitor lean

Remove the outer casing of the monitor without damaging the touch sensor as seen on the picture below. You can use the pliers to cut the sensor panel off the outer casing. You will need this sensor to control the power settings of the monitor. It should look like the image below.

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/naked_monitor.JPG)

The edge of the monitor is grey so cover it with the black tape.

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/tape_monitor.jpg)

##Step 4: Supporting the monitor

The monitor legs place the mirror as close to the mirror as possible. You can find the 3D model of the legs [here](https://s3-us-west-2.amazonaws.com/magicmirrordemo/UniversalClip.stl). 

You can 3d print the legs on [3D Hubs](https://www.3dhubs.com/), or, if you have a 3D printer, you can print them yourself. If you don't want to print the legs, you can use toilet paper rolls as a replacement. Cut the rolls so they are 3 inches tall. This is a great time to use your Kindergarten skills.

The cabinet has holes along the sides. Use the screws to secure the monitor legs to the cabinets using those holes. 

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/leg_screw.png)

Below is an image showing how the monitor should rest on the legs.

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/monitor_in_place.jpg)

##Step 5: Adding the brain

Power the Pi with the USB cord (1) and connect the Pi to the monitor through HDMI (2).

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/rpi2-inst.png)


##Step 6: Connecting the camera

Tape the camera to the top of the cabinet and connect it to the Pi through USB.

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/tape_camera.jpg)

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/finishedMirror.JPG)

##Step 7: Enjoy

![alt tag](https://s3-us-west-2.amazonaws.com/magicmirrordemo/kevinMirror.png)

We hope you enjoy the Magic Mirror! Please let us know if you have any issues.















