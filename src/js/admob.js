function onLoad() {
    if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        initApp();
    }
}

onLoad();

var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) {
    admobid = {
        banner: 'ca-app-pub-2939209804553163/6240468131',
        interstitial: 'ca-app-pub-2939209804553163/3426602530'
    };
}
else {
    admobid = {
        banner: 'ca-app-pub-2939209804553163/6240468131',
        interstitial: 'ca-app-pub-2939209804553163/3426602530'
    };
}
    
function initApp() {
if (! AdMob ) { alert( 'admob plugin not ready' ); return; }
initAd();
    // display a banner at startup
    createSelectedBanner();
}
function initAd(){
    var defaultOptions = {
        // bannerId: admobid.banner,
        // interstitialId: admobid.interstitial,
        adSize: 'SMART_BANNER',
        // width: integer, // valid when set adSize 'CUSTOM'
        // height: integer, // valid when set adSize 'CUSTOM'
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        offsetTopBar: true, // avoid overlapped by status bar, for iOS7+
        bgColor: '#424242', // color name, or '#RRGGBB'
        // x: integer,      // valid when set position to 0 / POS_XY
        // y: integer,      // valid when set position to 0 / POS_XY
        isTesting: true, // set to true, to receiving test ad for testing purpose
        autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
    };
    AdMob.setOptions( defaultOptions );
    registerAdEvents();
}
// optional, in case respond to events or handle error
function registerAdEvents() {
    // new events, with variable to differentiate: adNetwork, adType, adEvent
    document.addEventListener('onAdFailLoad', function(data){ 
        alert('error: ' + data.error + 
                ', reason: ' + data.reason + 
                ', adNetwork:' + data.adNetwork + 
                ', adType:' + data.adType + 
                ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
    });
    document.addEventListener('onAdLoaded', function(data){});
    document.addEventListener('onAdPresent', function(data){});
    document.addEventListener('onAdLeaveApp', function(data){});
    document.addEventListener('onAdDismiss', function(data){});
}

function createSelectedBanner() {
    AdMob.createBanner( {adId:admobid.banner, overlap:false} );
}

function prepareInterstitial() {
    AdMob.prepareInterstitial({adId:admobid.interstitial, autoShow:true});
}