> Push Notification Server

We have stopped working on this project. Consider using [pushd](https://github.com/rs/pushd) instead.

Send push notifications via [Google Cloud Messaging](https://developers.google.com/cloud-messaging/) or the [Apple Push Notification Service](https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html)

# Installation

Install [NodeJS](https://nodejs.org/en/) and run `npm i -g pns`

# Server Configuration

Create `pns.json`:

```json
{
  "port": 3005,
  "apps": [
    {
      "appId": "com.example.myapp",
      "gcm": {
        "apiKey": "xxx...",
        "senderID": "123..."
      },
      "apn": {
        "cert": "path/to/cert.pem",
        "key": "path/to/key.pem"
      }
    }
  ]
}
```

Configure your firewall to allow outgoing communication on port `2195`:

```
sudo ufw allow out 2195
```

# App Configuration

1. Pick an identifier (e.g., `com.example.myapp`)
2. Set the widget id to the identifier in `config.xml` and reset your cordova platforms (`cordova prepare android|ios`)
3. Create a new entry in `pns.json` for your app and set appId to the chosen identifier

## iOS (Mac only)

1. Create an AppID with the chosen identifier in the [iOS Member Center](https://developer.apple.com/account/ios/identifiers/bundle/bundleList.action)
2. Enable Push Notifications for the AppId and generate development or production certificates
3. Download and import the certificage into your Keychain
4. Export the private key of the certificate via Keychain and run the following command:

```sh
openssl x509 -in aps_production.cer -inform DER -outform PEM -out APPID.pem
openssl pkcs12 -in aps_production.p12 -out APPID.key -nodes
```

5. Add the `cert` and `key` paths to the app configuration in `pns.json`.

## Android

1. Register your application on the [Google Developer Console](https://developers.google.com/mobile/add)
2. Add the `apiKey` and `senderId` to the app configuration in `pns.json`.

# Command Line Usage

Send a message:

```sh
pns [appId] [apn|gcm] [token] [title] [message] [payload]
```

Example:

```sh
pns com.example.myapp apn asd... "Hello world!" "This is my first push message." "{\"foo\":\"bar\"}"
```

# Server Usage

Start the server:

```sh
pns -s
```

Send a post request to send a message:

```
POST http://localhost:3005/send
```

```json

{
  "appId": "com.example.myapp",
  "token": "asd...",
  "platform": "gcm|apn",
  "title": "Hello world!",
  "body": "This is my first push message.",
  "payload": {
    "foo": "bar"
  }
}
```
