$(function() {
    var speed = 2000;
    var date_current = +new Date();
    // var slideClass_01 = 's_on';
    // var slideClass_02 = 's_tw';

    // только при наличии слайдера на странице
    if ( $('div').hasClass('slider') ) {
        // фиксируем ширину слайдера
        $(window).on('load resize', windowSize);

        // устанавливаем z-index для изображений
        zStatusImg($('.slide'));

        animateSlide($('.slider .slide:first'), speed);
        // работаем со слайдером
        sliderWork($('.slider'), speed); 
        
        setTimeout(function() {
            autoSlider($('.slider'), speed);
        }, speed * 5);
    }

    // Функция автопрокрутка слайдера
    function autoSlider(parent, speed) {
        if ( +(new Date()) - date_current < speed * 4.5 ) {
            setTimeout(function() {
                autoSlider($('.slider'), speed);
            }, speed * 5);
            return;
        }
        date_current = +new Date();
        var slideClass_01 = 's_on';
        var slideClass_02 = 's_tw';

        var slide_container = parent.find('.cont_slide');
        var slide = parent.find('.slide');
        var control_check = parent.find('.check_control');
        
        var position_max = slide.length;
        
        var slide_current;
        var position_current;
        
        var slide_new;
        var position_new;

        if (!slide) return; 
        slide.each(function() {
            if ( $(this).attr('data-current_slide') === 'true' ) {
                slide_current = $(this);
                position_current = +$(this).attr('data-position');
            }
        });
        position_new = (position_current == position_max -1 ) ? 0 : position_current + 1;
        slide_new = $(slide[position_new]);

        if (!slide_current) return;
        var slide_width = slide_current.width();

        backAnimateSlide(slide_current, speed / 8);
        slide_current.attr('data-current_slide', 'false');

        setTimeout(function() {
            control_check.each(function() {
                if ( $(this).attr('data-position') ==  position_new) {
                    $(this).addClass('select');
                } else {
                    $(this).removeClass('select');
                }
            });

            slide_container.css('left', -slide_width * position_new + 'px');

            animateSlide(slide_new, speed/2);
            slide_new.attr('data-current_slide', 'true');
            date_current = +new Date();
        }, speed / 2);
        setTimeout(function() {
            autoSlider($('.slider'), speed);
        }, speed * 5);
    }
    // Функция по работе со слайдером
    function sliderWork(parent) {
        date_current = +new Date();

        var slideClass_01 = 's_on';
        var slideClass_02 = 's_tw';

        var slide_container = parent.find('.cont_slide');
        var control_check = parent.find('.check_control');

        control_check.each(function() {
            $(this).click(function() {
                var position = $(this).attr('data-position');
                var slide_all = parent.find('.slide');
                var slide_current;
                var slide_new_position;
                slide_all.each(function() {
                    if ( $(this).attr('data-position') == position ) {
                        slide_new_position = $(this);
                    }

                    if ( $(this).attr('data-current_slide') === 'true' ) {
                        slide_current = $(this);
                    }
                });
                
                if (!slide_current) return;
                if (slide_new_position.attr('data-current_slide')  === 'true') return;

                var slide_width = slide_current.width();

                backAnimateSlide(slide_current, speed / 8);
                slide_current.attr('data-current_slide', 'false');

                setTimeout(function() {
                    control_check.each(function() {
                        if ( $(this).attr('data-position') ==  position) {
                            $(this).addClass('select');
                        } else {
                            $(this).removeClass('select');
                        }
                    });

                    slide_container.css('left', -slide_width * position + 'px');

                    animateSlide(slide_new_position, speed/2);
                    slide_new_position.attr('data-current_slide', 'true');
                    date_current = +new Date();
                }, speed / 2);

            });
        });
        // Управление влево/вправо
        parent.find('.control').each(function() {
            $(this).click(function() {

                var elem_type = $(this).attr('class').split(' ')[1];
                
                var slide_all = parent.find('.slide');
                var slide_current; 
                var slide_arr = [];
                var position_max = 0;

                slide_all.each(function() {
                    slide_arr.push($(this));
                    position_max = (position_max > $(this).attr('data-position')) 
                        ? position_max
                        : $(this).attr('data-position');

                    if ( $(this).attr('data-current_slide') === 'true' ) {
                        slide_current = $(this);
                    }
                });
                
                if (!slide_current) return;

                var slide_width = slide_current.width();
                var slide_count = +slide_current.attr('data-position'); 
                
                var slide_new_position = (elem_type === 'right') 
                    ? slide_count + 1 
                    : slide_count - 1;
                if (slide_count == '0') {
                    var slide_new_position = (elem_type === 'right') ? 1 : position_max;
                }  
                 if (slide_count == position_max) {
                    var slide_new_position = (elem_type === 'right') ? 0 : position_max - 1;
                }

                var slide_new;
                slide_all.each(function() {
                    if ( $(this).attr('data-position') == slide_new_position ) {
                        slide_new = $(this);
                    }
                });

                backAnimateSlide(slide_current, speed / 8);
                slide_current.attr('data-current_slide', 'false');
                setTimeout(function() {
                    var slide_new_s = slide_new;
                    var position = slide_new_position;
                    control_check.each(function() {
                        if ( $(this).attr('data-position') ==  position) {
                            $(this).addClass('select');
                        } else {
                            $(this).removeClass('select');
                        }
                    });

                    slide_container.css('left', -slide_width * slide_new_position + 'px');

                    animateSlide(slide_new_s, speed/2);
                    slide_new_s.attr('data-current_slide', 'true');
                }, speed / 2);

            });
        }); 
    }
    // Функция обратной анимации слайдера
    function backAnimateSlide(slide, speed) {
        var slideClass_01 = 's_on';
        var slideClass_02 = 's_tw';

        var parent = slide;
         if (!parent) {
            console.log('Неверная конфигурация слайдера');
            return;
        }
        var windowWidth = $(window).width();
        var sliderHeight = -slide.height();
        var ofsetLeft = -50;
        var ofsetRight = 50;

        var img = parent.find('.img').get().reverse();
        var imgBack = parent.find('.background');

        var cont_elements = slide.find('.wrap');
        var all_elements = cont_elements.children();

        var arr_elem = [];
        all_elements.each(function() {
            if ( !$(this).attr('class').indexOf('img') ) return;
            if ( !$(this).attr('class').indexOf('background') ) return;
            arr_elem.push(
                {
                    type  : $(this).attr('class'),
                    value : $(this),
                }
            );
        });

        for (var i = 0; i < arr_elem.length; i++) {
            var elem = arr_elem[i];

            if (!elem.value) continue;

            if (elem.type === 'header') {
                elem.value.animate(
                    {
                        opacity   : 0,
                        transform : 'translateY('+ sliderHeight + 'px)',
                    },
                    speed,
                    function() {
                        elem.value.css(
                            {
                                transform : 'translateY(0px)',
                            }
                        );
                    }
                );
            }
            if (elem.type === 'slogan') {
                var ofset = ( slide.hasClass(slideClass_01) ) ? ofsetLeft : ofsetRight;
                elem.value.animate(
                    {
                        opacity   : 0,
                        transform : 'translateX('+ ofset + 'px)',
                    },
                    speed,
                    function() {
                        elem.value.css(
                            {
                                transform : 'translateX(0px)',
                            }
                        );
                    }

                );
            }
            if (elem.type === 'text') {
                elem.value.animate(
                    {
                        opacity   : 0,
                    },
                    speed
                );
            }
            if (elem.type === 'link') {
                elem.value.animate(
                    {
                        opacity   : 0,
                        transform : 'translateX('+ windowWidth + 'px)',
                    },
                    speed,
                    function() {
                        elem.value.css(
                            {
                                transform : 'translateX(0px)',
                            }
                        );
                    }
                );
            }
            if (elem.type === 'link_text') {
                elem.value.animate(
                    {
                        opacity   : 0,
                        transform : 'translateX('+ windowWidth + ofsetRight * 4 + 'px)',
                    },
                    speed,
                    function() {
                        elem.value.css(
                            {
                                transform : 'translateX(0px)',
                            }
                        );
                    }
                );
            }
        }

        if (img) {
            $(img).each(function(i) {
                var elem = $(this);

                setTimeout(function() {
                    var last_elem = elem;
                    last_elem.animate(
                        {
                            opacity   : 0,
                            transform : 'translateX('+ windowWidth + ofsetRight + 'px)', 
                        }, 
                        speed,
                        function() {
                            last_elem.css(
                                {
                                    transform : 'translateX(0px)',
                                }
                            );
                        }
                    );

                }, i * speed / 2);
            });
        }
        if ( slide.hasClass(slideClass_02) ) { 
            if (imgBack) {
                imgBack.animate(
                    {
                        transform : 'translateY('+ sliderHeight * 2 + 'px)',
                    },
                    speed / 2,
                    function() {
                        elem.value.css(
                            {
                                transform : 'translateX(0px)',
                            }
                        );
                    }
                );
            }
        }
    }
    // Функция анимации слайдера
    function animateSlide(slide, speed) {
        var slideClass_01 = 's_on';
        var slideClass_02 = 's_tw';

        var parent = slide;
        if (!parent) {
            console.log('Неверная конфигурация слайдера');
            return;
        }
        var windowWidth = $(window).width();
        var sliderHeight = -parent.height();
        var ofsetLeft = -50;
        var ofsetRight = 50;

        var img = parent.find('.img');
        var imgBack = parent.find('.background');

        var cont_elements = parent.find('.wrap');
        var all_elements = cont_elements.children();

        var arr_elem = [];
        all_elements.each(function() {
            if ( !$(this).attr('class').indexOf('img') ) return;
            if ( !$(this).attr('class').indexOf('background') ) return;
            arr_elem.push(
                {
                    type  : $(this).attr('class'),
                    value : $(this),
                }
            );
        });
        if (img) {
            img.each(function(i) {
                var elem = $(this);
                var elemTransform = elem.css('transform').replace(')', '');
                var elemArray     = elemTransform.split(',');

                var elemPositionX = elemArray[elemArray.length - 2];
                var elemPositionY = elemArray[elemArray.length - 1];

                elem.css(
                    {
                        opacity   : 1,
                        transform : 'translateX('+ windowWidth + 'px)',
                    }
                );
                setTimeout(function() {
                    var last_elem = elem;
                    last_elem.animate(
                        {
                            transform : 'translateX('+ elemPositionX + 'px)', 
                        }, 
                        speed 
                    );

                }, i * speed / 6 + (100 * i));
            });
        }

        for (var i = 0; i < arr_elem.length; i++) {
            var elem = arr_elem[i];

            if (!elem.value) continue;
            
            var elemTransform = elem.value.css('transform').replace(')', '');
            var elemArray     = elemTransform.split(',');

            var elemPositionX = elemArray[elemArray.length - 2];
            var elemPositionY = elemArray[elemArray.length - 1];

            elem.value.css('opacity', 0);

            if (elem.type === 'header') {
                elem.value.css(
                    {
                        transform : 'translateY('+ sliderHeight + 'px)',
                    }
                );
            }

            if (elem.type === 'slogan') {
                var ofset = ( slide.hasClass(slideClass_01) ) ? ofsetLeft : ofsetRight;
                elem.value.css(
                    {
                        transform : 'translateX('+ ofset + 'px)',
                    }
                );
            }
            if (elem.type === 'text' && slide.hasClass(slideClass_02)) {
                elem.value.css(
                    {
                        transform : 'translateX('+ ofsetLeft + 'px)',
                    }
                );
            }
            if (elem.type === 'link') {
                var elemTranslateX = ( slide.hasClass(slideClass_01) ) ? windowWidth   : elemPositionX;
                var elemTranslateY = ( slide.hasClass(slideClass_01) ) ? elemPositionY : -sliderHeight;
                
                elem.value.css(
                    {
                        transform : 'translateX('+ elemTranslateX + 'px)',
                        transform : 'translateY('+ elemTranslateY + 'px)',
                    }
                );
            }
            if (elem.type === 'link_text') {
                var elemTranslateX = ( slide.hasClass(slideClass_01) ) ? windowWidth : ofsetLeft;
                elem.value.css(
                    {
                        transform : 'translate('+ elemTranslateX + 'px,' +
                            elemPositionY + 'px)',
                    }
                );
                if (slide.hasClass(slideClass_02)) {
                    var link_text = elem.value;
                    var link_text_positionX = elemPositionX;
                    var link_text_positionY = elemPositionY;

                    setTimeout(function() {
                        var elem = link_text;
                        var elemPositionX = link_text_positionX;
                        var elemPositionY = link_text_positionY;

                        elem.animate(
                            {
                                opacity   : 1,
                                transform : 'translateX('+ elemPositionX + 'px)', 
                                transform : 'translateY('+ elemPositionY + 'px)', 
                            }, 
                            speed
                        );
                    }, speed);
                    continue;
                }
            }

            elem.value.animate(
                {
                    opacity   : 1,
                    transform : 'translateX('+ elemPositionX + 'px)', 
                    transform : 'translateY('+ elemPositionY + 'px)', 
                }, 
                speed
            );
        }

        if ( slide.hasClass(slideClass_02) ) { 
            if (imgBack) {
                imgBack.css(
                    {
                        transform : 'translateY('+ sliderHeight * 2 + 'px)',
                    }
                );
                imgBack.animate(
                    {
                        transform : 'translate(0px, 0px)',
                    },
                    speed
                );
            }
        }
    }
    // Функция адаптации ширины слайдера под ширину экрана
    function windowSize(){
        var slide = $('.slide');

        if (slide) {
            slide.each(function() {
                $(this).css('width', $(window).width() + 'px');
            });
        }
    }
    // Функция установки z-index у изображений в слайдах
    function zStatusImg(cont) {
        cont.each(function() {
            var img = $(this).find('img');

            if (img) {
                img.each(function(i) {
                    if ($(this).hasClass('background')) return;
                    $(this).css('z-index', 10 + i);
                });
            }
        });
    }
});