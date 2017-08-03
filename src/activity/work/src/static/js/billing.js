$(function () {
    var amount = 0, //天
        hourAmount = 0, //小时
        dayAmount = $("#dayAmount"), //天数的值
        hoursAmount = $("#hoursAmount"), //小时的值
        carStyle = $('.carStyle input:checked').attr('id'), //停车类型
        time_24 = $('.time_24 option:selected').val(), //首次||两次以上入场
        floorT2 = $('.floor.t2 option:selected').text(), //T2楼层
        floorT3 = $('.floor.t3 option:selected').text(); //T3楼层
    //切换导航
    $(".nav li").on('click', function () {
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        if (index == 0) {
            $(".t1").show();
            $(".t2,.t3").hide();
            $(".time_24").hide();
        } else if (index == 1) {
            $(".t2").show();
            $(".t1,.t3").hide();
            $(".time_24").show();
        } else if (index == 2) {
            $(".t3").show();
            $(".t1,.t2").hide();
            $(".time_24").show();
        };
        dayAmount.val('');
        hoursAmount.val('');
        $("#money").html("¥0");
    });
    // t2 选择大小车
    $(".carStyle input").on('click', function () {
        var build = $(".active").text();
        var id = $(this).attr("id");
        if (id == "trucks") {
            $(".time_24 select").html(
                "<option>入场</option>"
            ).attr("disabled", 'disabled');
        } else {
            $(".time_24 select").html(
                '<option value="1">首次入场</option>' +
                '<option value="2">两次（含）以上入场</option>'
            ).attr("disabled", false);
        };
        if (build == "2号停车楼") {
            if (id == "cars") {
                $(".floor.t2 select").html(
                    "<option>B2/B3/B4层</option>" +
                    "<option>B1/F1/F2层</option>"
                );
            } else {
                $(".floor.t2 select").html(
                    "<option>F1\\\F2层</option>"
                );
            };
        };
    });
    $(".times input").on('click', function () {
        if (isNaN($(this).val()) || $(this).val() == 0) {
            $(this).val('');
        };
    });
    $(".reset").on('click', function () {
        dayAmount.val(0);
        hoursAmount.val(0);
        $("#money").val('¥0');
    });
    $(".calculate").on('click', function () {
        var build = $(".active").text(),
            floorT2 = $('.floor.t2 option:selected').text(), //T2楼层
            floorT3 = $('.floor.t3 option:selected').text(); //T3楼层
        if (isNaN(dayAmount.val()) || isNaN(hoursAmount.val())) {
            var dialog = Dialog.init('alert');
            dialog.show();
            dialog.setValue('请输入停车时长。该参数必须为数字。');
            return;
        };
        if (dayAmount.val() <= 0 && hoursAmount.val() <= 0) {
            hoursAmount.val(0);
            dayAmount.val(0);
            //显示结果
            $("#money").html("¥0");
            return;
        };
        if (dayAmount.val().length == 0) {
            dayAmount.val(0);
        };
        amount = Math.abs(dayAmount.val()); //天
        hourAmount = Math.abs(hoursAmount.val()); //小时
        //2-3航站楼
        if (("B1层B\\\C区" == floorT3 && build == "3号停车楼") || ("B1/F1/F2层" == floorT2 && build == "2号停车楼")) {
            hourAmount = hourAmount + Math.floor(amount * 24);
        } else {
            amount = amount + Math.floor(hourAmount / 24);
            hourAmount = hourAmount % 24;
        };
        if (build == "1/5号停车场") { //1/5号停车场
            if (hourAmount > 16) {
                amount += 1;
                hourAmount = 0;
            };
        } else {
            if ("B1层B\\\C区" != floorT3 && "B1/F1/F2层" != floorT2) {
                if (hourAmount > 7.5) { //如果大于7.5小时，算一天
                    amount += 1;
                    hourAmount = 0;
                };
            };
        };
        hoursAmount.val(hourAmount);
        if (("B1层B\\\C区" == floorT3 && build == "3号停车楼") || ("B1/F1/F2层" == floorT2 && build == "2号停车楼")) {
            dayAmount.val('');
            amount = 0;
        } else {
            dayAmount.val(amount);
        };
        if (build == "1/5号停车场") { //1/5号停车场
            res = calOneLong(amount);
            if (hourAmount > 0) {
                res = res + calOne(hourAmount);
            };
        } else { //2号楼
            res = calTwoLong(amount);
            if (hourAmount > 0) {
                res = res + calTwo(hourAmount, amount > 0);
            };
        };
        $('#money').text("¥" + res);
        amount = 0;
    });
});

function calOneLong(amount) { //1号楼
    var dayPrice = 80; //一天初始化
    var firstPay = 20;
    var res = 0; //总数
    if (amount <= 0) { //如果天数小于0
        return res;
    };
    if ($('.carStyle input:checked').attr('id') == "cars") { //小车
        dayPrice = 80;
        res = dayPrice * amount;
    } else { //大车
        dayPrice = 160; //第一天140
        firstPay = 160; //第二天以后100
        if (amount > 1) {
            res = firstPay * (amount - 1) + dayPrice;
        } else {
            res = dayPrice;
        };
    };
    //显示结果
    return res;
}

function calTwoLong(amount) {
    //2号停车场
    var dayPrice = 0;
    var firstPay = 0;
    var res = 0;
    if (amount <= 0) { //如果天数小于0
        return res;
    };
    if ($('.carStyle input:checked').attr('id') == "cars") {
        //小车
        dayPrice = 80;
        res = dayPrice * amount;
    } else {
        //大车
        dayPrice = 160;
        firstPay = 160;
        if (amount > 1) {
            res = firstPay * (amount - 1) + dayPrice;
        } else {
            res = firstPay;
        };
    };
    amount = Math.ceil(amount);
    //显示结果
    return res;
}

function calOne(amount) {
    //1号停车场
    var hourPrice = 2.5;
    var res = 0;
    if ($('.carStyle input:checked').attr('id') == "cars") {
        //小车
        hourPrice = 2.5;
    } else {
        //大车
        hourPrice = 5;
    };
    res += Math.ceil(amount / 0.5) * hourPrice;
    return res;
}

function calTwo(amount, long) {
    var hourPriceHalf = 0;
    var hourPrice = 5;
    var res = 0;
    if ($('.carStyle input:checked').attr('id') == "cars") { //小车
        hourPrice = 2.5;
        var stopTime = $('.time_24 option:selected').val();
        if (long) { //长期
            res = Math.ceil(amount / 0.5) * (hourPrice * 2);
        } else { //小于一天
            if (amount <= 0.5) {
                res = 0;
            } else if (amount <= 1) {
                res = 6;
                if (stopTime == 2) {
                    res = 10;
                };
            } else {
                var mon = 6;
                if (stopTime == 2) {
                    mon = 10;
                }
                res = Math.ceil((amount - 1) / 0.5) * (hourPrice * 2) + mon;
            };
        };
    } else { //大车
        hourPrice = 10;
        if (long) { //长期
            res = Math.ceil(amount / 0.5) * hourPrice;
        } else { //小于一天
            if (amount <= 0.5) {
                res = 5;
            } else if (amount <= 1) {
                res = 10;
            } else {
                res = Math.ceil(amount / 0.5) * hourPrice - 10;
            };
        };
    }
    //显示结果
    return res;
}