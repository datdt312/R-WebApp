const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

var Utility = {

    ajaxRequest: function (uri, config, data, callBack) {
        var options = {
            url: `${baseUrl}${uri}`,
            contentType: 'application/json',
            cache: true,
        };

        if (typeof config === 'object') {
            options = $.extend(options, config);
        } else {
            if (config.toUpperCase() == "GET" || config.toUpperCase() == "POST") {
                options.type = config;
            }
        }
        if (options.type.toUpperCase() === "POST" && data) {
            options.data = JSON.stringify(data);
        }

        return $.ajax(options).done(function (response) {
            if (response
                && response.hasOwnProperty("Code")
                && response.Code === 500) {
                Toast.fire({
                    icon: 'error',
                    title: 'Đã có lỗi xảy ra!'
                });
                return;
            }
            if (typeof callBack === 'function') {
                callBack(response);
            }
        }).fail(function (jqXHR) {
            if (jqXHR.status && jqXHR.status == 987) {
                MTUtility.showWarning("Bạn không có quyền thực hiện chức năng này!");
                return;
            }
        });
    },

    showWarning: function (msg, options) {
        var defaults = {
            title: "Error",
            boxWidth: '300px',
            useBootstrap: false,
            content: `<div style="padding-top:15px">${msg}</div>`,
            buttons: {
                "Đóng": {
                    keys: ['N'],
                    action: function () {
                    }
                },
            }
        };
        var options = $.extend(defaults, options);
        $.confirm(options);
    },
};