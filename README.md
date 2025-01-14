# Nepali Date Chrome Extension

The [extension](https://developer.chrome.com/extensions) shows the current nepali date in the browser action.

![NepaliDatePromo](https://user-images.githubusercontent.com/4254571/104809613-a96dc400-5816-11eb-8d97-4604e8681830.jpg)

![NepaliDatePromo1](https://user-images.githubusercontent.com/4254571/123508243-dfe52000-d68d-11eb-826a-edd7e59770b2.jpg)

![NepaliDatePromo2](https://user-images.githubusercontent.com/4254571/104809617-aecb0e80-5816-11eb-8d5c-0d20f415e501.jpg)

![NepaliDatePromo3](https://user-images.githubusercontent.com/4254571/105712211-99a25e00-5f41-11eb-9e8e-2400473be768.jpg)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

```
* Node
```

### Installing

To get the extension built the following simple steps need to be followed

Please make sure that Node and Yarn are installed in your machine.

Clone this repository

```
git clone git@github.com:Acesmndr/nepali-date-chrome-extension.git
cd nepali-date-chrome-extension
```

then install the project dependencies
```
npm install
```

## Building the extension

To build the extension run the following command

```
npm run build:[development/chrome/firefox]
```

It builds the extension files in the folder for the environment you passed as well as builds the crx extension in the build folder.
`npm run build:development` doesn't build the crx file but watches over the files and rebuilds the extension files for each file change.  

### Loading the extension

There are two ways you can achieve this. Either you can load the unpacked extension or load the packed crx extension.

* ##### Loading unpacked Extension

    * Go to [chrome://extensions](chrome://extensions) page
    * Click load unpacked extension
    * Browse to the desired `environment[development/production]` folder

* ##### Loading crx file

    * Go to [chrome://extensions](chrome://extensions) page
    * Drag and drop the extension crx file from the `build` folder

## Maintaining changelog

A [changelog](https://github.com/Acesmndr/nepali-date-chrome-extension/blob/master/changelog.md) has been maintained to keep track of all the changes made in the extension along with semantic versioning

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Acesmndr/nepali-date-chrome-extension/tags).

### Upgrading the extension

Run the following command to check the current version of the extension
```
yarn version:show
```
Then to upgrade the version along with a changelog run the following command
```
CHANGELOG="Changes made in the extension" VERSION="5.0.0" npm run version:upgrade
```


## Built With

* [Webpack](https://webpack.js.org/concepts/) - Module Bundler
