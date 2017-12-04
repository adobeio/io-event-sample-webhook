# Adobe I/O Events - Webhook Provider

This package provides you with a simple webhook provider that allows you to create multiple webhooks urls dynamically and observe activities on webhook based on path in real time.

# Install

## Local/Server deployment
```sh
$ npm install
$ npm start
```

You should be able to see your webhook at http://localhost:3000/ now. Please see the next step to expose it.

# Host

You would need to expose it before you use it for any I/O integrations. Two easy ways to do it: you can either host it on Heroku or expose your localhost with ngrok.

## Hosting on heroku

```sh
$ cd webhooks-provider
$ heroku login
$ heroku create
$ git push heroku master
$ heroku open
```
Now you can open it at the designated address that Heroku assigned you.

## OR expose your localhost with ngrok
```
$ ngrok http 3000
```

In your command line, you will see a string that looks like this --> https://randomnumbers.ngrok.io. Go to that address and you can see your localhost exposed to the web.

# Usage

## Subscribe to webhook events via URL 

- Establish connection using the following steps:

<img
alt="listen to webhooks" src="https://cloud.githubusercontent.com/assets/273188/21304884/362deb14-c5ee-11e6-8886-dade49032957.gif" width="500" />

- Add the webhook you created (yourwebhookaddress/webhook/webhookname, e.g. If you used ngrok and typed in "hello" for a new webhook, your address would be https://randomnumbers.ngrok.io/webhook/hello) to your I/O Events Integration on I/O Console.

- You should be able to see a GET on your webhook immediately, which is the challenge sent by Event Gateway

- Trigger an event from your Adobe service that you subscribed to and see your event updates posted here

<img
alt="listen to webhooks" src="https://cloud.githubusercontent.com/assets/273188/21348596/dbfae0fc-c6d3-11e6-87fb-04c2bdc2e139.png" width="500" />

# Contributors
- Sarah Xu [@sarahxxu](https://github.com/sarahxxu).
