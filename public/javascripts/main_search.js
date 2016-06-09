/**
 * Created by Sangyoon on 2016-06-02.
 */
$(document).ready(function() {
    var getDataObject = {};

    $('.search_table tr td').each(function () {
        $(this).html("-");
    });

    $('.main-nav li a').on('click', function (e) {

        e.preventDefault();

        if ($(this).attr('href') == '#' + 'tv_search') {
            var count = 0;
            $('#tv_search h2').html("TIMETABLE SEARCH <button data-toggle='tooltip' data-placement='right' title='CLICK!' id='search'>검색</button>");

            $('.main-section').hide();
            $('#tv_search').fadeIn(600);
            $('#search').tooltip('show');

            // $('.search_table tr td').each(function () {
            //     $(this).html("");
            // });

            $('#search').on('click', function() {
                $('#search_modal').modal();
            });

            $('#get').on('click', function() {
                $.ajax({
                    type: 'POST',
                    url: '/main/search',
                    data: {target: $('#search_input').val()},
                    dataType: 'json',
                    success: function(data) {
                        if(data != null) {
                            for (var i = 0; i < 5; i++) {
                                for (var j = 0; j < 8; j++)
                                    getDataObject[5 * j + i] = data[i][j];
                            }
                            $('table.search_table tr td').each(function () {
                                $(this).html(getDataObject[count]);
                                count++;
                            })
                        }
                        else {
                            $('#error_message').html("학번을 잘못 입력했거나, 가입하지 않은 사용자입니다.!");
                            $('#error_modal').modal();
                        }
                        $('.search_table tr td button').remove();
                    }
                });

            })
        }
    })
});