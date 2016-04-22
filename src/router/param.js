"use strict";
var Param = (function () {
    function Param(config) {
        this.id = config.id || 0;
        this.amount = config.amount || 0;
        this.list = config.list || '';
        this.product = config.product || '';
    }
    return Param;
}());
module.exports = Param;
