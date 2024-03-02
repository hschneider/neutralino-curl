
function onWindowClose() {
    Neutralino.app.exit();
}

// Init Neutralino
//
Neutralino.init();
Neutralino.events.on("windowClose", onWindowClose);

// Set title
//
(async () => {
    await Neutralino.window.setTitle(`Neutralino CURL ${NL_APPVERSION}`);
})();

// Curl related
//
const PBAR = document.getElementById("pbar");
let CURL = new NeutralinoCurl();

async function testCurl() {
    let f = '';
    if(NL_OS === 'Darwin' || this.os === 'Linux') {
        f = '~/Downloads/test.jpg';
    }
    else {
        f = '%USERPROFILE%\\Downloads\\test.jpg';
    }
    await CURL.download("https://marketmix.com/git-assets/neutralino-curl/test.jpg", f);
}
async function clearProgressbar() {
    CURL.resetProgress();
}

document.addEventListener('curlStart', function(e) {
    document.getElementById("btn-test").disabled = true;
    console.log("Curl started ...");
});
document.addEventListener('curlEnd', function(e) {
    document.getElementById("btn-test").disabled = false
    console.log("Curl finished with exit code " + e.detail);
});
document.addEventListener('curlProgress', function(e) {
    PBAR.setAttribute("aria-valuenow", e.detail);
    PBAR.setAttribute("style", `width: ${e.detail}%`);
});
document.addEventListener('curlData', function(e) {
    console.log("Curl data:");
    console.log(e.detail);
});
