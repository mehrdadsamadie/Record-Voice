MyApp.controller('homeCtrl', ['$scope', '$http', '$state', '$rootScope', 'counter', 'localStorageService','$interval',
    function ($scope, $http, $state, $rootScope, counter, localStorageService, $interval) {
    $scope.isplay = false;
    $scope.isplayRecording = false;
    $scope.puse = false;
    $scope.startDate = null;
    $scope.isenroll = false;
    $scope.register =
        {
            Name: null,
            Phone: null
        }
    var mp3file;
    var mediaRec;
    var mp3playrecorde;
    $scope.changstautspaly = function (play) {
        $rootScope.$apply(function () {
            $scope.isplay = play;
            if (!play) {
                $scope.puse = false;
            }
        });
    };
    $scope.changstautspalyRecording = function (play) {
        $rootScope.$apply(function () {
            $scope.isplayRecording = play;
        });
    };
    $scope.beginDate = function (data) {
        if (data == null) {
            $scope.startDate = null;
            $scope.isenroll = true;
        }
        else {
            $scope.startDate = Date.now();
        }

    };
    $scope.play = function () {
        if ($scope.isplay == false) {
            $scope.isplay = true;
            mp3file = new Media("/android_asset/www/voice/record.mp3",
                               // success callback
                         function () {
                             mp3file.release();
                             console.log("playAudio():Audio Success");
                         },
                        // error callback
                        function (err) {
                            $scope.changstautspaly(false);
                            console.log("playAudio():Audio Error: " + err);
                        },

            function (code) {
                switch (code) {
                    case Media.MEDIA_STOPPED:
                        $scope.changstautspaly(false);
                        break;
                    case Media.MEDIA_STARTING:
                        break;
                }
            }
             );
            mp3file.play();
            mp3file.setVolume('1.0');
        }
    };
    $scope.stop = function () {
        if (mp3file) {
            mp3file.stop();
            $scope.isplay = false;
        }
    };
    stop = $interval(function () {
        if (!$scope.isplay && !$scope.isenroll && !$scope.isenroll && $scope.startDate==null) {
           
            $scope.play();
        }
        else if ($scope.isenroll && $scope.startRegister!=null)
        {
            var _now =Date.now();
            var diffMs = (_now - $scope.startRegister); 
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            if (diffMins > 5)
            {
                $scope.enroll();
            }
        }
    }, 1000);
    /////////////////////////////////////////////////////////////Record///////////////////////////////////////////////////////
    $scope.record = function () {
        if ($scope.isenroll)
        {
            return;
        }
        if (mp3file != null) {
            $scope.stop();
        }
      //  var src = "file:///storage/sdcard0/yaghoot/rec" + counter.counter + ".mp3";
        var src = "file:///storage/emulated/0/yaghoot/rec" + counter.counter + ".amr";
        mediaRec = new Media(src,
            // success callback
            function () {
                console.log("recordAudio():Audio Success");
                $scope.register = true;
                $scope.startRegister = Date.now();
                counter.counter = counter.counter + 1;
                localStorageService.set("counter", counter);
            },

            // error callback
            function (err) {
                console.log("recordAudio():Audio Error: " + err.code);
            }

            );

        // Record audio
        mediaRec.startRecord();
        $scope.beginDate(1);
    };
    $scope.stopRecord = function () {
        if (mediaRec && $scope.startDate!=null) {
            mediaRec.stopRecord();
            $scope.beginDate(null);
        }

    };
    $scope.palyRecord = function () {

        if ($scope.isplayRecording == false) {
            $scope.isplayRecording = true;
            //  var src = "file:///storage/sdcard0/yaghoot/rec" + counter.counter + ".mp3";
            var src = "file:///storage/emulated/0/yaghoot/rec" + (counter.counter-1) + ".amr";
            mp3playrecorde = new Media(src,
                               // success callback
                         function () {
                             mp3playrecorde.release();
                             console.log("playAudio():Audio Success");
                         },
                        // error callback
                        function (err) {
                            $scope.changstautspalyRecording(false);
                            console.log("playAudio():Audio Error: " + err);
                        },

            function (code) {
                switch (code) {
                    case Media.MEDIA_STOPPED:
                        $scope.changstautspalyRecording(false);
                        break;
                }
            }
             );
            mp3playrecorde.play();
            mp3playrecorde.setVolume('1.0');
        }
    };
    $scope.enroll = function () {
        $scope.isenroll = false;
        $scope.startRegister = null;
        if (mp3playrecorde) {
            mp3playrecorde.stop();
            mp3playrecorde = null;
        }
        $scope.isplayRecording = false;
        $scope.play();
        $scope.writefile($scope.register.Name, $scope.register.Phone)
        $scope.register.Name = null;
        $scope.register.Phone = null;
    };
    $scope.difrentTime = function (date1) {
        if ($scope.startDate != null) {
            var diff = date1 - $scope.startDate;
            var msec = diff;
            var hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            var mm = Math.floor(msec / 1000 / 60);
            msec -= mm * 1000 * 60;
            var ss = Math.floor(msec / 1000);
            msec -= ss * 1000;
            return hh + ":" + mm + ":" + ss;
        }
        else
            return null;
    };
    $scope.writefile = function (name, phone)
    {
        var data=
            {
                Name: name,
                Phone: phone,
                Date: Date.now(),
                Counter: (counter.counter - 1)

            };
        var path = "file:///storage/emulated/0/yaghoot";
            var filename = "record.txt";
            window.resolveLocalFileSystemURL(path, function (dir) {
                dir.getFile(filename, { create: true }, function (fileEntry) {
                    writeFile(fileEntry,data)
                });
            });

    }
    function writeFile(fileEntry, dataObj) {

        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function () {
                console.log("Successful file read...");
               
            };
            fileWriter.onerror = function (e) {
                console.log("Failed file read: " + e.toString());
            };
            if (!dataObj) {
                dataObj = new Blob([JSON.stringify(dataObj)], { type: 'text/plain' });
            }
            fileWriter.seek(fileWriter.length);
            fileWriter.write(dataObj,true);
        });
    }
}]);