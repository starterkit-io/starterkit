# StarterKit.io

A starter kit for everyone with an idea. This kit is put together to get started with building your idea right away. [Read more about StarterKit.io here.](https://medium.com/starter-kit/about-starterkit-io-82248f61c7f3#.725j125z9)

## Demo

You can find the demo at [http://demo.starterkit.io](http://demo.starterkit.io)

## Getting started

We are working towards making it easier to get started with this starter kit everyday. The kit is still in beta stage, please follow the steps below to setup the project.

### Steps

1. If you do not have a Heroku account, go to [Heroku](https://heroku.com/) to sign up for an account.
2. Once you have created an account (or if you already have an existing Heroku account), go to [Heroku Toolbelt](https://toolbelt.heroku.com/) to download the program and follow the installation steps.
3. Open up your console (for OS X - terminal.app, for Windows - command prompt) and type `heroku login` to login with your account.
4. Create a Heroku app by typing `heroku create <app-name-in-alphanumeric-without-space>`.
5. (Remember to change your directory to your project folder) Clone starterkit by typing `git clone git@bitbucket.org:starterkit/starterkit.git <app-name-in-alphanumeric-without-space>`
6. After the cloning process is done, change directory to the project folder by typing `cd <app-name-in-alphanumeric-without-space>`
7. Once you are in the project folder, add heroku to your project by typing `git remote add heroku https://git.heroku.com/<app-name-in-alphanumeric-without-space>.git`
8. Next, you need to add Heroku PostgreSQL to your heroku app. To do this, type `heroku addons:create heroku-postgresql:hobby-dev`.
9. Then, you will need to do the same for Heroku Redis. Type `heroku addons:create heroku-redis:hobby-dev`.
10. As the starterkit pre-built with all the user authentication features such as forget password, it is tightly coupled with an email service and for our choice, we chose SendGrid. To add SendGrid, type `heroku addons:create sendgrid:starter`.
11. Finally, you deploy the starterkit by typing `git push heroku master`.
12. Once the deployment is done, you can type `http://<app-name-in-alphanumeric-without-space>.herokuapp.com` into your browser to see your shiny new application.
13. Done. Easy peasy.

## Dependencies

Here's a list of dependencies:

- Heroku
- PostgreSQL
- Sendgrid
- NodeJs
- ExpressJS
- Bootstrap
- Redis

## Author

This project is created and maintained by [Mickey Cheong](https://cheo.ng)

## License

StarterKit.io is released under the [MIT License](https://opensource.org/licenses/MIT)
