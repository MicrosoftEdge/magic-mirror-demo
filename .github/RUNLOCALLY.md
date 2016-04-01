#Run Locally

This will page will teach you how you can get the Magic Mirror app and server running locally.

##Prerequisites

Begin with installing [Node](https://nodejs.org/en/).

##Setting up a local server

To run the project locally, clone the project and navigate to the root folder through the command prompt. Once there, run the following commands:
```
npm i
node server.js
```
This will install/update all the node packages and create a local node server. Take note of the port that the server is using. Go to your browser and type: `http://localhost:your-port-number/` to verify it is working.

On the prompt, you will see that the there is a warning regarding connecting to the database. To solve this, you need to add local environment variables to your project. 

Create a *environment.json* file in the root folder and add the following snippet:

```
{
  "CUSTOMCONNSTR_MONGOLAB_URI": "your-mongo-connection-string",
  "OXFORD_SECRET_KEY": "your-face-api-secret-oxford-key",
  "OXFORD_EMOTION_SECRET_KEY":"your-emotion-api-secret-oxford-key",
  "BING_API_KEY": "your-bing-api-secret-oxford-key",
  "SESSION_SECRET_STRING": "your-secret-string", 
}
```

You can obtain your own secret keys respectively in the following links:
* [Cognitive Services Emotion and Face API keys](https://www.microsoft.com/cognitive-services/en-us/sign-up) 
* [Bing API key](https://msdn.microsoft.com/en-us/library/mt712546(v=bsynd.50).aspx) give us access to traffic info
* [mLab connection string](https://mlab.com/signup/) is necessary to communicate with the Mongo database. You could also use another MongoDB service.

##Making a UWP hosted web app

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

##Debugging 

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


##Tips for Newcomers Using Node.js###
We are using the following technologies to build our view:

* [Express](http://expressjs.com/)
* [Handlebars.js](http://handlebarsjs.com/)
