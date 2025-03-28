<p align="center">
<img src="https://marketmix.com/git-assets/neutralino-curl/neutralino-curl-header-2.jpg">
</p>


# neutralino-curl

**A CURL Wrapper for Neutralino**

This cross-platform CURL wrapper comes with the following features:
- Fast downloads and uploads via HTTP, HTTPS, FTP, FTPS.
- Supports custom HTTP-headers, e.g. for API authentication.
- No more headaches about CORS.
- Custom parameters support all possible CURL-protocols, like IMAP, POP3, SMTP, SMB, SCP, TELNET, WS, MQTT, LDAP and more.
- Emits JS events for progress monitoring.

![](https://marketmix.com/git-assets/neutralino-curl/neutralino-curl-demo.gif)

## Run the demo
Clone this repo, and cd to the project folder. 
Copy the content from `_install/YOUR_PLATFORM/bin/`to `resources/bin/`.

Then enter
```js
neu update --latest
neu run
```

## Include in your own Project

neutralino-curl is not a classic WebSocket-bound extension. It only consists of the CURL binary for your platform and a JS lib. 

### Setup on all Platforms

- Copy the content from `_install/YOUR_PLATFORM/bin/`to `extensions/curl/bin/`.
- Include `extensions/neutralino-curl/curl.js`in your `index.hml`file.
- Init CURL and add the required events to `main.js`.

## Deployment

### On Windows and Linux

The `extensions` folder needs to be placed beside your `resources..neu` folder:

```
app.exe
resources.neu
extensions
```

### On macOS

The `extensions` folder goes into your app bundle's `Resources` folder. This can be automated with **[Neutralino Build Scripts.](https://github.com/hschneider/neutralino-build-scripts)**

## CURL by Example

### Init CURL

```js
let CURL = new NeutralinoCurl();
```

### Add Cutom-Headers

Set HTTP custom-headers. Use this once, it applies to all further operations:

```js
CURL.addHttpHeader('X-API-Token', '1234');
CURL.addHttpHeader('X-API-User', 'jimbo');
```

### GET- & POST-Requests

GET-Request:

```
let result = await CURL.get("https://domain.com/api-endpoint");
```

POST-Request:
```
let d = {
  field1: 1,
  field2: 2
}
await CURL.post("https://domain.com/api-endpoint", d);
```

### Downloads & Uploads

#### Via HTTP or HTTPS

Download:

```js
await CURL.download("https://file.zip");
```

Download as:

```js
await CURL.download("https://file.zip", 'renamed_file.zip');
```

Upload :

```js
await CURL.upload("file.zip, "https://server.com");
```

#### Via FTP or FTPS:

Set credentials. Use this once, it applies to all further operations:

```js
CURL.setCredentials('username', 'password')
```

Download:

```js
await CURL.download("ftp://server.com/file.zip");
```

Download as:

```js
await CURL.download("ftp://server.com/file.zip", "renamed_file.zip");
```

Upload:

```js
await CURL.upload("file.zip", "ftp://server.com/path")
```

### Use any Protocol, any Command

You can use any command-line parameter and protocol, supported by the curl binary by using `CURL.run()`. If curl's output goes to stdout, the `curlData`event with curl's output in `e.detail` is triggered.

The following example lists all messages on a POP3-server:

```js
await CURL.run('-k -l -u username:password pop3://mail.server.com');
```

Keep in mind, that special, shell-relevant characters in passwords need to be escaped:

```js
// This will fail:
await CURL.run('-k -l -u user@server.com:My$Password! pop3://mail.server.com');
// This is the way:
await CURL.run('-k -l -u user@server.com:My\\$Password\\! pop3://mail.server.com');
```

Read more about [the fantastic possibilites of curl here.](https://everything.curl.dev)

## Methods

| Method                    | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| addHttpHeader(key, value) | Add a custom HTTP-header to the header-list. Headers are sent with each HTTP-upload or -download.<br />**key**: HTTP-Header name<br />**value**: HTTP-Header content |
| clearHttpHeader()         | Clears the HTTP-header list.                                 |
| get(url)                  | GET-Request. Returns data as string.<br />**url**: API-endpoint |
| post(url, data)           | POST-Request.<br />**url**: API-endpoint<br />**data**: POSt-data as stringified JSON. |
| download(src, dst)        | Download a file via HTTP, HTTPS, FTP or FTPS. <br />**src:** URL<br />**dst:** File-path (optional) |
| upload(src, dst)          | Upload a file via HTTP, HTTPS, FTP or FTPS. <br />**src:** File-path<br />**dst:** URL |
| resetProgress()           | Resets the progress counter and emits a `curlProgress` event with data  `0.0`, which in turn clears a connected progressbar. |
| run(args)                 | Run the curl-binary with custom arguments. This method is also called from `download()` and `upload()` internally.<br />**args:** Curl command-line parameters |
| setCredentials(usr, pwd)  | Set credentials for FTP/FTPS operations.<br />**usr**: Username<br />**pwd**: Password |

## Events

| Event           | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| curlStart       | Emitted before the CURL binary is launched.                  |
| curlProgress(e) | Emitted with each download- or upload-progress step. `e.detail`contains the current progress value as float. |
| curlData(e)     | Using `CURL.run()`with custom args, all data is collected from curl's stdout and sent via `e.detail`for further processing. |
| curlStop(e)     | Emitted after the CURL binary stopped. `e.detail`contains the exit code as an integer. Read [about CURL exit codes here.](https://everything.curl.dev/cmdline/exitcode) |

## More about Neutralino

- [NeutralinoJS Home](https://neutralino.js.org) 
- [Neutralino related blog posts at marketmix.com](https://marketmix.com/de/tag/neutralinojs/)



<img src="https://marketmix.com/git-assets/star-me-2.svg">

