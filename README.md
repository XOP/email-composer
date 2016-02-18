# Email Composer

Automated process for building and testing emails.

**WARNING**   
**This should be refactored in order to work with the newest Assemble API**  
**Or better drop Assemble due to it's unstable nature completely**  
**And use another gulp handlebars compilation**

## Installation

```
# npm dependencies
npm i
```


## Launch and development

```
# render emails
gulp build

# development
gulp
```

### Templates and data

Due to [assemble](http://assemble.io/) usage, data organized and stored respectfully.
Consider the following structure:

```
templates
    email
        foo.hbs
        bar.hbs
```

Data should be presented as:

```
data
    email
        foo
            data.json
        bar
            data.json
```

## Sending platform

Composer uses [Mailgun](https://mailgun.com/app/dashboard) API to send emails,
so it will need private data, contained in **secret.json**, located in root folder.
