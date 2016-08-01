/**
 * Created by Sangyoon on 2016-06-02.
 */
$(document).ready(function() {
    $('.main-nav li a').on('click', function (e) {
        console.log("프로필을 눌렀습니다.");
        e.preventDefault();

        if ($(this).attr('href') == '#' + 'profile') {
            var applyInfo = [];
            var resultInfo = [];

            $('#save').tooltip('hide');
            $('#search').tooltip('hide');
            $('#compare').tooltip('hide');
            $('.wrap_profile').children().remove();
            $.ajax({
                type: 'GET',
                url: 'main/profile',
                success: function(data) {
                    var order = 1;
                    var wrap_profile = $('.wrap_profile');
                    wrap_profile.append("<p>학번(아이디) : " + data.creator + "</p><br>");
                    wrap_profile.append("<p>이름 : " + data.creatorName + "</p><br>");
                    wrap_profile.append("<p> - 수강과목 - </p><br>");
                    for(var i=0; i<5; i++) {
                        for(var j=0; j<21; j++) {
                            var isOverlap = true;
                            var cutPos = data.data[i][j].indexOf('<br>');
                            var cutResult = data.data[i][j].substring(0, cutPos);
                            for(var k in applyInfo) {
                                if(applyInfo[k] == cutResult)
                                    isOverlap = false;
                            }
                            if(isOverlap && data.data[i][j] != '-') {
                                applyInfo.push(cutResult);
                                resultInfo.push(data.data[i][j].replace('<br>', " / "));
                            }
                        }
                    }
                    for(var m in resultInfo) {
                        wrap_profile.append("<p>" + order + " : " + resultInfo[m] + "</p><br>");
                        order++;
                    }
                    $('.wrap_profile button').remove();
                    $('#profile').modal();
                }
            });
            $('#pwChange').on('click', function() {
                $('#change_form').find('input').val("");
                $('#change_modal').modal();

                $('#change').on('click', function() {
                    var changeObject = {'pw1':$('#change_pw1').val(), 'pw2':$('#change_pw2').val(), 'pw3':$('#new_pw').val()};

                    $.ajax({
                        url: '/change',
                        type: 'POST',
                        data: changeObject,
                        success: function(data) {
                            if(data.result == 'success') {
                                $('#change_form').find('input').val("");
                                $('#success_message').html("비밀번호가 정상적으로 변경되었습니다.");
                                $('#success_modal').modal();
                            }
                            else {
                                $('#change_form').find('input').val("");
                                $('#error_message').html("비밀번호가 일치하지 않습니다. 정확하게 입력해주세요.");
                                $('#error_modal').modal();
                            }
                        }
                    })
                })
            })
        }
        else if ($(this).attr('href') == '#' + 'main') {
            top.location.href = '/main'
        }

        else if ($(this).attr('href') == '#' + 'logout') {
            top.location.href = '/logout'
        }
    });
});
