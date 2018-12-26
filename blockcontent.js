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
    sdk.setContent('<img src="' + selectedImagePath + '"/>');
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
        formAssets("refresh");
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
    }
    if (assetObj == "refresh") {
        assetContainer.innerHTML = "";
        var refresh = document.createElement('span');
        refresh.className = "refreshIcon"
        refresh.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M9 13.5c-2.49 0-4.5-2.01-4.5-4.5S6.51 4.5 9 4.5c1.24 0 2.36.52 3.17 1.33L10 8h5V3l-1.76 1.76C12.15 3.68 10.66 3 9 3 5.69 3 3.01 5.69 3.01 9S5.69 15 9 15c2.97 0 5.43-2.16 5.9-5h-1.52c-.46 2-2.24 3.5-4.38 3.5z"/></svg>';
        refresh.onclick = function () {
            getAssetsFromOTMM();
        }
        assetContainer.append(refresh);
    }
    else {
        if (assetObj && assetObj.rendition_content && assetObj.rendition_content.preview_content && assetObj.rendition_content.preview_content.url) {

            var div = document.createElement('div');
            var span = document.createElement('span');
            span.id = 'checkAsset';
            span.innerHTML = '<input type="checkbox" class = "checkAssetBox" onclick="addAsset(this)"/>'

            div.className = 'otmmAsset';
            div.innerHTML = '<img class = "otmmImg" src ="' + otmmBaseUrl + assetObj.rendition_content.preview_content.url + '"/>';
            div.appendChild(span);
            assetContainer.appendChild(div);
        }
    }
}

var addAsset = function (assetObj) {
    var selectedAsset = assetObj.closest("span");
    var imgPath = selectedAsset.previousElementSibling.getAttribute('src');
    selectedImagePath = imgPath;
    var checkAssetBoxes = document.getElementsByClassName("checkAssetBox");
    for (var i = 0; i < checkAssetBoxes.length; i++) {
        if (assetObj != checkAssetBoxes[i]) {
            checkAssetBoxes[i].checked = false;
        }

    }
    // if (assetObj.checked == true) {
    //     assetObj.checked = true;
    // }

}

