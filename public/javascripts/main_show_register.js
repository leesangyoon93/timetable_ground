/**
 * Created by Sangyoon on 2016-05-29.
 */
$(document).ready(function() {
    var dataObject = {};
    var majorArray = [];
    var resultArray = [];
    var order = 1;
    var count = 0;

    $.ajax({
        type: 'GET',
        url: '/main/show',
        dataType: 'json',
        success: function(data) {
            count = 0;
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 21; j++)
                    dataObject[5 * j + i] = data[i][j];
            }
        }
    });

    $.ajax({
        type: "GET",
        url: '/main/classInfo',
        success: function(data) {
            for(var i=0; i<data.length; i++)
                majorArray.push(data[i].major);
            majorArray.sort();
        }
    });

    $('.main-nav li a').on('click', function (e) {

        e.preventDefault();

        if ($(this).attr('href') == '#' + 'tv_show') {
            count = 0;
            $('#tv_show h2').html("내 시간표");
            $('.main-section').hide();
            $('#tv_show').fadeIn(600);

            $('.show_table tr td').each(function () {
                $(this).html(dataObject[count]);
                count++;
            });
            $('.show_table tr td button.delete').remove();
        }

        else if ($(this).attr('href') == '#' + 'tv_register') {
            count = 0;
            $('#tv_register h2').html("시간표 등록/수정 <button class='btn btn-info' id='edit'>등록(검색)</button><button class='btn btn-success' data-toggle='tooltip' data-placement='right' title='CLICK!' id='save'>저장</button>");

            $('.main-section').hide();
            $('#tv_register').fadeIn(600);
            $('#save').tooltip('show');

            $('.input_table tr td').each(function () {
                $(this).html(dataObject[count]);
                $(this).addClass(""+ count);
                count++;
            });

            $('button.delete').on('click', function () {
                var deleteInfo = $(this).parent().html();
                $('.input_table tr td').each(function() {
                    var cutPos = $(this).html().indexOf('<bu');
                    if($(this).html().substring(0, cutPos) == deleteInfo.substring(0, cutPos))
                        $(this).html('-');
                })
            });

            $('#edit').on('click', function() {
                order = 2;
                $('#save').tooltip('hide');
                $('.edit_input_div').remove();

                $('#edit_form').append($("<div class='edit_input_div'>1 : <label for='major'>전공(구분)</label><select class='major append1'><option id='default'>-</option></select><label class='label' for='class'>과목</label><select class='class append2'><option id='default'>-</option></select><br></div>"));
                getMajorArray();

                $('#edit_modal').modal();
            });

            $('#save').on('click', function() {
                count = 0;
                $('.input_table tr td').each(function() {
                    dataObject[count] = $(this).html();
                    count++;
                });
                $.ajax({
                    url: '/main/save',
                    type: 'POST',
                    data: dataObject,
                    success: function(data) {
                        if(data.result == 'success') {
                            $('#success_message').html("시간표 저장(업데이트) 완료");
                            $('#success_modal').modal();
                        }
                    }
                });
            })
        }
    });

    $('#edit_add').on('click', function() {
        if ($('#edit_form').find('.class:last').val() != '-' && $('#edit_form').find('.major:last').val() != '-') {
            $('#edit_form').append($("<div class='edit_input_div'>" + order + " : <label for='major'>전공(구분)</label><select class='major append1'><option id='default'>-</option></select><label class='label' for='class'>과목</label><select class='class'><option id='default'>-</option></select><br></div>"));
            getMajorArray();
            order++;
        }
        else {
            if(order == 1) {
                $('#edit_form').append($("<div class='edit_input_div'>" + order + " : <label for='major'>전공(구분)</label><select class='major append1'><option id='default'>-</option></select><label class='label' for='class'>과목</label><select class='class'><option id='default'>-</option></select><br></div>"));
                getMajorArray();
                order++;
            }
            else {
                $('#error_message').html("전공/과목 선택 후 추가해주세요.");
                $('#error_modal').modal();
            }
        }
    });

    var getMajorArray = function() {
        for(var i=0; i<majorArray.length; i++)
            $('.append1').append("<option>" +majorArray[i]+ "</option>");

        $('.major').removeClass('append1');

        $('.major').on('change', function() {
            var currentClassList = $(this).next().next();
            if($(this).val() != '-') {
                $(this).nextAll().addClass('active');
                $('label.active').removeClass('label');
                $.ajax({
                    url: '/main/classInfo',
                    type: 'POST',
                    data: {target: $(this).val()},
                    dataType: 'json',
                    success: function (data) {
                        if (data != null) {
                            currentClassList.children().not('#default').remove();
                            data[0].classInfo.sort(function(a, b) {
                                if(a.name < b.name) return -1;
                                return 1;
                            });
                            for (var i = 0; i < data[0].classInfo.length; i++)
                                currentClassList.append("<option>" + data[0].classInfo[i].name + "</option>");
                        }
                    }
                });
            }
            else {
                $('#error_message').html("과목구분을 선택해 주세요");
                $('#error_modal').modal();
            }
        });
    };

    $('#edit_delete').on('click', function() {
        $('#edit_form').find('div:last').remove();
        if(order>1) order--;
    });

    $('#edit_apply').on('click', function() {
        resultArray = [];
        var overlapClass = [];
        var applyInfo = {};
        var inputError = false;

        $('.major').each(function() {
            // if($(this).val() == "-") inputError = true;
            var isOverlap = true;
            for(var i in applyInfo) {
                if(i == $(this).val())
                    isOverlap = false;
            }
            if(isOverlap)
                applyInfo[$(this).val()] = [];
        });

        if(order == 1) inputError = true;

        $('.class').each(function () {
            var isOverlap = true;
            // if($(this).val() == '-') inputError = true;
            var majorValue = $(this).prev().prev().val();
            for (var i in applyInfo[majorValue]) {
                if (applyInfo[majorValue][i] == $(this).val())
                    isOverlap = false;
            }
            if (isOverlap)
                applyInfo[majorValue].push($(this).val());
        });

        if(!inputError) {
            $.ajax({
                url: '/main/register',
                type: 'POST',
                data: applyInfo,
                success: function (data) {
                    $('#save').tooltip('show');
                    var major = Object.keys(applyInfo);
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < data[i].length; j++) {
                            for (var k = 0; k < applyInfo[major[i]].length; k++) {
                                if (applyInfo[major[i]][k] == data[i][j].name)
                                    resultArray.push(data[i][j]);
                            }
                        }
                    }
                    for (var index in resultArray) {
                        var count = 0;
                        for (var timeCount in resultArray[index].time) {
                            if($('.' + resultArray[index].time[timeCount]).html() == '-')
                                $('.' + resultArray[index].time[timeCount]).html(resultArray[index].name + "<button class='delete'>×</button><br>" + resultArray[index].prof + " / " + resultArray[index].classroom[timeCount]);
                            else {
                                overlapClass.push(resultArray[index].name);
                                count++;
                                if(resultArray[index].time.length == count) {
                                    for(var idx=0; idx<count; idx++)
                                        overlapClass.pop();
                                }
                            }
                        }
                    }

                    $('.input_table tr td').each(function() {
                        var cutPos = $(this).html().indexOf('<bu');
                        for(var overlapIndex in overlapClass) {
                            if(overlapClass[overlapIndex] == $(this).html().substring(0, cutPos))
                                $(this).html('-');
                        }
                    });

                    $('button.delete').on('click', function () {
                        var deleteInfo = $(this).parent().html();
                        $('.input_table tr td').each(function() {
                            var cutPos = $(this).html().indexOf('<bu');
                            if($(this).html().substring(0, cutPos) == deleteInfo.substring(0, cutPos))
                                $(this).html('-');
                        })
                    });
                }
            });
            $('#success_message').html("시간표 업데이트 완료! 저장해주세요.<br> 겹치는 시간표, 과목선택을 안한 경우는 업데이트 되지 않습니다.");
            $('#success_modal').modal();
        }
        else {
            $('#error_message').html("제대로 입력해주세요");
            $('#error_modal').modal();
        }
    });
});
