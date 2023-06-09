const commanEvents = function () {

    this.init = function () {
        _this.notificationBtnEvent();
        _this.notificationIconLoadEvent();
        _this.notificationSeenBtnEvent();
        _this.toastrMsgConfig();
    }

    // toastr message configuration
    this.toastrMsgConfig = function () {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            // "positionClass": "toast-bottom-full-width",
            "onclick": null,
            "showDuration": "300000",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }

    // notification button click event
    this.notificationBtnEvent = function () {
        $(document).on("click", "#notification-btn", function () {
            _this.fetchNotifications();
        })
    }

    // fetch all notifications of users
    this.fetchNotifications = function () {
        $(".list-group").load(`/notification .list-group-item`);
    }

    // notification icon load event
    this.notificationIconLoadEvent = function () {
        $("#load-notification-icon").load(`/notification/count #notification-btn`);
    }

    // notification seen btn event
    this.notificationSeenBtnEvent = function () {
        $(document).on("click", "#notification-seen-btn", function (e) {
            console.log($(this).closest("#notification-btn > #notification-drop-down"));
            let notificationCount = $("#notification-count").text();

            $.ajax({
                method: "put",
                url: `/notification/${$(this).data("notification-id")}/seen`,
                success: function (response) {
                    if (response.type == "success") {
                        // Decrease the notification count
                        notificationCount = Number(notificationCount) - 1;
                        $("#notification-count").text(notificationCount);

                        // remove notification block
                        $(`.${$(this).data("notification-id")}`).remove();
                        $(document).find("#notification-drop-down").addClass("show").attr("data-bs-popper", "static");
                    }
                }
            })
        })
    }

    // socket Event (show notification to post owner when save their post by other)
    socket.on("notify", (message) => {
        _this.fetchNotifications();
        _this.notificationIconLoadEvent()
        toastr.success(message, { timeOut: 1000 });
    })

    // when recive the chat message 
    socket.on("receiveMessage", (data) => {
        console.log("message receive");
        toastr.success(data.message);
        $("#chat-msg-list").load(`/chats/${data.userId} #chat-msg-list`, function () {
            $("#chat-msg-list").animate({ scrollTop: $("#chat-msg-list")[0].scrollHeight }, "slow");
        });
    })

    const _this = this;
    _this.init();
}
