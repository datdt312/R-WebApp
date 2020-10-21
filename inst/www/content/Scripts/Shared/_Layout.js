
var _Layout = {
    init: function () {
        var me = this;
        me.registerEvents();
    },

    registerEvents: function () {
        $('#navbarCollapse-top-id li').off('click');
        $('#navbarCollapse-top-id li').on('click', (e) => {
            $('#navbarCollapse-top-id li').removeClass('active');
            $(e.currentTarget).addClass('active');
        });
    }
};