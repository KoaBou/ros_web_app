$(document).ready(function() {

    $("#index-list").click(function(event) {
        document.cookie = event.target.innerHTML; 
        $('#exampleModal').modal('hide');

        $body = $("body");

        $.ajax({

            url: '/index/navigation-precheck',
            type: 'GET',
            success: function(response) {


                if (response.mapcount > 0) {

                    $body.addClass("loading");

                    $.ajax({

                        url: '/index/gotonavigation',

                        type: 'POST',

                        data: event.target.innerHTML,

                        success: function(response) {



                            function connect() {

                                var ros = new ROSLIB.Ros({
                                    url: 'ws://localhost:9090'
                                });



                                ros.on('connection', function() {
                                    console.log('Connected to websocket server.');
                                    var rosTopic = new ROSLIB.Topic({
                                        ros: ros,
                                        name: '/rosout_agg',
                                        messageType: 'rosgraph_msgs/Log'
                                    });


                                    rosTopic.subscribe(function(message) {

                                        if (message.msg == "odom received!") {
                                            console.log(message.msg)
                                            window.location = "/navigation";
                                            $body.removeClass("loading");
                                        }

                                    });

                                });


                                ros.on('close', function() {
                                    console.log('Connection to websocket server closed.');

                                });


                                ros.on('error', function(error) {
                                    console.log('Error connecting to websocket server: ', error);
                                    setTimeout(function() {
                                        connect();
                                    }, 1000);

                                });
                            }

                            connect();


                        },
                        error: function(error) {
                            console.log(error);
                        }

                    })


                } else {
                    alert("No map in directory.Please do mapping.")
                }
            },
            error: function(error) {
                console.log(error);
            }

        })
    });


});