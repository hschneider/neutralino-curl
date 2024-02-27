<p align="center">
<img src="https://marketmix.com/git-assets/neutralino-curl/neutralino-curl-header-2.jpg">
</p>


# neutralino-curl

**A CURL wrapper for Neutralino**

This cross-platform CURL wrapper comes with the following features:
- Fast downloads and uploads via HTTP, HTTPS, FTP, FTPS.
- No more headaches about CORS.
- Custom parameters support all possible CURL-protocols, like IMAP, POP3, SMTP, SMB, SCP, TELNET, WS, MQTT, LDAP and more.
- Emits JS events to for progress monitoring.

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

nuetralino-curl is not a classic WebSocket-bound extension. It only consists of the CURL binary for your platform and a JS lib, both reside in your resources-folder. 

### Setup

- Copy the content from `_install/YOUR_PLATFORM/bin/`to `resources/bin/`.
- Include `resources/neutralino-curl/curl.js`in your `index.hml`file.
- Init CURL and add the required events to `main.js`.

## CURL by Example

Init CURL:

```js
let CURL = new NeutralinoCurl();
```

### HTTP, HTTPS:

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

### FTP, FTPS:

Set credentials. Use this once, it applies to all following  operations:

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

### Any Protocol

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

| Method             | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| download(src, dst) | Download a file via HTTP, HTTPS, FTP or FTPS. <br />**src:** URL<br />**dst:** File-path (optional) |
| upload(src, dst)   | Upload a file via HTTP, HTTPS, FTP or FTPS. <br />**src:** File-path<br />**dst:** URL |
| resetProgress()    | Resets the progress counter and emits a `curlProgress` event with data  `0.0`, which in turn clears a connected progressbar. |
| run(args)          | Run the curl-binary with custom arguments. This method is also called from `download()` and `upload()` internally.<br />**args:** Curl command-line parameters |

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

