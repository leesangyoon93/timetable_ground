/**
 * Created by Sangyoon on 2016-06-02.
 */
$(document).ready(function() {
    var order = 2;
    var userArray = [];
    var resultInfo = {};
    var overlapCount = {};
    var overlapInfo = {};

    $.ajax({
        type: "GET",
        url: '/main/compare',
        success: function(data) {
            for(var i=0; i<data.length; i++)
                userArray.push(data[i].stdNum);
            userArray.sort();
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
                $('.compare_input_div').remove();
                $('#compare_form').append($("<div class='compare_input_div'><label for='class_info'>1</label><select class='compare_input append'><option id='default'>-</option></select><br></div>"));
                getUserArray();
                $('#compare_modal').modal();
            });
        }
    });

    $('#add').on('click', function() {
        $('#compare_form').append($("<div class='compare_input_div'><label for='class_info'>"+ order +"</label><select class='compare_input append'><option id='default'>-</option></select><br></div>"));
        getUserArray();
        order++;
    });

    var getUserArray = function() {
        for(var i=0; i<userArray.length; i++) {
            $('.append').append("<option>" +userArray[i]+ "</option>");
        }
        $('.compare_input').removeClass('append');
    };

    $('#delete').on('click', function() {
        $('#compare_form').find('div:last').remove();
        if(order>1) order--;
    });

    $('#apply').on('click', function() {
        var applyInfo = {};
        var count = 0;
        overlapCount = {};
        overlapInfo = {};
        resultInfo = {};

        $('.compare_input').each(function () {
            var isOverlap = true;
            for(var i=0; i<Object.keys(applyInfo).length; i++) {
                if(applyInfo[i] == $(this).val())
                    isOverlap = false;
            }
            if(isOverlap) {
                applyInfo[count] = $(this).val();
                count++;
            }
        });

        $.ajax({
            type: "POST",
            url: '/main/compare',
            data: applyInfo,
            success: function(data) {
                $('#compare').tooltip('show');
                var len = Object.keys(data).length;
                var count = 0;

                for (var a = 0; a < 5; a++) {
                    for (var b = 0; b < 8; b++) {
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
                    for (var j = 0; j < 8; j++) {
                        if (overlapCount[j * 5 + i] == 0) {
                            resultInfo[j*5+i] = "POSSIBLE";
                        }
                        else {
                            resultInfo[j*5+i] = new Array(overlapCount[j*5+i]);
                            for (var k = 0; k < overlapCount[j * 5 + i]; k++) {
                                var cutPos = overlapInfo[j * 5 + i][k].data[i][j].indexOf('<br>');
                                var cutResult = overlapInfo[j * 5 + i][k].data[i][j].substring(0, cutPos);
                                resultInfo[j*5+i][k] = "이름 : " + overlapInfo[j * 5 + i][k].creatorName + " / 아이디(학번) : " + overlapInfo[j * 5 + i][k].creator + " / 과목정보 : " + cutResult;
                            }
                        }
                    }
                }

                $('.compare_table tr td').each(function() {
                    var proportion = resultInfo[count].length / Object.keys(applyInfo).length;

                    $(this).html("");
                    $(this).css('cursor', 'default');
                    $(this).css('opacity', 1);

                    if(resultInfo[count] == "POSSIBLE") {
                        $(this).html("Empty");
                        $(this).removeClass('overlap');
                        $(this).css('background-color', '#449d44');
                        $(this).css('color', '#000000');
                    }
                    else {
                        for(var i=0; i<resultInfo[count].length; i++) {
                            $(this).css('background-color', '#ff0000');
                            $(this).css('opacity', 0.3 + proportion);
                            if(resultInfo[count].length<6) $(this).html($(this).html() + "✔ ");
                            else $(this).html("✔ × " + overlapCount[count]);
                        }
                        $(this).css('cursor', 'pointer');
                        $(this).css('color', '#ffffff');
                        $(this).addClass('overlap');
                        $(this).attr('id', "" + count);
                    }
                    count++;
                    $('.compare_table .overlap').on('click', function() {
                        var id = $(this).attr('id');
                        $('#compare').tooltip('hide');
                        $('.wrap_detail').children().remove();
                        for(var i=0; i<overlapCount[id]; i++)
                            $('.wrap_detail').append("<div class='detail_info'><p id='check_mark'>✔  </p><p>" +resultInfo[id][i]+ "</p></div></br>")
                        $('.wrap_detail button').remove();
                        $('#compare_detail_modal').modal();
                    });
                });
            } // end success function
        })
    });
});

