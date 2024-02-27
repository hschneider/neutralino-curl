// NeutralinoCurl
//
// A Curl binary wrapper for Neutralino.
//
// Requirements:
// resources/bin/curl (on all platforms)
//
// (c)2024 Harald Schneider - marketmix.com

class NeutralinoCurl {
    constructor(opt= {}) {
        //
        // Constructor

        this.version = '1.0.4';
        this.debug = opt.debug || false;

        this.appRoot = NL_PATH;                              // App root path
        this.appResources = this.appRoot + '/resources';     // App resources path
        this.appResourcesBIN = this.appResources + '/bin';   // App BIN resources
        this.progress = 0;  // Current progress
        this.httpHeaders = [];  // List of HTTP headers

        // Auth credentials
        //
        this.auth = {
            usr: '',
            pwd: ''
        }
    }

    setCredentials(usr, pwd) {
        //
        // Set credentials for e.g. FTP

        this.auth.usr = usr;
        this.auth.pwd = pwd;
    }
    addHttpHeader(key, value) {
        //
        // Add a custom http-header

        let h = key + ": " + value;
        this.httpHeaders.push(h);
    }
    clearHttpHeader() {
        //
        // Clears http-header list.

        this.httpHeaders = [];
    }
    async download(src, dst="") {
        //
        // Download via http, ftp or ftps

        let auth = this.auth.usr+":"+this.auth.pwd;

        let ftpSSL = '';
        if(src.includes('ftps://')) {
            ftpSSL = '--ftp-ssl'
        }

        let httpHeader = '';
        if(this.httpHeaders.length > 0) {
            this.httpHeaders.map(h => {
                httpHeader += `-H "${h} "`;
            });
            console.log(httpHeader);
        }

        if(src.includes('http://') || src.includes('https://')) {
            if(dst === '') {
                await this.run(`--progress-bar ${httpHeader} -L -k -O ${src}`);
            }
            else {
                // Download as
                await this.run(`--progress-bar ${httpHeader} -L -k -o ${dst} ${src}`);
            }
        }

        if(src.includes('ftp://') || src.includes('ftps://')) {
            if(dst === '') {
                await this.run(`--progress-bar -k ${ftpSSL} -u ${auth} -O ${src}`);
            }
            else {
                // Download as
                await this.run(`--progress-bar -k ${ftpSSL} -u ${auth} -o ${dst} ${src}`);
            }
        }
    }
    async upload(src, dst) {
        //
        // Upload via http, ftp or ftps

        let auth = this.auth.usr+":"+this.auth.pwd;

        let ftpSSL = '';
        if(src.includes('ftps://')) {
            ftpSSL = '--ftp-ssl'
        }

        let httpHeader = '';
        if(this.httpHeaders.length > 0) {
            this.httpHeaders.map(h => {
                httpHeader += `-H "${h} "`;
            });
            console.log(httpHeader);
        }

        if(dst.includes('http://') || dst.includes('https://')) {
            await this.run(`--progress-bar -k ${httpHeader} -F file=@${src} ${dst}`);
        }
        if(dst.includes('ftp://') || dst.includes('ftps://')) {
            await this.run(`--progress-bar -k ${ftpSSL} -u ${auth} -T ${src} ${dst}`);
        }
    }
    async run(args) {
        //
        // Run curl with any argument

        let eStart = new Event("curlStart");
        document.dispatchEvent(eStart);

        let cmd = await Neutralino.os.spawnProcess(this.appResourcesBIN + `/curl ${args}`);

        Neutralino.events.on('spawnedProcess', (e) => {
            if(cmd.id == e.detail.id) {
                switch(e.detail.action) {
                    case 'stdOut':
                        let eData = new CustomEvent("curlData", {detail: e.detail.data});
                        document.dispatchEvent(eData);
                        break;
                    case 'stdErr':
                        const m = e.detail.data.match(/\d+\.\d+/);
                        if( m !== null && parseFloat(m[0]) >= this.progress) {
                            this.progress = parseFloat(m[0]);
                            if(this.debug) {
                                console.log("Curl progress in percent: "+m[0]);
                            }
                            let eProgress = new CustomEvent("curlProgress", {detail: Math.round(parseFloat(m[0]))});
                            document.dispatchEvent(eProgress);
                        }
                        break;
                    case 'exit':
                        if(this.debug) {
                            console.log(`Curl terminated with exit code: ${e.detail.data}`);
                        }
                        let eEnd = new CustomEvent("curlEnd", {detail: parseInt(e.detail.data)});
                        document.dispatchEvent(eEnd);
                        break;
                }
            }
        });
    }
    async resetProgress() {
        //
        // Reset progress-counter and emit curlProgress event.
        
        this.progress= 0.0;
        let eProgress = new CustomEvent("curlProgress", {detail: 0.0});
        document.dispatchEvent(eProgress);
    }
}
