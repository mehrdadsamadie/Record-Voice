// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    var CurrentVersion = 2;
    document.addEventListener('deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
     //   GetNewVersion();
         window.BOOTSTRAP_OK = true;
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

 //   $(document).bind('pageinit', GetNewVersion());

    function GetNewVersion() {
        var OutputString = "";
        var ts = new Date().getTime();
        $.getJSON("http://edbazar.com/MobileUpdate/update.json" + "?_=" + ts, function (data) {
            for (var i = 0; i < data.length; i++)
                for (var name in data[i])
                {
                    
                    if (name == "version") {
                        alert(data[i].version);
                        if (data[i][name] <= CurrentVersion)
                            break;
                        else
                            OutputString += "\n" + data[i][name] + " : \n";
                    }

                    else for (var index in data[i][name])
                        OutputString += data[i][name][index] + "\n";
                }
            if (OutputString != "")
            {
                var download = confirm(OutputString);
                if(download == true)
                    downloadApkAndroid("http://edbazar.com/MobileUpdate/android-debug.apk",
            "/sdcard/android-debug.apk");
            }
        })

        //.error(function (jqXHR, textStatus, errorThrown) {
        //    alert("error " + textStatus);
        //    alert("incoming Text " + jqXHR.responseText);
        //})
    }

    function downloadApkAndroid(FromServer, ToFile) {
        var fileURL = ToFile;

        var fileTransfer = new FileTransfer();
        var uri = encodeURI(FromServer);

        fileTransfer.download(
            uri,
            fileURL,
            function (entry) {

                alert("download complete: " + entry.fullPath);

                promptForUpdateAndroid(entry);
            },
            function (error) {
                alert("download error source " + error.source);
                alert("download error target " + error.target);
                alert("upload error code" + error.code);
            },
            false,
            {

            }
        );
    }

    function promptForUpdateAndroid(entry) {
        window.plugins.webintent.startActivity({
            action: window.plugins.webintent.ACTION_VIEW,
            url: entry.toURL(),
            type: 'application/vnd.android.package-archive'
        },
            function () {
            },
            function () {
                alert('Failed to open URL via Android Intent.');
                console.log("Failed to open URL via Android Intent. URL: " + entry.fullPath);
            }
        );
    }
})();