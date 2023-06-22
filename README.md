# Qr_chat_npm

## Start the project from `commit 289384f` as the current builds are in development and mostly broken.

Built with React, Node Js and HTML/CSS, the project aims to allows users to spin up new chatroom with exclusive access only through QR codes. 

qr_chat_npm is an npm package that allows you to generate unique QR codes that link to unique URLs with their own chat functionality. This package is designed to create anonymous chat groups for your community, college, stores, and more.

## Installation

You can install qr_chat_npm using npm:

`npm i qr_chat_npm`

## Preview

Chatroom:
![Alt text](/screenshot/ss1.png?raw=true "Chatroom")
Chat:
![Alt text](/screenshot/ss2.png?raw=true "Chat")
Conversation:
![Alt text](/screenshot/ss3.png?raw=true "Multiple User")
Npm:
![Alt text](/screenshot/ss4.png?raw=true "Chatroom")

## Usage

To use qr_chat_npm, first require the package in your code:

```javascript
const qr_chat = require('qr_chat_npm');

```
## Generate a QR Code 
To generate a QR code with a unique URL, use the generateQRCode function:

```javascript
const url = 'https://your-chat-app-url.com/';
const qrCode = qr_chat.generateQRCode(url);
```
This will return a QR code image file that you can save or display.

## Get a Unique URL
To get a unique URL for your chat group, use the getUniqueUrl function:

```javascript
const uniqueUrl = qr_chat.getUniqueUrl();
```

This will return a unique URL that you can use for your chat group.

## Start Chatting
To start chatting, simply share the generated QR code or unique URL with your group members. They can scan the QR code or enter the unique URL in their browser to join the chat group.

## Contributing
If you would like to contribute to qr_chat_npm, please submit a pull request with your changes. Before submitting, please ensure that your code passes the existing tests and that you have added tests for any new functionality.

## License
qr_chat_npm is licensed under the MIT License. See the LICENSE file for details.
