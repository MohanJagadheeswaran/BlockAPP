var sdk = new window.sfdc.BlockSDK();

var otmmSessionsURL = "https://183.82.105.188:8443/otmmapi/v4/sessions";
var folderId = "278b00fc68d408e88a33ae1db83da184ba08cd93";
var otmmAssetsURL = "https://183.82.105.188:8443/otmmapi/v4/folders/" + folderId + "/assets";
var otmmBaseUrl = "https://183.82.105.188:8443";

var selectedImagePath = "";

var setContentToBuilder = function () {
    getAuthentication();
    var assetName = document.getElementById('assetName').value;
    console.log(assetName);
    // sdk.setContent('<h1>'+ assetName + '</h1>')
    console.log('content set');
    //sdk.setContent('<img src="https://www.opentext.com/file_source/OpenText/en_US/PNG/opentext-zoom-crop-screen-otmm-16-3.png"/>');

}

var addAssetToContentBlock = function () {
    sdk.setContent(selectedImagePath);
}


var getAuthentication = function () {
    var assetName = document.getElementById('assetName').value;
    var assetType = document.getElementById('assetType').value;
    var url = otmmSessionsURL;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send('username=' + assetName + '&password=' + assetType + '');
    xhr.onload = function () {
        console.log(JSON.parse(this.responseText));
        var sessionObject = JSON.parse(this.responseText);
        //document.cookie = "JSESSIONID=" + sessionObject.session_resource.session.id;
        getAssetsFromOTMM(JSON.parse(this.responseText));
    }
}

var getAssetsFromOTMM = function (authInfo) {
    var url = otmmAssetsURL;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.withCredentials = true;

    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content - Type, Authorization, X - Requested - With");
    // xhr.setRequestHeader("JSESSIONID", authInfo.session_resource.session.id);
    xhr.send();
    xhr.onload = function () {
        console.log("Object is ", JSON.parse(this.responseText));
        var assetsObject = JSON.parse(this.responseText);
        var authContainer = document.getElementsByClassName('auth');
        authContainer[0].style.display = "none";
        if (assetsObject.assets_resource && assetsObject.assets_resource.asset_list) {
            for (var i = 0; i < assetsObject.assets_resource.asset_list.length; i++) {
                var assetObject = assetsObject.assets_resource.asset_list[i];
                console.log(assetObject);
                formAssets(assetObject);
            }
        }
        formAssets("button");
    }
    // var addAssetOption = document.getElementsByClassName(".addAsset");
    // addAssetOption.style.display = null;
}

var formAssets = function (assetObj) {
    var assetContainer = document.getElementById('assetContainer');
    if (assetObj == "button") {
        var button = document.createElement('BUTTON');

        button.innerHTML = "Add Asset";
        button.onclick = function () {
            addAssetToContentBlock();
        }
        //button.innerHTML("Add Asset");
        assetContainer.append(button);
    } else {
        if (assetObj && assetObj.rendition_content && assetObj.rendition_content.preview_content && assetObj.rendition_content.preview_content.url) {

            var div = document.createElement('div');
            var span = document.createElement('span');
            span.id = 'checkAsset';
            span.innerHTML = '<span><input type="checkbox" onclick="addAsset(this)"/></span>'

            div.className = 'otmmAsset';
            div.innerHTML = '<img class = "otmmImg" src ="' + otmmBaseUrl + assetObj.rendition_content.preview_content.url + '"/>';
            div.appendChild(span);
            assetContainer.appendChild(div);
        }
    }
}

var addAsset = function (assetObj) {
    console.log("Asset obj is ", assetObj);
    var selectedAsset = assetObj.closest(".otmmImg");
    console.log("Image is " + selectedAsset);
    var imgPath = selectedAsset.previousElementSibling.getAttribute('src');
    selectedImagePath = img;
}

