# Nepali Date Chrome Extension

The [extension](https://developer.chrome.com/extensions) shows the current nepali date in the browser action.

![NepaliDatePromo](https://user-images.githubusercontent.com/4254571/104809613-a96dc400-5816-11eb-8d97-4604e8681830.jpg)

![NepaliDatePromo2](https://user-images.githubusercontent.com/4254571/104809617-aecb0e80-5816-11eb-8d5c-0d20f415e501.jpg)
802-11eb-9616-9fb6ca31c89f.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

```
* Node
* Yarn
```

### Installing

To get the extension built the following simple steps need to be followed

Please make sure that Node and Yarn are installed in your machine.
If yarn is not installed then install it by using the below command :

MAC

```
brew install yarn
```

Windows

1. download installer from https://yarnpkg.com/lang/en/docs/install/
2. install yarn using installer
3. restart command line if necessary

Clone this repository

```
git clone git@github.com:Acesmndr/nepali-date-chrome-extension.git
cd nepali-date-chrome-extension
```

then install the project dependencies
```
yarn install
```

## Building the extension

To build the extension run the following command

```
yarn build:[development/stagingnxt/production]
```

It builds the extension files in the folder for the environment you passed as well as builds the crx extension in the build folder.
`yarn build:development` doesn't build the crx file but watches over the files and rebuilds the extension files for each file change.  

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
CHANGELOG="Changes Made in the extension" VERSION="5.0.0" yarn version:upgrade
```


## Built With

* [Webpack](https://webpack.js.org/concepts/) - Module Bundler
* [Yarn](https://yarnpkg.com/en) - The package manager
