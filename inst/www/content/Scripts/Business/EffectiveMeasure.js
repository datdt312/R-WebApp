
var myEffectiveMeasure = {
    init: function () {
        var me = this;
        me["file"] = null;
        me.registerEvents();

        $('#DependentVariables').multiselect({
            disableIfEmpty: true
        });
        $('#IndependentVariables').multiselect({
            disableIfEmpty: true
        });
    },

    registerEvents: function () {
        /**
         * Chạy mô hình
         * ****
         * Created by: ThanhDat 20/08/2020
         */
        $(document).off('click', '[action="RunModel"]');
        $(document).on('click', '[action="RunModel"]', (e) => {
            var me = this;

            if (me["file"] === null) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Vui lòng chọn tệp!'
                });
                return;
            }
            if ($('button[action="UploadFile"]').hasClass('bg-yellow')) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Vui lòng tải dữ liệu lên!'
                });
                return;
            }

            Utility.ajaxRequest("EffectiveMeasure/RunModel", "POST",
                {
                    filename: $('#add-file-box').val(),
                    y: $("#DependentVariables").val(),
                    x: $("#IndependentVariables").val(),
                }, (response) => {
                    if (response.Code == 200) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Chạy thành công!'
                        });
                        console.log(response.Data);
                        me.showOutput(response.Data);
                    } else if (response.Code == 400) {
                        alert(response.Message);
                    }
                });
        });

        /**
         * Event tải file lên server
         * ***
         * Created by: ThanhDat 17/08/2020
         */
        $(document).off('click', '[action="UploadFile"]');
        $(document).on('click', '[action="UploadFile"]', (e) => {
            var me = this;

            if (me["file"] === null) {
                Toast.fire({
                    icon: 'warning',
                    title: 'Vui lòng chọn tệp!'
                });
                return;
            }

            if ($('button[action="UploadFile"]').hasClass('bg-green')) {
                Toast.fire({
                    icon: 'success',
                    title: 'Đã tải dữ liệu lên!'
                });
                return;
            }

            if (window.FormData != undefined) {
                var fileData = new FormData();

                var _file = me["file"];
                fileData.append(_file.name, _file);

                // Adding one more key to FormData object  
                fileData.append('username', 'Hope');

                $.ajax({
                    url: '/Upload/UploadFile',
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    data: fileData,
                    success: function (response) {
                        if (response.Code == 200) {
                            Toast.fire({
                                icon: 'success',
                                title: 'Tải dữ liệu thành công!'
                            });
                            me.changeButtonGreen();
                            me.loadVariables();
                        } else if (response.Code == 400) {
                            Toast.fire({
                                icon: 'error',
                                title: response.Message
                            });
                        }
                    },
                    error: function (er) {
                        console.log(er.statusText);
                    }
                });
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Trình duyệt không hỗ trợ FormData!'
                });
            }
        });

        /**
         * Event thêm/ chọn file
         * ***
         * Created by: ThanhDat 17/08/2020
         */
        $(document).off('click', '[action="AddFile"]');
        $(document).on('click', '[action="AddFile"]', (e) => {
            var me = this;
            var el = window._protected_reference = document.createElement("INPUT");
            el.type = "file";

            // csv: .csv
            // excel 97-2003 (xlxs): application/vnd.ms-excel
            // excel 2007+ (xls): application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            el.accept = ".csv, .xls, .xlsx";

            el.addEventListener('change', () => {

                new Promise(function (resolve) {
                    setTimeout(function () {
                        var _file = el.files[0];
                        $('#add-file-box').val(_file.name);
                        me["file"] = _file;
                        me.changeButtonYellow();
                        resolve();
                    }, 10);
                })
                    .then(function () {
                        // clear / free reference
                        el = window._protected_reference = undefined;
                    });
            });

            el.click();
        });
    },

    /**
     * Đổi màu nút "Tải dữ liệu" sau khi tải lên thành công
     * ****
     * Created by: ThanhDat 17/08/2020
     * */
    changeButtonGreen: function () {
        $('button[action="UploadFile"]').removeClass('bg-yellow');
        $('button[action="UploadFile"]').addClass('bg-green');
    },
    changeButtonYellow: function () {
        $('button[action="UploadFile"]').removeClass('bg-green');
        $('button[action="UploadFile"]').addClass('bg-yellow');
    },

    /**
     * Load các biến phụ thuộc, biến độc lập
     * ****
     * Created by: ThanhDat 19/08/2020
     * */
    loadVariables: function () {
        var me = this;

        var _fname = $('#add-file-box').val();

        Utility.ajaxRequest("EffectiveMeasure/GetVariables", "POST", { filename: _fname }, (response) => {
            if (response.Code == 200) {
                me.applyDependentVariables(response.Data);
                me.applyIndependentVariables(response.Data);
            } else if (response.Code == 400) {
                Toast.fire({
                    icon: 'warning',
                    title: response.Message
                });
            }
        });
    },

    /**
     * apply biến vào các combo
     * ****
     * Created by: ThanhDat 20/08/2020
     * */
    applyDependentVariables: function (response) {
        var box = $('#DependentVariables');
        box.multiselect('destroy');
        box.clearQueue();
        response.data.forEach((value) => {
            box.append(new Option(value, value));
        });
        box.multiselect({
            disableIfEmpty: true,
            maxHeight: 200,
            dropUp: true
        });
    },

    applyIndependentVariables: function (response) {
        var box = $('#IndependentVariables');
        box.multiselect('destroy');
        box.clearQueue();
        box.attr('multiple', 'multiple');
        response.data.forEach((value) => {
            box.append(new Option(value, value));
        });
        box.multiselect({
            disableIfEmpty: true,
            includeSelectAllOption: true,
            maxHeight: 200,
            dropUp: true
        });
    },

    showOutput: function (data) {

        $('#console-output').clearQueue();
        $('#console-output').html(data);


        $('#modal-console-output').modal('show');
    }
};