/**
 * Created by Sangyoon on 2016-06-02.
 */

$(document).ready(function() {
    var order = 2;
    var userArray = [];
    var userNameArray = [];
    var resultInfo = {};
    var overlapCount = {};
    var overlapInfo = {};

    $.ajax({
        type: "GET",
        url: '/main/compare',
        success: function(data) {
            for(var i=0; i<data.length; i++) {
                userArray.push(data[i].stdNum);
                userNameArray.push(data[i].stdName)
            }
        }
    });

    $('.compare_table tr td').each(function () {
        $(this).html("-");
    });

    $('.main-nav li a').on('click', function (e) {

        e.preventDefault();

        if ($(this).attr('href') == '#' + 'tv_compare') {
            $('#tv_compare').find('h2').html("시간표 비교 <button class='btn btn-info' data-toggle='tooltip' data-placement='right' title='CLICK!' id='compare'>비교</button>");

            $('.main-section').hide();
            $('#tv_compare').fadeIn(600);
            $('#compare').tooltip('show');

            $('#compare').on('click', function() {
                order = 2;
                $('#compare').tooltip('hide');
                $('#compare_form').children().remove();
                $('#compare_form').append($("<div class='compare_input_div'><label for='class_info'>1</label><input id='default' class='compare_input append' placeholder='학번(아이디)'/><button class='btn btn-success btn_userCheck'>확인</button><span></span></div>"));
                $('#compare_modal').modal();

                $('.btn_userCheck').on('click', function() {
                    var targetUser = $(this).prev().val();
                    var isUser = false;
                    var result = $(this).next();
                    var checkUser = 0;
                    for(var i=0; i<userArray.length; i++) {
                        if(userArray[i] == targetUser) {
                            isUser = true;
                            checkUser = i;
                        }
                    }
                    if (isUser) {
                        result.html("✔ 확인 (" + userNameArray[checkUser] + ")");
                        result.css('color', 'green');
                    }
                    else {
                        result.html("× 입력하신 사용자의 정보가 존재하지 않습니다");
                        result.css('color', 'red');
                    }
                });
            });
        }
    });

    $('#add').on('click', function() {
        if($('#compare_form').find('span:last').html() != "") {
            if($('#compare_form').find('span:last').html() != "× 입력하신 사용자의 정보가 존재하지 않습니다") {
                if (order != 1)
                    $('#compare_form').append($("<br>"));
                $('#compare_form').append($("<div class='compare_input_div'><label for='class_info'>" + order + "</label><input id='default' class='compare_input append' placeholder='학번(아이디)'/><button class='btn btn-success btn_userCheck'>확인</button><span></span></div>"));
                order++;
            }
            else {
                $('#error_message').html("입력하신 아이디를 확인 후 추가해주세요");
                $('#error_modal').modal();
            }

            $('.btn_userCheck').on('click', function () {
                var result = $(this).next();
                var targetUser = $(this).prev().val();
                var isUser = false;
                var checkUser = 0;
                for (var i = 0; i < userArray.length; i++) {
                    if (userArray[i] == targetUser) {
                        isUser = true;
                        checkUser = i;
                    }
                }
                if (isUser) {
                    result.html("✔ 확인 (" + userNameArray[checkUser] + ")");
                    result.css('color', 'green');
                }
                else {
                    result.html("× 입력하신 사용자의 정보가 존재하지 않습니다");
                    result.css('color', 'red');
                }
            });
        }
        else {
            if($('#compare_form').find('input:last').val() == "") {
                $('#error_message').html("비교할 대상의 학번(아이디)을 입력 후 추가해주세요");
                $('#error_modal').modal();
            }
            else {
                $('#error_message').html("입력하신 학번(아이디)을 확인 후 추가해주세요");
                $('#error_modal').modal();
            }
        }
    });

    $('#delete').on('click', function() {
        $('#compare_form').find('div:last').remove();
        $('#compare_form').find('br:last').remove();
        if(order>1) order--;
    });

    $('#apply').on('click', function() {
        var applyInfo = {};
        var isApply = false;
        var count = 0;
        overlapCount = {};
        overlapInfo = {};
        resultInfo = {};

        $('.compare_input').each(function () {
            var isOverlap = true;
            if(count > 0) isApply = true;

            for(var i=0; i<Object.keys(applyInfo).length; i++) {
                if(applyInfo[i] == $(this).val())
                    isOverlap = false;
            }
            if(isOverlap) {
                applyInfo[count] = $(this).val();
                count++;
            }
        });

        if(isApply) {
            $.ajax({
                type: "POST",
                url: '/main/compare',
                data: applyInfo,
                success: function (data) {
                    $('#compare').tooltip('show');
                    var len = Object.keys(data).length;
                    var count = 0;

                    for (var a = 0; a < 5; a++) {
                        for (var b = 0; b < 21; b++) {
                            overlapCount[b * 5 + a] = 0;
                            overlapInfo[b * 5 + a] = [];
                            for (var c = 0; c < len; c++) {
                                if (data[c].data[a][b] != "-") {
                                    overlapCount[b * 5 + a] += 1;
                                    overlapInfo[b * 5 + a].push(data[c]);
                                }
                            }
                        }
                    }
                    for (var i = 0; i < 5; i++) {
                        for (var j = 0; j < 21; j++) {
                            if (overlapCount[j * 5 + i] == 0) {
                                resultInfo[j * 5 + i] = "POSSIBLE";
                            }
                            else {
                                resultInfo[j * 5 + i] = new Array(overlapCount[j * 5 + i]);
                                for (var k = 0; k < overlapCount[j * 5 + i]; k++) {
                                    var cutPos = overlapInfo[j * 5 + i][k].data[i][j].indexOf('<br>');
                                    var cutResult = overlapInfo[j * 5 + i][k].data[i][j].substring(0, cutPos);
                                    resultInfo[j * 5 + i][k] = "이름 : " + overlapInfo[j * 5 + i][k].creatorName + " / 아이디(학번) : " + overlapInfo[j * 5 + i][k].creator + " / 과목정보 : " + cutResult;
                                }
                            }
                        }
                    }

                    $('.compare_table tr td').each(function () {
                        var proportion = resultInfo[count].length / Object.keys(applyInfo).length;

                        $(this).html("");
                        $(this).css('cursor', 'default');
                        $(this).css('opacity', 1);

                        if (resultInfo[count] == "POSSIBLE") {
                            $(this).html("공강");
                            $(this).attr('id', "");
                            $(this).css('background-color', '#449d44');
                            $(this).css('color', '#000000');
                        }
                        else {
                            for (var i = 0; i < resultInfo[count].length; i++) {
                                $(this).css('background-color', '#ff0000');
                                $(this).css('opacity', 0.3 + proportion);
                                if (resultInfo[count].length < 6) $(this).html($(this).html() + "✔ ");
                                else $(this).html("✔ × " + overlapCount[count]);
                            }
                            $(this).css('cursor', 'pointer');
                            $(this).css('color', '#ffffff');
                            $(this).attr('id', "" + count);
                        }
                        count++;
                        $(this).on('click', function () {
                            if ($(this).html() != '공강') {
                                var id = $(this).attr('id');
                                $('#compare').tooltip('hide');
                                $('.wrap_detail').children().remove();
                                for (var i = 0; i < overlapCount[id]; i++)
                                    $('.wrap_detail').append("<div class='detail_info'><p id='check_mark'>✔  </p><p>" + resultInfo[id][i] + "</p></div></br>")
                                $('.wrap_detail button').remove();
                                $('#compare_detail_modal').modal();
                            }
                        });
                    });
                } // end success function
            })
        }
        else {
            $('#error_message').html("비교 대상이 존재하지 않습니다");
            $('#error_modal').modal();
        }
    });
});

