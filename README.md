# GreenMesa Process Manager

This repository contains the source files necessary to run the deployment process for the [GreenMesa application](https://github.com/enigmadigm/greenmesa). This application is run as a systemd process on the server the app is run on.

The app uses port 8080, this is currently hardcoded. The app listens for a a webhook from GitHub (in the GreenMesa repo), and updates the running GreenMesa deployment if the hook is valid and represents a push to the master branch.

## `config.json`

This is an additional file that contains the webhook secret. It contains this template:

```json
{
    "WEBHOOK_SECRET": "[secret]",
}
```

~~For some reason the bash script this runs requires sudo permissions, I do not know why or how to deelevate those perms.~~