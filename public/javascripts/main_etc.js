/**
 * Created by Sangyoon on 2016-06-02.
 */
$(document).ready(function() {
    $('.main-nav li a').on('click', function (e) {

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
        }
        else if ($(this).attr('href') == '#' + 'main') {
            top.location.href = '/main'
        }

        else if ($(this).attr('href') == '#' + 'logout') {
            top.location.href = '/logout'
        }
    })
});
