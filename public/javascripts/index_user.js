/**
 * Created by Sangyoon on 2016-05-27.
 */

$(document).ready(function() {
    $('.logo_index').on('click', function() {
        $('.tab-form').fadeIn(600);
    });

    $('li.tab').on('click', function() {

        $(this).addClass('active');
        $(this).siblings().removeClass('active');

        if($(this).attr('id') == 'li_signup') {
            $('.tab-content #login').hide();
            $('.tab-content #signup').fadeIn(600);
        }
        else {
            $('.tab-content #signup').hide();
            $('.tab-content #login').fadeIn(600);
        }
    });

    $('#form_signup').submit(function () {
        $.ajax({
            url: '/signup',
            type: 'POST',
            data: $(this).serializeArray(),
            success: function (data)  {
                if(data.result == 'success')
                    window.location.href = '/main';
                else {
                    $('#error_message').html("이미 가입된 학번입니다. 로그인해주세요.!");
                    $('#error_modal').modal();
                }
            }
        })
    });
    
    $('#form_login').submit(function () {
        $.ajax({
            url: '/login',
            type: 'POST',
            data: $(this).serializeArray(),
            success: function (data)  {
                if(data.result == 'success') {
                    window.location.href = '/main';
                }
                else {
                    $('#error_message').html("아이디가 존재하지 않거나 비밀번호가 잘못되었습니다.!");
                    $('#error_modal').modal();
                }
            }
        })
    })
});