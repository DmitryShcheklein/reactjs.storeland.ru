// Lazy loads elements with default selector as '.lozad'
$(function(){
  lozad().observe();
})
// Fancybox default
$.fancybox.defaults.lang = "ru";
$.fancybox.defaults.i18n = {
    ru: {
        CLOSE: "Закрыть",
        NEXT: "Вперёд",
        PREV: "Назад",
        ERROR: "Контент не может быть загружен. <br/> Пожалуйтста попробуйте ещё раз.",
        DOWNLOAD: "Скачать",
        SHARE: "Поделиться",
        ZOOM: "Увеличить"
    }
};
$.fancybox.defaults.wheel = false;
$.fancybox.defaults.smallBtn = true;
$.fancybox.defaults.animationEffect = 'fade';
$.fancybox.defaults.transitionEffect = false;
$.fancybox.defaults.hideScrollbar = true;
$.fancybox.defaults.toolbar = false;
$.fancybox.defaults.infobar = false;
$.fancybox.defaults.touch = false;
$.fancybox.defaults.buttons = [
    "close"
]
// Noty default
Noty.overrideDefaults({
  layout: "bottomCenter",
  theme: 'sunset',
  timeout: "3000",
  killer: true,
  progressBar: true,
  animation: {
    open: 'animated slideInUp', 
    close: 'animated slideOutDownNew'
  }
});
// jQuery Validation Plugin
$(function(){
  $.validator.setDefaults({
    errorPlacement: function(error, element) {
      error.insertAfter(element);
    }
  });
})
// Owl carousel default
var OWL_DEFAULT = {
    autoWidth: true,
    smartSpeed: 500,
    loop: false,
    lazyLoad: true,
    margin: 12,
    dots: false,
    nav: false,
    navText: ['<span class="owl-icon-wrap"><svg class="owl-icon owl-prev-icon icon"><use xlink:href="/design/sprite.svg#arrow"></use></svg></span>', '<span class="owl-icon-wrap"><svg class="owl-icon owl-next-icon icon"><use xlink:href="/design/sprite.svg#arrow"></use></svg></span>'],
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
}
// Возвращает правильное окончание для слова
function genWordEnd(num, e, m, mm) {
  // Если забыли указать окончания
  if(typeof (e) == "undefined") { e = ''; }
  if(typeof (m) == "undefined") { e = 'а'; }
  if(typeof (mm) == "undefined"){ e = 'oв'; }
  // Если передали пустую строку, вместо цифры
  if(0 == num.length) { num = 0; }
  // Превращаем цифру в правильный INT
  num = GetSum(num).toString();
  // Получаем последний символ цифры
  ch1 = num.substring(num.length-1);
  // Получаем последний символ цифры
  ch2 = num.length == 1 ? 0 : num.substring(num.length-2, num.length-1);
  // Если последняя цифра - 1, вернем единственное число
  if(ch2!=1 && ch1==1)               {return e;}
  // Если последняя цифра - от 2 до 4х , вернем множественное чило из массива с индексом 2
  else if(ch2!=1 && ch1>1 && ch1<=4) {return m;}
  // Если последняя цифра - от 5 до 0 , вернем множественное чило из массива с индексом 3
  else if(ch2==1 || ch1>4 || ch1==0) {return mm;}
}

// Считает сумму  33 599,65 + 2000 - 1910-41,6
function GetSum(val,precision) {
  if(typeof (precision) == "undefined" || precision < 0) { precision = 0; }
  // Возводим в степень точности 10 для округления
  var p = Math.pow(10,precision);  
  try {return Math.round(parseFloat(eval(val.toString().replace(/\s/gi, "").replace(/,/gi, ".")))*p)/p;} catch (e) {return 0;}
}

// Форматирует цену
function number_format(n,e,t,r){var i=n,a=e,o=function(n,e){var t=Math.pow(10,e);return(Math.round(n*t)/t).toString()};i=isFinite(+i)?+i:0,a=isFinite(+a)?Math.abs(a):0;var u,d,f="undefined"==typeof r?",":r,h="undefined"==typeof t?".":t,l=a>0?o(i,a):o(Math.round(i),a),s=o(Math.abs(i),a);s>=1e3?(u=s.split(/\D/),d=u[0].length%3||3,u[0]=l.slice(0,d+(0>i))+u[0].slice(d).replace(/(\d{3})/g,f+"$1"),l=u.join(h)):l=l.replace(".",h);var c=l.indexOf(h);return a>=1&&-1!==c&&l.length-c-1<a?l+=new Array(a-(l.length-c-1)).join(0)+"0":a>=1&&-1===c&&(l+=h+new Array(a).join(0)+"0"),l}
// Добавляет пробел 1000 -> 1 000  /  10000 -> 10 000 
function addSpaces(nStr){
  if(typeof nStr == 'number'){
	  nStr = String(nStr);
  }

  return nStr.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
} 
// Проверка вводимых значений в количестве товара
function keyPress(oToCheckField, oKeyEvent) {
  return oKeyEvent.charCode === 0 || /\d/.test(String.fromCharCode(oKeyEvent.charCode));
}

// Функция определения ширины экрана пользователя
function getClientWidth() {return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;}

// Работа с cookie файлами. 
// Получение переменной из cookie
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Установка переменной в cookie
function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) { 
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];    
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

// Удаление переменной из cookie
function deleteCookie(name, options ) {
  options = options || {};
  options.expires = -1;
  setCookie(name, "", options)
}

// Отправляет ошибку на сервер, для того чтобы служба тех поддержки могла разобраться в проблеме как можно быстрее.
function sendError (desc, page, line) {
  var img=document.createElement('img');
  img.src = 'https://storeland.ru/error/js?desc='+encodeURIComponent(desc)+'&page='+encodeURIComponent(window.location)+'&line=0';
  img.style.position = 'absolute';
  img.style.top = '-9999px';
  try { document.getElementsByTagName('head').appendChild(img) } catch (e){}
  return false;
}

// Превращает поле пароля в текстовое поле и обратно
// @LinkObject - ссылка по которой кликнули
// @InputObject - объект у которого нужно изменить тип поля
function ChangePasswordFieldType (LinkObject, InputObject) {
  var 
    // Ссылка по которой кликнули
    LObject = $(LinkObject),
    // Объект у которого изменяем тип с password на text
    IObject = $(InputObject),
    // Старый текст ссылки
    txtOld = LObject.html(),
    // Новый текст ссылки
    txtNew = LObject.attr('rel');
  // Если объекты не получены, завершим работу функции
  if( LObject.length==0 || IObject.length==0 ) {
    return false;
  }
  // Изменяем у ссылки текст со старого на новый
  LObject.html(txtNew);
  // Старый текст ссылки сохраняем в атрибуте rel 
  LObject.attr('rel', txtOld);
  // Изменяем тип input поля
  if(IObject[0].type == 'text') {
    IObject[0].type = 'password';
  } else {
    IObject[0].type = 'text';
  }
}

// Крутит изображение при обновлении картинки защиты от роботов
function RefreshImageAction(img,num,cnt) {
  if(cnt>13) { return false; }
  $(img).attr('src', $(img).attr('rel') + 'icon/refresh/' + num + '.gif');
  num = (num==6)?0:num;
  setTimeout(function(){RefreshImageAction(img, num+1, cnt+1);}, 50);
}

// Добавление в сравнение и избранное
function addTo() {
  // Добавление/удаление товара на сравнение/избранное через ajax
  $('.add-compare').off('click').on('click',function(){
    // Объект ссылки, по которой кликнули
    var 
      a = $(this)
      ,addUrl = a.attr('data-action-add-url')
      ,delUrl = a.attr('data-action-delete-url')
      ,addTitle = a.attr('data-action-add-title')
      ,delTitle = a.attr('data-action-delete-title')
      ,isAdd = a.attr('data-action-is-add')
      ,pName = a.attr('data-prodname')
      ,pImage = a.attr('data-prodimage')
      ,pPrice = a.attr('data-mod-id-price')
      ,pUrl = a.attr('data-produrl')
      ,pDataid = a.attr('data-id')
      ,pDataprice = a.attr('data-mod-id')
      ,pDataGoodsid = a.attr('data-goodsid')
      ,defText = a.attr('data-default-text')
      ,addText = a.attr('data-add-text')
      ,addTooltip = a.attr('data-add-tooltip')
      ,delTooltip = a.attr('data-del-tooltip')
      requestUrl = a.attr('href')
    ;
    var flag = 0;
    $('#compare-items li.item').each(function(){   
      if($(this).attr('data-id') == pDataid){  
      flag = 1;
      }
      if(flag == 1){
        $(this).remove();
        return false;
      }
      return flag;
    });
    $('.compare #compare-items .empty').hide();
    $('.compare #compare-items .actions').show();
    
    // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
    if( /GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
      requestUrl = requestUrl.replace(new RegExp('GET_GOODS_MOD_ID_FROM_PAGE'), $('.goodsDataMainModificationId').val());
    }
    
    // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
    if(addUrl && delUrl) {
      $.ajax({
        type : "POST",
        dataType: 'json',
        cache : false,
        url : requestUrl,
        data : {
          'ajax_q': 1
        },
        success: function(data) {
          if(flag == 0){   
            $('#compare-items .compare-items-list').prepend(
                "<li class=\"item\" data-id=\"" + pDataid +  "\">" +
                    "<a data-href=\"" + delUrl + "?id=" + pDataprice + "\" data-goods-mod-id=\"" + pDataprice + "\" class=\"remove item-remove\" title=\"Убрать товар из списка сравнения\" onclick=\"removeFromCompare($(this))\"></a>" +
                    "<a href=\"" + pUrl + "\" title=\"" + pName + "\" class=\"product-image\">" + 
                      "<img src=\"" + pImage + "\" alt=\"" + pName + "\" class=\"goods-image-icon\">" +
                    "</a>" + 
                    "<div class=\"product-details\">" + 
                      "<p class=\"product-name\">" + 
                        "<a href=\"" + pUrl + "\" title=\"" + pName + "\">" + pName + "</a>" +
                      "</p>" + 
                      "<span class=\"price RUB\" data-price=\"" + pPrice + "\"><span><span class=\"num\">" + addSpaces(String(pPrice)) + "&nbsp;</span></span></span>"+
                    "</div>"+
                "</li>"
              );
          }
          if('ok' == data.status) {
            if(isAdd == 1) {
              var 
                from = addUrl
                ,to = delUrl
                ,newIsAddStatus = 0
                ,newTitle = delTitle ? delTitle : ''
                ,newTooltip = delTooltip ? delTooltip : ''
              ;
              a.addClass('_added');
              a.find('span').text(addText)
            } else {
              var 
                from = delUrl
                ,to = addUrl
                ,newIsAddStatus = 1
                ,newTitle = addTitle ? addTitle : ''
                ,newTooltip = addTooltip ? addTooltip : ''
              ;
              a.removeClass('_added');
              a.find('span').text(defText)
            }
            
            // Если указано, что изменилось число товаров на сравнении
            if(typeof(data.compare_goods_count) != 'undefined') {
              // Блок информации о том, что есть товары на сравнении
              var sidecount = $('.compare-header .compare-header__counter .num');
              // Если на сравнении больше нет товаров
              // Указываем информацию о новом количестве товаров на сравнении
              // Блок обновления списка сравнения в каталога
              sidecount.animate({opacity: 0,display: "none"},500,function(){
              sidecount.text(data.compare_goods_count);                 
                if(data.compare_goods_count > 0){
                  $('.compare').addClass('have-items');
                  $('.compare #compare-items .empty').hide();
                  $('.compare #compare-items .actions').show();              
                }else{
                  $('.compare').removeClass('have-items');
                  $('.compare #compare-items .empty').show();
                  $('.compare #compare-items .actions').hide();               
                }
              }).animate({display: "inline",opacity: 1} , 500 );
            }
            
            // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
            a.attr('href', a.attr('href').replace(new RegExp(from), to))
             .attr('title', newTitle)
             .attr('data-tooltip', newTooltip)
             .attr('data-action-is-add', newIsAddStatus);
          }
          
          var msgType = ('ok' == data.status) ? 'success' : 'error';
          var message = ('ok' == data.status) ? data.message.replace('сравнения', '<a href="/compare" class="underline">сравнения</a>') : data.message;
          // Если есть функция, которая отображает сообщения пользователю
          if(typeof(Noty) == "function") {
            new Noty({
              text: message,
              type: msgType,
              timeout: "2000"             
            }).show();                
          }

        }
      });
      return false;
    }
  });

  // Добавление/удаление товара на сравнение/избранное через ajax
  $('.add-wishlist').off('click').on('click',function(){
    // Объект ссылки, по которой кликнули
    var 
      a = $(this)
      ,addUrl = a.attr('data-action-add-url')
      ,delUrl = a.attr('data-action-delete-url')
      ,addTitle = a.attr('data-action-add-title')
      ,delTitle = a.attr('data-action-delete-title')
      ,isAdd = a.attr('data-action-is-add')
      ,aText = a.parent().find('.add-wishlist')
      ,pName = a.attr('data-prodname')
      ,pImage = a.attr('data-prodimage')
      ,pUrl = a.attr('data-produrl')
      ,pDataid = a.attr('data-id')
      ,pDataprice = a.attr('data-mod-id')
      ,pPrice = a.attr('data-mod-id-price')
      ,pDataGoodsid = a.attr('data-goodsid')
      ,defText = a.attr('data-default-text')
      ,addText = a.attr('data-add-text')      
      ,addTooltip = a.attr('data-add-tooltip')
      ,delTooltip = a.attr('data-del-tooltip')
      requestUrl = a.attr('href')
    ;
    var flag = 0;
    $('#favorites-items li').each(function(){       
      if($(this).attr('data-id') == pDataid){  
      flag = 1;
      }
      if(flag == 1){
        $(this).remove();
        return false;
      }
      return flag;
    });

    
    // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
    if( /GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
      requestUrl = requestUrl.replace(new RegExp('GET_GOODS_MOD_ID_FROM_PAGE'), $('.goodsDataMainModificationId').val());
    }
    
    // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
    if(addUrl && delUrl) {
      $.ajax({
        type : "POST",
        dataType: 'json',
        cache : false,
        url : requestUrl,
        data : {
          'ajax_q': 1
        },
        success: function(data) {
          if(data.status != 'error'){
            $('.favorites #favorites-items .empty').hide();
            $('.favorites #compare-items .actions').show();            
          }
          
          if(flag == 0 && data.status != 'error'){   
            $('#favorites-items .favorites-items-list').prepend(
              "<li class=\"item\" data-id=\"" + pDataid +  "\">" + 
                "<a data-href=\"" + delUrl + "?id=" + pDataprice + "\" data-goods-mod-id=\"" + pDataprice + "\" class=\"remove item-remove\" title=\"Убрать товар из списка сравнения\" onclick=\"removeFromFavorites($(this))\"></a>"+
                "<a href=\"" + pUrl + "\" title=\"" + pName + "\" class=\"product-image\">"+
                  "<img src=\"" + pImage + "\" alt=\"" + pName + "\" class=\"goods-image-icon\">"+
                "</a>"+
                "<div class=\"product-details\">"+
                  "<p class=\"product-name\">"+
                    "<a href=\"" + pUrl + "\" title=\"" + pName + "\">" + pName + "</a>"+
                  "</p>"+
                  "<span class=\"price RUB\" data-price=\"" + pPrice + "\"><span><span class=\"num\">" + addSpaces(String(pPrice)) + "&nbsp;</span></span></span>"+
                "</div>"+
              "</li>"
            );
          }
          if('ok' == data.status) {
            if(isAdd == 1) {
              var 
                from = addUrl
                ,to = delUrl
                ,newIsAddStatus = 0
                ,newTitle = delTitle ? delTitle : ''
                ,newTooltip = delTooltip ? delTooltip : ''
              ;
              a.addClass('_added');
              a.find('span').text(addText)
            } else {
              var 
                from = delUrl
                ,to = addUrl
                ,newIsAddStatus = 1
                ,newTitle = addTitle ? addTitle : ''
                ,newTooltip = addTooltip ? addTooltip : ''
              ;
              a.removeClass('_added');
              a.find('span').text(defText)
            }
            
            // Если указано, что изменилось число товаров на сравнении
            if(typeof(data.favorites_goods_count) != 'undefined') {
              // Блок информации о том, что есть товары на сравнении
              var sidecount = $('.favorites-header .favorites-header__counter .num');
              // Если на сравнении больше нет товаров
              // Указываем информацию о новом количестве товаров на сравнении
              // Блок обновления списка сравнения в каталога
              sidecount.animate({opacity: 0,display: "none"},500,function(){
              sidecount.text(data.favorites_goods_count);                 
                if(data.favorites_goods_count > 0){
                  $('.favorites').addClass('have-items');
                  $('.favorites #favorites-items .empty').hide();
                  $('.favorites #favorites-items .actions').show();                     
                }else{
                  $('.favorites').removeClass('have-items');
                  $('.favorites #favorites-items .empty').show();
                  $('.favorites #favorites-items .actions').hide();                   
                }
              }).animate({display: "inline",opacity: 1} , 500 );
            }
            
            // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
            a.attr('href', a.attr('href').replace(new RegExp(from), to))
             .attr('title', newTitle)
             .attr('data-tooltip', newTooltip)
             .attr('data-action-is-add', newIsAddStatus);
          }
          
          var msgType = ('ok' == data.status) ? 'success' : 'error';
          var message = ('ok' == data.status) ? data.message.replace('избранное', '<a href="/user/favorites" class="underline">избранное</a>') : data.message;
          // Если есть функция, которая отображает сообщения пользователю
          if(typeof(Noty) == "function") {
            new Noty({
              text: message,
              type: msgType,
              timeout: "2000"             
            }).show();                
          }
          
        }
      });
      return false;
    }
  });
}
// Сравнение товаров
function comparePage(){
  // Сравнение товаров. Инвертирование свойств для сравнения товара
  $('.CompareCheckbox.invert').on('click',function(){
    var checked = true,
    checkboxes = $('.CompareCheckbox:not(.invert)');
    checkboxes.each(function(){
      if($(this).attr('checked')) {
        checked = false;
        return false;
      }
    });
    checkboxes.each(function(){
      $(this).attr('checked', checked);
    });
    $(this).attr('checked', checked);
  });
  
  // Сравнение товаров. Скрытие характеристик товара, которые выделил пользователь
  $('.CompareGoodsHideSelected').on('click',function(){
    $('.CompareGoodsTableTbodyComparisonLine').each(function(){
      var CheckedCheckbox = $(this).find('.CompareCheckbox:checked:not(.invert)');
      if(CheckedCheckbox.length>0) {
        $(this).hide();
      }
    });
    // отменяем выделение характеристик товаров
    $('.CompareCheckbox').attr('checked',false);
    return false;
  });
  
  // Сравнение товаров. Скрытие характеристик товара, которые выделил пользователь
  $('.CompareGoodsHideSelected').on('click',function(){
    $('.CompareGoodsShowAll').show();
    $('.CompareGoodsTableTbodyComparisonLine').each(function(){
      var CheckedCheckbox = $(this).find('.CompareCheckbox:checked:not(.invert)');
      if(CheckedCheckbox.length>0) {
        $(this).hide();
      }
    });
    // отменяем выделение характеристик товаров
    $('.CompareCheckbox').attr('checked',false);
    return false;
  });
  
  // Сравнение товаров. Отображение скрытых характеристик товара
  $('.CompareGoodsShowAll').on('click',function(){
    $(this).hide();
    $('.CompareGoodsTableTbodyComparisonLine:hidden').show();
    return false;
  });
  
  // Сравнение товаров. Верхняя навигация изменение фильтра на отображение всех характеристик товаров
  $('.CompareGoodsTableFilterShowAll').on('click',function(){
    $('.CompareGoodsTableFilterSelected').removeClass('CompareGoodsTableFilterSelected');
    $('.CompareGoodsTableTbodyComparisonLine:hidden').show();
    $(this).addClass('CompareGoodsTableFilterSelected');
    return false;
  });

  // Сравнение товаров. Фильтр в верхней навигации. Отображение только различающихся характеристик товара
  $('.CompareGoodsTableFilterShowOnlyDifferent').on('click',function(){
    $('.CompareGoodsTableFilterSelected').removeClass('CompareGoodsTableFilterSelected');
    $('.CompareGoodsTableTbodyComparisonLine:not(.same)').show();
    $('.CompareGoodsTableTbodyComparisonLine.same').hide();
    $(this).addClass('CompareGoodsTableFilterSelected');
    return false;
  });
  
  // При клике по строке выделяем свойство
  $('.CompareGoodsTableTbodyComparisonLine td:not(.cell)').on('click',function(){
    var CompareCheckbox = $(this).parent().find('.CompareCheckbox');
    if(CompareCheckbox.attr('checked')) {
      CompareCheckbox.attr('checked', false);
    } else {
      CompareCheckbox.attr('checked', true);
    }
  });
  
  function compareGetVars () {
    return new Array(
      $('.CompareGoodsTableTbody tr:first td').length - 1,
      parseInt($('.CompareGoodsTableTbody tr:first td:visible:not(.cell)').attr('class').replace(new RegExp('compare\-td compare\-td\-'), '')),
      parseInt($('.CompareGoodsTableTbody tr:first td:visible:last').attr('class').replace(new RegExp('compare\-td compare\-td\-'), ''))
    );
  }
  
  // Прокрутка списка сравнения вправо
  $('.CompareGoodsTableNext').on('click',function(){
    // Определяем используемые поля
    var data = compareGetVars(); 
    // Изменяем их если это возможно.
    if(data[0] > data[2]) {
      $('.compare-td-' + data[1]).hide();
      $('.compare-td-' + (data[2] + 1)).show();
      if((data[2] + 1) >= data[0]) {
        $(this).addClass('disable');
      }
      if(data[1] + 1 != 1) {
        $('.CompareGoodsTablePrev').removeClass('disable');
      }
    }
    return false;
  });
  
  // Прокрутка списка сравнения влево
  $('.CompareGoodsTablePrev').on('click',function(){
    // Определяем используемые поля
    var data = compareGetVars(); 
    // Изменяем их если это возможно.
    if(1 < data[1]) {
      $('.compare-td-' + (data[1] - 1)).show();
      $('.compare-td-' + data[2]).hide();
      if((data[1] - 1) <= 1) {
        $(this).addClass('disable');
      }
      if(data[2] - 1 != data[0]) {
        $('.CompareGoodsTableNext').removeClass('disable');
      }
    }
    return false;
  });
}

// Показать/скрыть пароль
$(function(){
  $('.show-password').on('click', function(){
    ChangePasswordFieldType(this, $('#sites_client_pass'));
    return false;
  });   
});

// Основные функции
function mainFunctions() {
  // Вызов функции быстрого заказа в корзине
  $('#startOrder, #startOrderTab').on('click', function() {
    startOrder();
    return false;
  });
  // Валидация формы на странице оформления заказа, а так же формы на страницы связи с администрацией
  $("#order-stage-form, .feedback-form, .subscribe-footer__form, .clientForm, .form").validate();  
  $('.subscribe .subscribe__form').validate()
  $('.callback-form').validate()
  $('.offer-form').validate()
  // Возврашаем пользователя на страницу с которой был сделан обратный звонок
  $('.callbackredirect').val(document.location.href);
  // Прокрутка до обратного звонка
  $('.callback-link').on('click',function(e){
     e.preventDefault();
     
     $scrollBlock = $('#offer');
     
     if($scrollBlock.length){
      var offsetTop = $scrollBlock.offset().top
      
      $('html, body').animate({scrollTop: offsetTop}, 500, function () {
        setTimeout(function() {
          $('#offerForm_person').focus();
        }, 0)
      })
     }
  })
  // AJAX обратные звонки
  $('.subscribe .subscribe__form, .callback-form, .offer-form, .subscribe-footer .subscribe-footer__form').on('submit', function(e){
    e.preventDefault();
    
    var $form = $(this);
    var url = $form.prop('action');
    var formData = $form.serializeArray();
    formData.push({name: 'ajax_q', value: 1});
    formData.push({name: 'only_body', value: 1});
    
    if($form.valid()){
      $.getJSON(url, formData, function(d){
        var notyText = (d.status == 'ok') ? d.message : 'Произошла ошибка, попробуйте ещё раз';
        var notyType = (d.status == 'ok') ? 'success' : 'error';
        
        new Noty({
          text: '<div class="noty_content">'+ notyText +'</div>',
          type: notyType
        }).show()
        
        if(d.status == 'ok'){
          $form[0].reset();
        }
      })
    }
    
  })
  // Добавление товара в корзину
  $(document).on('click', '.button._add-cart:not(.quickview)', function() {
    var $btn  = $(this);
    $btn.addClass('_loading')
    if($btn.hasClass('_cart-page')) {
      return true;
    }
    if(!$btn.hasClass('_quick') || $btn.hasClass('_product-view-quick')) {
      $btn.find('span').html('<span class="lds-ellipsis"><span></span><span></span><span></span><span></span></span>')
    }
    if($btn.closest('._min-card').length){
      $btn.addClass('_animated')
    }
    var form = $(this).closest('form');
    if ($(this).hasClass('_quick')) {
      form.attr('rel', 'quick');
    } else {
      var rel = form.attr('rel');
      if (rel) {
        form.attr('rel', rel.replace('quick', ''));
      }
    }
    form.trigger('submit');
    return (false);
  })
  
  // Отправка формы по Ctrl+Enter
  $('form').bind('keypress', function(e){
    if((e.ctrlKey) && ((e.which==10)||(e.which==13))) {$(this).submit();}
  // Отправка данных формы по нажатию на Enter в случае если курсор находится в input полях (В некоторых браузерах при нажатии по enter срабатывает клик по первому submit полю, которое является кнопкой назад. Для этого написан этот фикс)
  }).find('input').bind('keypress', function(e){
    if(((e.which==10)||(e.which==13))) { try{$(this.form).submit();} catch(e){} return false; }
  });
  // Кнопки открывающие меню
  $('.header .header-mobile__button, .catalog-button').on('click',function(e){
    e.preventDefault();
    $('.header-content').addClass('_active');
    // $('body').addClass('modal-open');

    var id = $(this).data('target');
    if (id){      
      $('#' + id).addClass('_visible');
      $('.header-content__button[data-target="' + id +'"]').addClass('_active')
    }
  })
// Кнопки закрывающие меню
  $('.header .header-content__button-close, .header-content .header-content__overlay').on('click',function(e){
    e.preventDefault();
    $('.header-content').removeClass('_active');
    // $('body').removeClass('modal-open');
    $('.header-content__item').removeClass('_visible');
    $('.header-content__button').removeClass('_active');
  })
  $('.header-content__nav').on('click', '.header-content__button', function(){
    var $btn = $(this);
    var id = $btn.data('target');
    
    if($btn.hasClass('_active')){
      return;
    }
    $btn
      .toggleClass('_active')
      .siblings('.header-content__button')
      .removeClass('_active');
      
    $btn.closest('.header-content')
      .find('.header-content__item')
      .removeClass('_visible')
      .filter('[id="'+ id +'"]')
      .addClass('_visible')
  })
  // Дополнительные пункты меню в шапке
  function headerMenu(){
    var overMenuExist = $('.overflowMenu li').length;
    if(overMenuExist){
     $('.overflowMenu li').removeClass('mainnav__replaced');
     $('.mainnav .mainnav__more').remove();
     $('.overflowMenu li').each(function(){
       $('.mainnav .header-nav__list').append($(this));
     })
    }
    $('.header-nav').addClass('mainnav')
    menuWidth = $('.mainnav').width();
    menuCount = $('.header-nav .header-nav__item').length + 1;
    var nextCheck = 0;
    var CurrentWidthCounter = 0;
    for(var i=1; i < menuCount;  i++){
      currentWidth = parseInt(Math.ceil($('.header-nav .header-nav__item:nth-child('+i+')').width())) + 46;
      nextCheck += currentWidth;
      if(nextCheck > menuWidth){
            var a = i;
            for(a;a < menuCount;a++){
              $('.header-nav .header-nav__item:nth-child('+ a +')').addClass('mainnav__replaced');
            }
            $('.mainnav .header-nav__list').append('<li class="header-nav__item mainnav__more dropdown _more-menu"><a class="header-nav__link">Еще...</a></li>');
            $('.mainnav__more').append($('<ul>').addClass('overflowMenu dropdown__body'))
            $('.mainnav .mainnav__replaced').each(function(){
              $('.overflowMenu').append($(this));
            });
            menuMorePosition = parseInt($('.mainnav__more').position().left);
            $('.mainnav .mainnav__more').on('click',function(){
              $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
              $('.overflowMenu').hasClass('active') ? $('.overflowMenu').removeClass('active') : $('.overflowMenu').addClass('active');
              $('.mainnav .header-nav__list').hasClass('active') ? $('.mainnav .header-nav__list').removeClass('active') : $('.mainnav .header-nav__list').addClass('active');
            });
            $(function($){
              $(document).on('mouseup', function (e){
                    var div = $(".overflowMenu.active");
                    var btn = $(".mainnav .mainnav__more");
                    if (!div.is(e.target) && div.has(e.target).length === 0 && !btn.is(e.target)) {
                      div.removeClass('active');
                      btn.removeClass('active');
                      $('.mainnav .header-nav__list').removeClass('active');
                    }
              });
            });
            return false;
      }
    }
  }    
  if(getClientWidth() >= 1200){
    headerMenu();
  }  
  // Основной каталог в шапке
  function headerCatalog() {
    var e,
        $headerCatalog = $(".header-catalog"),
        $catalogBtn = $(".header-catalogBtn"),
        $catalogMenu = $(".header-catalog .header-catalogMenu"),
        $headerSubcatalog = $(".header-subcatalog"),
        $headerOverlay = $(".header-overlay");                          
        $headerCloseBtn = $('.header-closeBtn');
        
        
        $catalogItem = $(".header-sectionsItem.parent");

      var $catalogMenu = $(".header-catalog .header-catalog__menu");
      $catalogMenu.on('click', '.header-catalog__icon', function(evt){        
          evt.preventDefault()
          
          var $arrow = $(this);
          var $link = $arrow.parent();
          
          if($arrow.hasClass('_active')){
            $arrow.removeClass('_active')
            $link.removeClass('_active').next('.sub').slideUp();
          } else {
            $arrow.addClass('_active')
            $link.addClass('_active').next('.sub').slideDown();
          }
                           
      });
  }
  headerCatalog();
  
  function removeActiveLinks(){
    if (getClientWidth() > 992) {
      var $headerCatalog = $('.header-catalogMenu');
      
      $headerCatalog.find('.header-catalogLink, .header-subcatalogTitle, .header-catalogMenu').removeClass('active');
      $headerCatalog.find('.header-subcatalog-third, .sub').show();
    }
  }
  $(window).on('resize', $.debounce(300, removeActiveLinks))      
  // Аккордеон в подвале
  $('.footer-collapse').on('click', '.footer-collapse__title', function(){
    if(getClientWidth() <= 576){
      $(this).toggleClass('_active').next('.footer-collapse__list').slideToggle();
    }
  })
}

// Функции для каталога
function catalogFunctions() {
  // Кастом селект
  $(function(){
    $('.select').styler();
  })

  $('.filters .filters__btn').on('click', function(e){
    $(this).parent().toggleClass('_active')
  })
  // Фильтр по ценам
  var
    // Минимальное значение цены для фильтра
    priceFilterMinAvailable = parseInt($('.goodsFilterPriceRangePointers .min').text())
    // Максимальное значение цены для фильтра
    ,priceFilterMaxAvailable = parseInt($('.goodsFilterPriceRangePointers .max').text())
    // Максимальное значение цены для фильтра
    ,priceSliderBlock = $('#goods-filter-price-slider')[0]
    // Поле ввода текущего значения цены "От"
    ,priceInputMin = $( "#goods-filter-min-price" )
    // Поле ввода текущего значения цены "До"
    ,priceInputMax = $( "#goods-filter-max-price" )
    // Блок с кнопкой, которую есть смысл нажимать только тогда, когда изменялся диапазон цен.
    ,priceSubmitButtonBlock = $( ".goodsFilterPriceSubmit" );
    
  // Изменяет размер ячеек с ценой, т.к. у них нет рамок, есть смысл менять размеры полей ввода, чтобы они выглядили как текст
  function priceInputsChangeWidthByChars() {
    // Если есть блок указания минимальной цены
    if(priceInputMin.length) {
      priceInputMin.css('width', (priceInputMin.val().length*7 + 60) + 'px');
      priceInputMax.css('width', (priceInputMax.val().length*7 + 60) + 'px');
    }
  }
  // Обновить размеры полей ввода диапазона цен
  priceInputsChangeWidthByChars();

  // Слайдер, который используется для удобства выбора цены
  if(priceSliderBlock){
    noUiSlider.create(priceSliderBlock, {
        start: [parseInt($('#goods-filter-min-price').val()), parseInt($('#goods-filter-max-price').val())],
        connect: true,
        range: {
            'min': priceFilterMinAvailable,
            'max': priceFilterMaxAvailable
        }
    });
    priceSliderBlock.noUiSlider.on('slide', function (values, handle) {
      var newVal = parseInt(values[handle]);
  
      /*
      * 0 - left handle
      * 1 - right handle
      */ 
      if (handle) {
          priceInputMax.val( newVal );    
      } else {
          priceInputMin.val( newVal );
      }
      
      priceInputsChangeWidthByChars();
    });
    
    priceSliderBlock.noUiSlider.on('end', function (values, handle) {
      onFiltersChange()
    })
    
    // При изменении минимального значения цены
    priceInputMin.keyup(function(){
      var newVal = parseInt($(this).val());
      if(newVal < priceFilterMinAvailable) {
        newVal = priceFilterMinAvailable;
      }
      priceSliderBlock.noUiSlider.set([newVal, null]);
      priceInputsChangeWidthByChars();
    });
    
    // При изменении максимального значения цены
    priceInputMax.keyup(function(){
      var newVal = parseInt($(this).val());
      if(newVal > priceFilterMaxAvailable) {
        newVal = priceFilterMaxAvailable;
      }
      priceSliderBlock.noUiSlider.set([null, newVal]);
      priceInputsChangeWidthByChars();
    });
  }
  
  function onFiltersChange(){
    // Получаем данные формы, которые будем отправлять на сервер
    var $formData = $('#filters-form').serializeArray();
    // Сообщаем серверу, что мы пришли через ajax запрос
    $formData.push({name: 'ajax_q', value: 1});
    $formData.push({name: 'only_body', value: 1});

    // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
    $.ajax({
      type: "POST",
      cache: false,
      data: $formData,
      success: function(data) {
        var $resultsInput = $(data).find('#goods-filters-results');
        // Если есть результаты
        if($resultsInput.length){
          var value = $resultsInput.val();

          $('.filters .filters__results').show();
          $('.filters .filters__results-input').val(value)
        } else {
          $('.filters .filters__results').hide();
        }
      }
    })
  }
  // Фильтры по товарам. При нажании на какую либо характеристику или свойство товара происходит фильтрация товаров
  $('.filters-inner__item .filters__input').on('change', function(e){
    $(this).attr('checked', $(this).is(':checked') ? 'checked' : false);
    e.preventDefault();
    onFiltersChange();
  });

  // Показать/скрыть категорию фильтра
  $('.filters').on('click', '.filters__title', function(){
    var $title = $(this);
    
    if($title.hasClass('_active')){
      $title.removeClass('_active')
      $title.next('.filters__inner').slideDown();
    } else {
      $title.addClass('_active')
      $title.next('.filters__inner').slideUp();
    }
    
  });
  
  $('.block.filters, .block.viewed').on('click', '.title', function(){
    if( getClientWidth() <= 991) {
      var $title = $(this);
      
      $title.next('.content').addClass('_active');
      $('.overlay').addClass('_active');        
    }
  })
  
  $('.overlay, .content-close-btn').off('click').on('click', function(){
    $('.overlay').removeClass('_active');
    $('.filters .content, .viewed  .content').removeClass('_active');
  })
  
  // Показать все/скрыть
  $('.block.filters').on('click', '.filter-more', function(){
    var $btn = $(this);
    var offsetTop = $btn.siblings('.title').offset().top

    $btn.prev('.filter-inner').toggleClass('crop');
    
    if($btn.hasClass('active')){
      $btn.removeClass('active').find('.filter-moreText').text('Показать все');
      
      if(getClientWidth() > 992){
        $('html, body').animate({scrollTop: offsetTop})
      }
      
    } else {
      $btn.addClass('active').find('.filter-moreText').text('Скрыть');
    }
  }); 
  
  // Ajax вывод товаров списком/таблицей без обновления страницы
  $('.toolbar').on('click', '.view-mode > a', function(){
    var href = document.location.href;
    var dataHref = $(this).data('href').slice(1);
    var browser = null;
    var qwe = navigator.userAgent;
    var separator = (href.indexOf('?') + 1) ? '&' : '?';
    
    if (qwe.search(/MSIE/) != -1) {browser = 'IE'};
    if (href.indexOf('#page-title') != -1) { href = href.replace('#page-title', '')}
    
    var url = (browser === 'IE') ? encodeURI(href + separator + dataHref) : (href + separator + dataHref);

    $('.products-ajax').css('opacity', '.5');
    // $('.products-container').prepend('<span class="content-loading"></span>');
    $.ajax({
      url: url,
      cache: false,
      beforeSend: function(){
        $('.products-container').find('.lds-ellipsis').remove();
        $('.products-container').prepend('<span class="lds-ellipsis pink"><span></span><span></span><span></span><span></span></span>');
      },
      success: function(d){
        $('.products-ajax').parent().html($(d).find('.products-ajax').parent().html());
        lozad().observe();
        $('.view-mode').html($(d).find('.view-mode').html());
        addTo();
        addCart();
        quickView();
        quantity();
        $('.products-ajax').css('opacity', '1');
      }
    });
  }); 

  // Боковое меню сохранение открытой вложенности
  $('.catalog__item._parent .catalog__icon').on('click', function(evt){
      evt.preventDefault()
      
      var $arrow = $(this);
      var $link = $arrow.parent();
      
      if($arrow.hasClass('_active')){
        $arrow.removeClass('_active')
        $link.removeClass('_active').next('.sub').slideUp();
      } else {
        $arrow.addClass('_active')
        $link.addClass('_active').next('.sub').slideDown();
      }
  });
  // Вы смотрели
  $('.recently-viewed .products-grid').owlCarousel({
    items:1,
    lazyLoad: true,
    margin: 15
  })
  // Карусель Избранное / Сравнение
  $('.favorites-goods .products-grid, .compare-goods .products-grid').owlCarousel(
    $.extend(OWL_DEFAULT,  {
      items:6,
      margin: 9, 
      lazyLoad: true,
      responsive: {
        0:{items:1},
        320:{items:2},
        480:{items:3},
        540:{items:3},
        768:{items:5},
        992:{items:5},
        1200:{items:6, nav: true,margin: 15, autoWidth: false}
      }            
    })
  )
}

// Добавление товара в корзину
function addCart() {
  $('.product-view__form, .product__form, .goodsToCartFromCompareForm, .goodsListForm').off('submit').on('submit', function() {
    // Выносим функции из шаблонов
    if ($(this).attr('rel') === 'quick') {
      quickOrder(this);
      return (false);
    }
    if($(this).hasClass('_in-cart')){
      return (true)
    }
    // Находим форму, которую отправляем на сервер, для добавления товара в корзину
    var formBlock = $($(this).get(0));
    
    // Проверка на существование формы отправки запроса на добавление товара в корзину
    if (1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
      alert('Не удалось найти форму добавления товара в корзину');
      return false;
    }
    
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = formBlock.serializeArray();
    // Сообщаем серверу, что мы пришли через ajax запрос
    formData.push({name: 'ajax_q', value: 1});
    // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа
    //formData.push({name: 'fast_order', value: 1});
    // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
    $.ajax({
      type: "POST",
      cache: false,
      url: formBlock.attr('action'),
      data: formData,
      success: function(data) {
          var $btn = $('.button._add-cart._loading').removeClass('_loading _animated');
          
          var $cartMessage = $(data).filter('#cart-message');
          var type = $cartMessage.data('message-type');
          
          // Если товар добавлен
          if(type === 'success'){
            // $btn.addClass('_added').find('span').html('<i class="fal fa-check-circle"></i>');
            
            $.fancybox.close()
            // Включить выключить показ окна по кнопке "В корзину"
            var fancyboxOn = true;

            if(fancyboxOn){
              $.fancybox.open(data,{
                afterShow: function(){
                  addTo();
                  ajaxCartQty();
                  quantity();
                }
              })
            } else {
              new Noty({
                timeout: "3000",
                text: $cartMessage.html(),
                type: type,
                animation: {
                  open: null, 
                  close: null
                }            
              }).show();
            }
            $('.header .cart-header .cart-header__counter .num').html($(data).filter('#newCartCount').html());
            $('.header .cart-header .cart-header__cart-sum').html($(data).filter('#newCartSum').html());            
          } else {
            new Noty({
              timeout: "3000",
              layout: 'center',
              text: $cartMessage.html(),
              type: type,
              animation: {
                open: null, 
                close: null
              }            
            }).show();
            
            // $btn.addClass('_added').find('span').html('<i class="fal fa-times-circle"></i>');            
          }
          
          $btn.removeClass('_added').find('span').html('В корзину')
      }
    });
    return false;
  });
}
// Функция оформления заказа в корзине
function startOrder(){
  var globalOrder = $('#globalOrder'); //объект блока куда будет выводиться форма быстрого заказа
  var closeOrder = $('#closeOrder'); // объект кнопки отмены заказа
  var cartClear = $('#cart-clear'); // объект кнопки отмены заказа
  var cartTable = $('#cart-content'); // объект корзины
  var confirmOrder = $('#confirmOrder'); // объект блока оформления заказа
  var cartFast = $('.cart._fast');
  
  // Если форма уже открыта то ничего не делаем.
  if (globalOrder.css('display') != 'none') {
    // Если блок с формой заказа не скрыт то выходим из функции
    return false;
  }
  // объект кнопки "Заказать"
  var buttonStartOrder = $('#startOrder');  
  // Скрываем кнопку "Очистить корзину"
  cartClear.hide();  
  // Скрываем кнопку "Заказать"
  buttonStartOrder.hide();
  // Скрываем элементы в корзине
  cartTable.hide();
  // Переключаем табы
  $('.cart-tabs .cart-tab').toggleClass('_disabled').toggleClass('_active');
  // Отключаем возможность клика по неактивной кнопке
  $('.cart-tab._disabled').prop('disabled', true)
  
  
const params = new URLSearchParams({'ajax_q': 1,'fast_order': 1});
axios({
  method: 'post',
  url: '/cart/add',
  responseType: 'text',
  data:params
})
  .then(function (response) {
    console.log(response.data)
      const json = JSON.parse(response.data)
      console.log(json)    
  });
  
return ;
  $.ajax({
    type: "POST",
    cache: false,
    url: '/cart/add',
    data: [
      {name: 'ajax_q', value: 1},
      {name: 'fast_order', value: 1}
    ],
    beforeSend: function(){
      // Открываем общий, глобальный блок
      globalOrder.show()
      // показываем прелоадер
      globalOrder.css('position', 'relative')
      globalOrder.css('minHeight', '30px')
      globalOrder.html('<div class="preloader"><span class="content-loading"></span></div>')
    },
    success: function(data) {
      try{
      const json = JSON.parse(data)
      
      console.log(json)        
      } catch (err){console.log(err)}

    }
  });
  return false;
}
// Быстрый заказ
function quickOrder(formSelector) {
  // Находим форму, которую отправляем на сервер, для добавления товара в корзину
  var formBlock = $($(formSelector).get(0));
  // Проверка на существование формы отправки запроса на добавление товара в корзину
  if(1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
    alert('Не удалось найти форму добавления товара в корзину');
    return false;
  }
  // Получаем данные формы, которые будем отправлять на сервер
  var formData = formBlock.serializeArray();
  // Сообщаем серверу, что мы пришли через ajax запрос
  formData.push({name: 'ajax_q', value: 1});
  // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа 
  formData.push({name: 'fast_order', value: 1});
  // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
  $.ajax({
    type    : "POST",
    cache	  : false,
    url		  : formBlock.attr('action'),
    data		: formData,
    success: function(data) {
      $.fancybox.close();
      
      var $fancyContent = $('<div>')
      $fancyContent
        .append($(data).filter('#order-template'))
        .append($(data).filter('#cartFast'))

      $.fancybox.open($fancyContent ,{
        baseClass: "quickOrder",
        afterShow: function(){
          var $btn = $('.button._add-cart._loading').removeClass('_loading');
          $btn.removeClass('_added')
          if($btn.hasClass('_product-view-quick')){
            $btn.find('span').html('Купить в 1 клик');
          }
          else if(!$btn.closest('.product._list')){
            $btn.find('span').html('Купить <br> в 1 клик');
          }
          // Показываем блок итоговой суммы
          $('#cartFast').show();
          // Купон
          coupons();
          // Обновляем счётчики
          $('.header .cart-header .cart-header__counter .num').html($(data).filter('#newCartCount').html());
          $('.header .cart-header .cart-header__cart-sum').html($(data).filter('#newCartSum').html());             
        }
      });
    }
  });    

  return false;
}
// Cкрипты для быстрого заказа
function orderScripts(){
  // Кастом селект  
  if($.fn.styler){
    $('#quickDeliveryCountry').styler();
    $('.quickform .quickform__select-convenient').styler();
  }
  // Выбор диапазона времени доставки
  // Чтобы изменять диапазон со стороны используйте $('.quickform .quickform__select-convenient._period').val('0-2').trigger('refresh')
  $('.quickform select.quickform__select-convenient._period').on('change', function(){
    var convenientArr = $(this).val().split('-')
    
    if(convenientArr.length){
      $('input[name="form[delivery][convenient_time_from]"]').val(convenientArr[0])
      $('input[name="form[delivery][convenient_time_to]"]').val(convenientArr[1])
    }
  })
  // Форма регистрации нового пользователя, при оформлении заказа
  $('.show-password').on('click', function(){
    ChangePasswordFieldType(this, $('#contactPassWord'));
  });
  // При оформлении заказа дадим возможность зарегистрироваться пользователю
  $('#contactWantRegister').on('change', function(){
    if($(this).prop("checked")) {
      $('.quickform__item._password, .contactRegisterNeedElement').show();
      $('#contactEmail, #contactPassWord').addClass('required');
    } else {
      $('.quickform__item._password, .contactRegisterNeedElement').hide();
      $('#contactEmail, #contactPassWord').removeClass('required');
    }
  });
  
  // Выбор даты доставки
  // Документация к плагину //t1m0n.name/air-datepicker/docs/index-ru.html
  $("#deliveryConvenientDate").datepicker({
    // Если true, то при активации даты, календарь закроется.
    autoClose: true,
    // Можно выбрать только даты, идущие за сегодняшним днем, включая сегодня
    minDate: new Date()
  })

  // Разделение поле адрес на Улица, Дом, Квартира
  $(function () {
    $('#quickform .button, #confirmOrder .button').off('click').on('click', function(){
      var $quickDeliveryAddress = $('#quickDeliveryAddress'),
          quickDeliveryAddressStreetValue = $('#quickDeliveryAddressStreet').val(),
          quickDeliveryAddressHomeValue = $('#quickDeliveryAddressHome').val(),
          quickDeliveryAddressFlatValue = $('#quickDeliveryAddressFlat').val();
      
      if($quickDeliveryAddress.length && (quickDeliveryAddressStreetValue !='' || quickDeliveryAddressHomeValue !='' || quickDeliveryAddressFlatValue !='')){
        $quickDeliveryAddress.val('Улица: ' + quickDeliveryAddressStreetValue + ', Дом/Корпус: ' + quickDeliveryAddressHomeValue + ', Квартира: ' + quickDeliveryAddressFlatValue);
      }
      $('#quickform').submit()
      return false;
    });    
  })
  // Валидация формы на странице оформления заказа
  $("#quickform").on('submit', function(){
    // Если форма невалидна не отправляем её на сервер
    if(!$(this).valid()) {
      return false;
    }
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = $(this).serializeArray();
    // Сообщаем серверу, что мы пришли через ajax запрос
    formData.push({name: 'ajax_q', value: 1});
    var $orderBtns = $("#confirmOrder .button")
    //  Аяксом оформляем заказ
    $.ajax({
      type    : "POST",
      dataType: 'json',
      cache    : false,
      url  	  : $(this).attr('action'),
      data		: formData,
      timeout: 3000,
      beforeSend: function () {        
        preloadButton($('#confirmOrder .button'));
        $orderBtns.addClass('_disabled')
      }, 
      success: function(data) {
        // Если заказ был успешно создан
        if( data.status == 'ok' ) {
          window.location = data.location;
        } else if( data.status == 'error' ) {
          new Noty({
            timeout: "7000",
            text: data.message,
            type: "error",
            animation: {
              open: null, 
              close: null
            }            
          }).show()  
          $orderBtns.removeClass('_disabled').html('Оформить заказ');
        } else {
          alert('Во время оформления заказа возникла неизвестная ошибка. Пожалуйста, обратитесь в службу технической поддержки.');
          $orderBtns.removeClass('_disabled').html('Оформить заказ');
        }
        
      },
      error: function(){
        $orderBtns.removeClass('_disabled').html('Оформить заказ')
      }         
    });
    return false;      
  }).validate();
}

// Расчёт доставки и суммы заказа
(function() {
  var CURRENT_DELIVERY;

  function init(ORDER_DELIVERY, DELIVERY_TYPE) {
    if (typeof ORDER_DELIVERY == "undefined") {
        console.error('Не передан массив доставок');
        
        return;
    }
    CURRENT_DELIVERY = ORDER_DELIVERY[0];
    
    changeCartSum();
    
    if(DELIVERY_TYPE === 'select') {
      $('.delivery-select').on('change', function() {
        var deliveryId = $(this).val();
        
        CURRENT_DELIVERY = getCurrentDelivery(deliveryId);
  
        // Если есть варианты оплаты для текущей доставки
        if (CURRENT_DELIVERY.availablePaymentList.length) {
          renderPaymentSelect();
        } else {
          renderPaymentSelect(true);
        }
        // Если нет зон у текущего варианта доставки
        if (CURRENT_DELIVERY.zoneListEmpty) {
            renderDeliveryZone(true)
        } else {
            renderDeliveryZone()
        }
  
        changeCartSum();
      });
      $('.delivery-zone-select').on('change',function() {
        var deliveryId = $(this).data('delivery-id');
        var zoneId = $(this).val();
        
        CURRENT_DELIVERY = getCurrentDelivery(deliveryId);
  
        changeCartSum();
      })
      $('.payment-select').on('change',function() {
        var deliveryId = $(this).data('delivery-id');
        var paymentId = $(this).val();
        CURRENT_DELIVERY = getCurrentDelivery(deliveryId);
  
        if (CURRENT_DELIVERY.availablePaymentList.length) {
          changePaymentSelect(paymentId);
        }
      });
    }
    if(DELIVERY_TYPE === 'radio'){
      function hideDeliveryBlock(name) {
        var deliveryName = name;
        // Настройка Самовывоза
        if(deliveryName === 'Самовывоз' || deliveryName.indexOf('Самовывоз') != -1){
          $('.quickform__row.-adress').hide();
        } else {
          $('.quickform__row.-adress').show();
        }
      }
      $('.delivery-radio').on('change',function(){
        var deliveryId = $(this).val();
        var deliveryName = $(this).data('name');

        CURRENT_DELIVERY = getCurrentDelivery(deliveryId);
        
        // Если нет зон у текущего варианта доставки
        if (CURRENT_DELIVERY.zoneListEmpty) {
          $(this).closest('.quickform-delivery__item').siblings().find('.delivery-zone-radio').prop('checked', false);
        } else {
          $(this).closest('.quickform-delivery__item').find('.delivery-zone-radio:first').prop('checked', true).trigger('change')
        }
        
        // Если есть варианты оплаты для текущей доставки
        if (CURRENT_DELIVERY.availablePaymentList.length) {
          changePaymentRadio(deliveryId);
        } else {
          changePaymentRadio();
        }
        hideDeliveryBlock(deliveryName);
        changeCartSum();
      })
      $('.delivery-zone-radio').on('change',function(){
        var deliveryId = $(this).data('delivery-id');
        var deliveryParentName = $(this).data('parent-name');
        hideDeliveryBlock(deliveryParentName);
        CURRENT_DELIVERY = getCurrentDelivery(deliveryId);
        $(this).closest('.quickform-delivery__item').siblings().find('.delivery-radio').prop('checked', false)
        $(this).closest('.quickform-delivery__item').find('.delivery-radio').prop('checked', true)
        $(this).closest('.quickform-delivery__item').find('.quickform-delivery__price-default .num').text(addSpaces(getCurrentDeliveryPrice()))
        $(this).closest('.quickform-delivery__item').find('.quickform-delivery__price-zone .num').text(addSpaces(getCurrentDeliveryPrice()))
        changePaymentRadio(deliveryId);
        changeCartSum();
      })
    }

    function getCurrentDelivery(id) {
      var currentDelivery;

      $.each(ORDER_DELIVERY, function(i, item) {
        if (String(id) === item.id) {
          currentDelivery = item;
        }
      })
      return currentDelivery;
    }

    function renderDeliveryZone(clearTemplate) {
      var $deliveryZoneSelect = $('.delivery-zone-select');
      var $deliveryZoneWrap = $deliveryZoneSelect.parent();

      $deliveryZoneSelect.data('delivery-id', CURRENT_DELIVERY.id);
      $deliveryZoneSelect.show().html('');

      if (clearTemplate) {
        $deliveryZoneSelect.hide();
        
        return;
      } else {
        $deliveryZoneSelect.show();
      }

      $.each(CURRENT_DELIVERY.zoneList, function(i, item) {
        var $option = $('<option>').val(item.zoneId).text(item.name);
        $deliveryZoneSelect.append($option);
      })
    }

    function renderPaymentSelect(clearTemplate) {
      var $paymentSelect = $('.payment-select');
      var $paymentDescr = $('.payment__desc');

      $paymentSelect.data('delivery-id', CURRENT_DELIVERY.id);
      $paymentSelect.html('');

      if (clearTemplate) {
        var $option = $('<option>').val('').text('Не задан метод оплаты');
        $paymentSelect.append($option);
        $paymentSelect.prop('disabled', true)
        $paymentDescr.hide();
      } else {
        $paymentSelect.prop('disabled', false)
        $paymentDescr.show();
      }

      if (CURRENT_DELIVERY.availablePaymentList.length) {
        $.each(CURRENT_DELIVERY.availablePaymentList, function(i, item) {
          var $option = $('<option>').val(item.id).text(item.name);

          $paymentSelect.append($option);

          if (i == 0) {
            $paymentDescr.html(item.message);
          }
        });
      }
    }

    function changePaymentSelect(paymentId) {
      var $paymentDescrBlock = $('.payment__desc');
      var currentPayment = $.grep(CURRENT_DELIVERY.availablePaymentList, function(item, i) {
        return item.id === String(paymentId)
      })[0]

      $paymentDescrBlock.html(currentPayment.message);
    }
    function changePaymentRadio(deliveryId) {
      if(deliveryId){
        var $currentPaymentBlock = $('.quickform-payment').filter('[data-delivery-id="'+ deliveryId +'"]');
        
        $currentPaymentBlock.show().siblings('.quickform-payment').hide();
        $currentPaymentBlock.find('[name="form[payment][id]"]:first').prop('checked', true)        
      } else {
        $('.quickform-payment').hide().find('[name="form[payment][id]"]').prop('checked', false)
      }
    }
  }

  function changeCartSum() {
    var currentPriceWithoutChange = Number($('.cart__sum .total-sum').data('total-sum'));
    var deliveryPrice = Number(getCurrentDeliveryPrice());
    var discountPrice = Number($('.cart__sum .cart__sum--discount .cart__sum-text-price').data('discount-value'));
    // console.log(currentPriceWithoutChange,deliveryPrice,discountPrice)
    // Заполняем стоимость доставки
    $('.cart__sum .cart__sum--delivery-sum .num').text(addSpaces(deliveryPrice));
    $('.delivery__descr .delivery__price .num').text(addSpaces(deliveryPrice));
    // Описание доставки
    if (CURRENT_DELIVERY) {
        $('.delivery__descr .delivery__text').text(CURRENT_DELIVERY.desc);
    }

    var priceNow = (currentPriceWithoutChange + deliveryPrice) - discountPrice;
    if (priceNow < 0) {
        priceNow = 0;
    }
    $('.cart__sum .total-sum').find('.num').text(addSpaces(Math.ceil(priceNow)));
  }

  function getCurrentDeliveryPrice() {
    function getPriceFromArray(array) {
      var cartSumNow = Number($('.cart__sum .total-sum').data('total-sum'))
      var deliveryPrice = null;
      var maxMorePrice = 0;
  
      $.each(array, function(i, el) {
        // Если сумма заказа сейчас >= чем задана в правиле && текущее правило больше по цене, чем предыдущее
        if (Number(cartSumNow) >= Number(el.sumMorePrice) && Number(maxMorePrice) <= Number(el.sumMorePrice)) {
          deliveryPrice = el.price
          maxMorePrice = el.sumMorePrice
        }
      })
  
      return deliveryPrice;
    }
    // console.log(CURRENT_DELIVERY)
    if (typeof CURRENT_DELIVERY == "undefined") {
      return '0';
    }
    // Если нет зон у текущего варианта доставки
    if (CURRENT_DELIVERY.zoneListEmpty) {
      // Если нет правил расчета стоимости для текущего варианта доставки
      if (CURRENT_DELIVERY.rulesListEmpty) {
        return Math.ceil(CURRENT_DELIVERY.price)
      } else {
        var priceFromArray = getPriceFromArray(CURRENT_DELIVERY.rulesList);
        var deliveryPrice = (priceFromArray !== null) ? priceFromArray : Math.ceil(CURRENT_DELIVERY.price);

        return deliveryPrice;
      }
    } else {
      var zoneId;
      
      if($('.delivery-zone-select').length) {
        zoneId = $('.delivery-zone-select').val();
      }
      if($('.delivery-zone-radio:checked').length){
        zoneId = $('.delivery-zone-radio:checked').val();
      }
      //console.log(CURRENT_DELIVERY.zoneList)
      var zoneList = $.grep(CURRENT_DELIVERY.zoneList, function(item, i) {
        return item.zoneId == zoneId
      })[0];
      
      // console.log(zoneList)
      // Если у этой зоны нет правил
      if (zoneList.zoneRuleListEmpty) {
        return zoneList.price
      } else {
        // Берём подходящую стоимость из массива правил иначе стандартную цену для зоны
        var priceFromArray = getPriceFromArray(zoneList.zoneRuleList);
        var deliveryPrice = (priceFromArray !== null) ? priceFromArray : zoneList.price;
          // console.log('deliveryPrice',deliveryPrice)
        return deliveryPrice;
      }
    }
  }

  window.DeliveryModule = {
      init: init,
      changeCartSum: changeCartSum,
      getCurrentDelivery: function() {
          return CURRENT_DELIVERY;
      }
  }
})();

// Мини корзина в окне AJAX добавления товара
function ajaxCartQty(){
  $(function(){
    $('.cart-ajax-input-qty').off('change').on('change',
      $.debounce(300, function(){
        var $qtyInput = $(this);
        var id = $qtyInput.data('goods-mod-id');
        var qtyInputVal = $qtyInput.val();
        
        if(qtyInputVal < 1) {
          $qtyInput.val(1)
        }
        var formData = $('#cart-ajax-form').serializeArray();
        formData.push({name: 'only_body', value: 1});
    
        $.ajax({
          url: '/cart',
          data: formData,
          cache: false,
          beforeSend: function(){
            preloadShow($('.cart-ajax__product .preloader'))
          },
          success: function(data) {
            var $data = $(data);
            var newQtyInputVal = $data.find('[data-id="' + id + '"] .qty__input').val();
            
            if(qtyInputVal > newQtyInputVal){
              var newQtyInputVal = $data.find('[data-id="' + id + '"] .qty__input').val();    
              $qtyInput.val(newQtyInputVal)

              var $cartMessage = $data.filter('#cart-message');
              var type = $cartMessage.data('message-type');

              new Noty({
                  timeout: "3000",
                  layout: 'center',
                  text: $cartMessage.html(),
                  type: type,
                  animation: {
                    open: null, 
                    close: null
                  }   
              }).show()
  
              return;
            }
            /* Обновляем счётчики */
            $('.header .cart-header .cart-header__counter .num').html($data.filter('#newCartCount').html());
            $('.header .cart-header .cart-header__cart-sum').html($data.filter('#newCartSum').html());               
            /**/
            var newPrice = $data.find('[data-id="' + id + '"]').find('.cart__product-ajax-price').html();
            $('#cart-ajax-form').find('.cart-ajax__product-price').html(newPrice);
            /**/
            preloadHide($('.cart-ajax__product .preloader'))
          }
        })
      })
    );
  })
}

// С этим товаром покупают
function cartRelatedGoods() {
  $(function () {
    $(".pdt-cart-related-goods .products-grid").owlCarousel(
      $.extend(OWL_DEFAULT,
      {
        items: 4,
        responsive: {
          0:{items:1},
          320:{items:1},
          480:{items:1},
          540:{items:2},
          768:{items:3},
          992:{items:4},
          1200:{items:4, nav: true, margin: 15, autoWidth: false}
        }
      }
      ));    
  })
}
// Корзина
function cartAjaxQty(){
  $(function(){
    $('.qty__input').off('change').on('change',
      $.debounce(300, function(){
        var $qtyInput = $(this);
        var id = $qtyInput.closest('.cart__table-row').data('id');
        var qtyInputVal = $qtyInput.val();
        
        if(qtyInputVal < 1) {
          $qtyInput.val(1)
        }
        var formData = $('#cart-content').serializeArray();
        formData.push({name: 'only_body', value: 1});
    
        $.ajax({
          url: '/cart',
          data: formData,
          cache: false,
          beforeSend: function(){
            preloadShow($('#cart-content .preloader'))
          },
          success: function(data){
            // var $data = $(data).find('#cart-content');
            var $data = $(data);
            var count = 0;
            $data.find('.qty__input').each(function(){
              count += Number($(this).val())
            })  
            $('.cart-header .cart-header__counter .num').html(count);
            
            var newQtyInputVal = $data.find('[data-id="' + id + '"] .qty__input').val();
    
            $qtyInput.val(newQtyInputVal)
            
            var $tableRow = $('[data-id="' + id + '"]');
            var newItemPrice = $data.find('[data-id="' + id + '"] .cart__product-ajax-price').html();
            $tableRow.find('.cart__product-ajax-price').html(newItemPrice); 
            
            $('.cart__sum').html($data.find('.cart__sum').html());
            $('.cart-list').html($data.find('.cart-list').html());

            var cartSum = $data.find('.total-sum').data('total-sum') || "0";
            $('.cart-header .cart-header__cart-sum .num').text(addSpaces(cartSum));

            if ($('#quick_form_coupon_code').val()){
              $('#quick_form_coupon_code, .coupon-hidden-input').trigger('change')
            }
            
            DeliveryModule.changeCartSum();

            var $deliveryPriceBlock = $('.cart__sum-row.cart__sum--delivery-sum');
            var deliveryPrice = Number($deliveryPriceBlock.find('.num').text());
            
            if (deliveryPrice != 0){
              $('.cart__sum-row.cart__sum--delivery-sum').show();
            }
            
            var newQtyInputVal = $data.find('[data-id="' + id + '"] .qty__input').val();
            if(Number(qtyInputVal) > Number(newQtyInputVal)){
              var $cartMessage = $data.filter('#cart-message');
              var type = $cartMessage.data('message-type');

              new Noty({
                  timeout: "3000",
                  layout: 'center',
                  text: $cartMessage.html(),
                  type: type,
                  animation: {
                    open: null, 
                    close: null
                  }   
              }).show()
            }
            preloadHide($('#cart-content .preloader'), true)
          }
        })
      })
    )
  })
}

// Очистить корзину
function cartClear() {
 $(function(){
	$('#cart-clear').on('click',function(e){
	  e.preventDefault();
    preloadShow($('#cart-content .preloader'));
	  
	  $.post('/cart/truncate/', function() {
	    $('.header .cart-header .cart-header__cart-sum .num').text("0");
	    $('.header .cart-header .cart-header__counter .num').text("0");
	    
      $('.quick-order,.cart-info .cart-info__wrap').hide();
      $('.pdt-cart-related-goods').hide();
      $('#empty-cart').show();  			    
	  });
	})   
 })  
}
// Удаление товара из корзины
function cartDeleteItem(){
  $(function(){
    $('.cart__delete').off('click').on('click', function(e){
    e.preventDefault();
    
    var $cartDeleteLink = $(this);
    var url = $cartDeleteLink.attr('href');
    
    $.ajax({
      url: url,
      cache: false,
      beforeSend: function(){
        $cartDeleteLink.closest('.cart__table-row').append($('<div class="preloader _opacity"><span class="content-loading"></span></div>'))
      },
      success: function(data){
        var $data = $(data);
        var count = 0;
        
        $data.find('.qty__input').each(function(){
          count += Number($(this).val())
        })
        // Если корзина пуста
        if(!count){
          $('.quick-order,.cart-info .cart-info__wrap').hide();
          $('#empty-cart').show();  
        }
        $cartDeleteLink.closest('.cart__table-row').remove();
        $('.header .cart-header .cart-header__counter .num').html(count);
        
        $('.cart__sum').html($data.find('.cart__sum').html());
        $('.cart-list').html($data.find('.cart-list').html());
        
        var cartSum = $data.find('.total-sum').data('total-sum') || "0";
        $('.cart-header .cart-header__cart-sum .num').text(addSpaces(cartSum));
        if($('#quick_form_coupon_code').val()){
          $('#quick_form_coupon_code, .coupon-hidden-input').trigger('change')
        }
        
        DeliveryModule.changeCartSum();
        preloadHide($('#cart-content .preloader'), true)      
       }      
    })
  })
  })
}

// Отправка купона при оформлении заказа
function coupons() {
  var $submitBtn = $('.coupon .coupon__btn');
  var $cuponInput = $('#quick_form_coupon_code');
  var $resetBtn = $('.coupon .coupon__clear');

  $submitBtn.on('click',function(){
    var val = $cuponInput.val();
    if(!val){
      return;
    }
    
    ajaxCouponCheck();
  });
  
  function ajaxCouponCheck(isResetBtn){
    var val = $cuponInput.val();

    var orderSumDefault = Number($('.cart__sum .total-sum').data('total-sum'));
    
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = $('#order-stage-form').serializeArray();
    formData.push({name: 'ajax_q', value: 1});
    formData.push({name: 'only_body', value: 1});
    formData.push({name: 'form[coupon_code]', value: val});
    
    $.ajax({
      type: "POST",
      cache: false,
      url: '/order/stage/confirm',
      data: formData,
      beforeSend: function(){
        $submitBtn.find('.coupon__btn-icon').remove();
        $submitBtn.addClass('_loading').append('<span class="coupon__btn-icon"><i class="fal fa-circle-notch fa-spin"></i></span>');
        $cuponInput.attr("placeholder", "")
      },
      success: function(data) {
        var $discountBlock = $(data).closest('#order-stage-form').find('tr.discount');
        var discountName = $discountBlock.find('td.name').text();
        var discountPercent = $discountBlock.find('td.percent').html();
        var discountType = $discountBlock.data('discount-type')
        // console.log('discountType', discountType)
        
        function getDiscountType(type){
          switch (type) {
            case 'sum':
              return 'по сумме заказа';
              break;
            case 'cumulative':
              return 'накопительная';
              break;
            case 'coupon':
              return 'по купону';
              break;
            default:
              return '';
          }
        }
        if(!discountPercent){
          discountPercent = '0'
        }
        // Записываем название и размер скидки по купону
        // $('.cart__sum-row.cart__sum--discount .cart__sum-label').html(discountName);
        $('.cart__sum-row.cart__sum--discount .cart__sum-text-price').html(discountPercent);
        $('.cart__sum-row.cart__sum--discount .discount-type').html(getDiscountType(discountType));
        
        // Получаем новую итоговую стоимость заказа
        var $totalBlock = $(data).closest('#order-stage-form').find('tr.total');

        var discount = $totalBlock.find('td.total-sum').data('discount');
        
        // Считаем размер скидки
        var discountRub = String(Math.floor(orderSumDefault) - Math.floor(discount));
        
        $('.cart__sum-row.cart__sum--discount .cart__sum-text-price').data('discount-value', discountRub);
        
        if(discountRub > 0) {
          $('.cart__sum-row.cart__sum--discount').show();
          if(discountType === 'coupon'){
            $submitBtn.addClass('_added').find('.coupon__btn-icon').html('<i class="fal fa-check-circle"></i>');
            $cuponInput.removeClass('error')
          } else {
            // Это не клик по кнопке reset
            if(!isResetBtn){
              $submitBtn.addClass('_not-add').find('.coupon__btn-icon').html('<i class="fal fa-times-circle"></i>');
              $cuponInput.addClass('error');

              return;
            }
            notAddBtn();
          }
          $cuponInput.parent().addClass('_active')
          $submitBtn.removeClass('_loading')
        } else {
          $('.cart__sum-row.cart__sum--discount').hide();
          // Это не клик по кнопке reset
          if(!isResetBtn){
            $submitBtn.addClass('_not-add').find('.coupon__btn-icon').html('<i class="fal fa-times-circle"></i>');
            $cuponInput.addClass('error');

            return;
          }          
          notAddBtn();
        }
        function notAddBtn(){
          $submitBtn.removeClass('_loading _added');
          $submitBtn.find('.coupon__btn-icon').remove();
          $cuponInput.parent().removeClass('_active');
          $cuponInput.attr("placeholder", "Купон очищен");
          $cuponInput.removeClass('error')
        }
        // Пересчитываем итоговую сумму заказа
        DeliveryModule.changeCartSum();
      },
      error: function(){
        console.log("Возникла ошибка: Невозможно отправить форму купона.");
      }
    });
  }
  
  $cuponInput.on('change', function(){
      var $input = $(this);
      $('.coupon-hidden-input').val($input.val())
      
      if($input.val()) {
        $input.next('.coupon__clear').addClass('_active')
      } else {
        $input.next('.coupon__clear').removeClass('_active')
      }
      
      ajaxCouponCheck()
    }
  )
  $resetBtn.on('click', function(){
    $(this).toggleClass('_active')
    $cuponInput.parent().removeClass('_active');
    $cuponInput.val('')
    $('.coupon-hidden-input').val('')
    ajaxCouponCheck(true)
  })
}

// Получение центральной разметки страницы (для быстрого просмотра)
$.fn.getColumnContent = function() {
  var $block = ($(this).length && $(this).hasClass('product-wrap') ? $(this).filter('.product-wrap') : $('div.product-wrap:eq(0)'));
  $block.find('.fancybox-close-small').show();
  return $block;
}
// Функция Быстрого просмотра товара
function quickView() {

// Быстрый просмотр товара
$(function(){
  // При наведении на блок товара загружаем контент этого товара, который будет использоваться для быстрого просмотра, чтобы загрузка происходила быстрее.
  $('.products-grid .product').mouseover(function() {
    // Если в блоке нет ссылки на быстрый просмотр, то не подгружаем никаких данных
    var link = $(this).find('a.quickview');
    if(link.length < 1) {
      return true;
    }
    // Если массив с подгруженными заранее карточками товара для быстрого просмотра ещё не создан - создадим его.
    if(typeof(document.quickviewPreload) == 'undefined') {
      document.quickviewPreload = [];
    }
    var href = link.attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    // Если контент по данной ссылке ещё не загружен
    if(typeof(document.quickviewPreload[href]) == 'undefined') {
      // Ставим отметку о том, что мы начали загрузку страницы товара
      document.quickviewPreload[href] = 1;
      // Делаем запрос на загрузку страницы товара
      $.get(href, function(content) {
        // Сохраняем контент, необходимый для быстрого просмотра в специально созданный для этого массив
        document.quickviewPreload[href] = $(content).getColumnContent();
      })
      // Если загрузить страницу не удалось, удаляем отметку о том, что мы подгрузили эту страницу
      .fail(function() {
        delete document.quickviewPreload[href];
      });
    }
  });
});
}
// Действие при нажатии на кнопку быстрого просмотра.  
$(function(){
  $(document).on('click', 'a.quickview', function() {
    var $link = $(this);
    $link.find('span').html('<span class="lds-ellipsis"><span></span><span></span><span></span><span></span></span>')
    var href = $(this).attr('href');    
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    
    quickViewShow(href, $link);
    return false;
  });
});
// Быстрый просмотр товара
function quickViewShow(href, $link) {
    $.get(href, function(content) {
      $.fancybox.close();
      fancyboxShow($(content).getColumnContent())
    })
    .fail(function() {
      alert("Не удалось загрузить быстрый просмотр");
    })
    .always(function(){
      $link.find('span').html('Быстрый просмотр')
    })
    function fancyboxShow(content){
        $.fancybox.open(content, {
          baseClass: 'quickView',
          beforeShow: function(){
            goodsImage()          
          },
          afterShow: function() {
            goodsImage();
            goodsMods(true);
            addCart();
            quantity();
            initTabs();
            goodspage();
            addTo();
            lozad().observe();
          }        
        })    
    }
}
// Функция Быстрого просмотра товара c модификацией
function quickViewMod() {
  // Действие при нажатии на кнопку в корзину товара c модификацией
  $(document).ready(function() {
    $(document).on('click', 'a._quickviewmod', function() {
      if ($(this).closest('.product._min-card').length){
        $(this).addClass('_animated')
      }
      $(this).find('span').html('<span class="lds-ellipsis"><span></span><span></span><span></span><span></span></span>')      
      var href = $(this).attr('href');
      href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
      quickViewShowMod(href, $(this));
      return false;
    });
  });
}
// Быстрый просмотр товара с модификацией
function quickViewShowMod(href,  $el) {
  $.get(href, function(content) {
    $.fancybox.close();
    fancyboxShow($(content).find('.product-view__order-wrap'))
  })
  .fail(function() {
    alert("Не удалось загрузить выбор модификаций");
  })
  .always(function(){
    $el.removeClass('_animated').find('span').html('В корзину')
  })
  function fancyboxShow(content){
      $.fancybox.open(content, {
        baseClass: 'quickViewMod product-view',
        beforeShow: function(){
          $('.product-modifications select[id^="select-mod"]').hide();  
        },
        afterShow: function() {
          $('.quickViewMod').addClass('_showed')
          if ($el.hasClass('_cart-page')) {
            $('.product-view__form').addClass('_in-cart')            
          }
          goodspage();      
          goodsMods(true);
          addCart();
          quantity();
        }        
      })    
  }
}

// Функция + - для товаров
function quantity() {
  $('.qty__btn.qty__btn--plus').off('click').on('click',function(){
    var 
      quantity = $(this).parent().find('.qty__input'),
      currentVal = parseInt(quantity.val());
    if (!isNaN(currentVal)){
      quantity.val(currentVal + 1);
      quantity.trigger('change');
    }
    return false;
  });
  $('.qty__btn.qty__btn--minus').off('click').on('click',function(){
    var 
      quantity = $(this).parent().find('.qty__input'),
      currentVal = parseInt(quantity.val());
    if (!isNaN(currentVal) && !(currentVal <= 1) ){
      quantity.val(currentVal - 1);
      quantity.trigger('change');
    }
    return false;
  });
  // Если вводят 0 то заменяем на 1
  $('.qty .qty__input').off('change').on('change',function(){
    if($(this).val() < 1){
      $(this).val(1); 
    }
  });
}

// Cчётчик скидки(в карточке товара) старой и новой цены
function calcDiscount(){
  function getDiscountObj (priceNow, priceOld){
    if(priceOld) {
      return {
        price: Math.ceil(priceOld - priceNow),
        percent: Math.ceil((priceNow * 100) / priceOld)
      }
    }
  }
  var $discountBlock = $('.discount-block');
  var priceNow = $discountBlock.data('now-price');
  var priceOld = $discountBlock.data('old-price');
  var discountObj = getDiscountObj(priceNow, priceOld);
  
  if(discountObj){
    $discountBlock.find('.discount-block__percent-num').text(discountObj.percent);
    $discountBlock.find('.discount-block__price-num').text(discountObj.price);
    $discountBlock.fadeIn();
  } else {
    $discountBlock.fadeOut();
    $discountBlock.find('.discount-block__percent-num').text(0);
    $discountBlock.find('.discount-block__price-num').text(0);    
  }
}
/* Скрипты для карточки товара */
function goodspage() {
  // Модификация селектов  
  $('.product-modifications select[id^="select-mod"]').styler({
    onFormStyled: function () {      
      $('.product-modifications select[id^="select-mod"]').addClass('_visible')
    }
  });  
  // Валидация отзывов
  $('.goods-opinion-form').validate();

  // Добавление отзыва о товаре. Рейтинг
  if(typeof($('.goods-opinion-form__rating').rating) == "function" ) {
    $('.goods-opinion-form__rating input').rating({
      split: 2,
      required: true
    });
  }

  // Иконка для обновления изображение капчи
  $('.goods-opinion-form__captcha-refresh-button').on('click',function(){
    RefreshImageAction(this,1,1);
    $('.goods-opinion-form__captcha-img').attr('src',$('.goods-opinion-form__captcha-img').attr('src') + '&rand' + Math.random(0,10000));
    return false;
  });

  // AJAX отправка отзыва
  $('.goods-opinion-form__submit-button').on('click',function(){
    var $btn = $(this);
    // Находим форму, которую отправляем на сервер, для добавления товара в корзину
    var $form =  $('.goods-opinion-form');
    // return;
    if($form.valid()){
      // Получаем данные формы, которые будем отправлять на сервер
      var formData = $form.serializeArray();
      // Сообщаем серверу, что мы пришли через ajax запрос
      formData.push({name: 'ajax_q', value: 1});
      
      $.ajax({
        type: "POST",
        cache: false,
        url: $form.attr('action'),
        data: formData,
        beforeSend: function(){
          $btn.addClass('_loading').html('<span class="lds-ellipsis pink"><span></span><span></span><span></span><span></span></span>'); 
        },
        success: function(data) {
          var REVIEWS_INDEX = 5;
          var $noticeBlock = $(data).find('#goods-opinion-notice');
          
          if($noticeBlock.data('opinion-type') === 'success') {
            $('.goods-opinion .goods-opinion__body').show()
            $('.product-view__rating').html($(data).find('.product-view__rating').html())
            $('.goods-opinion-counter').html($(data).find('.goods-opinion-counter').html())
            $('.goods-opinion-list').html($(data).find('.goods-opinion-list').html())
            var opinionsCount = $('.goods-opinion-list').find('.opinion-item').length;
            if(opinionsCount > REVIEWS_INDEX){
              $('#goods-opinion__more-button').show();
            }
            
            $form.trigger('reset')
          } else {
            $('.goods-opinion-form__captcha-refresh-button').trigger('click');
          }
          new Noty({
            timeout: "7000",
            text: '<div class="noty_content">' + $noticeBlock.text() +'</div>',
            type: $noticeBlock.data('opinion-type')
          }).show()
          
          $btn.removeClass('_loading').html($btn.data('default-text'));
        }
      });
    
      return false
    }
  })
  // Показать больше отзывов
  $('#goods-opinion__more-button').on('click',function(){
    var REVIEWS_INDEX = 5;
    var opinionsCount = $('.opinion-item').length;
    $('.opinion-item').not(':visible').slice(0, REVIEWS_INDEX).show();
    var opinionVisibleCountNow = $('.opinion-item').not(':visible').length;
    
    if(!opinionVisibleCountNow) {
      $(this).hide()
    }
    return false;
  })
  // Доставка кнопка "Подробнее"
  $('.goods-delivery .goods-delivery__title').on('click',function(){
    var $btn = $(this).find('.goods-delivery__more-btn');
    
    $(this).parent().find('.goods-delivery__content').toggle();
    
    if($btn.hasClass('_active')){
      $btn.html('<svg class="icon"><use xlink:href="/design/sprite.svg#plus-icon"></use></svg>').removeClass('_active');
      return;
    }
    
    $btn.addClass('_active').html('<svg class="icon"><use xlink:href="/design/sprite.svg#minus-icon"></use></svg>')
  })
  
  // Сопутствующие | С этим товаром смотрят
  $(".pdt-related-views .products-grid,  .pdt-related .products-grid").owlCarousel(
  $.extend(OWL_DEFAULT,
  {
    items: 4,
    responsive: {
      0:{items:1},
      320:{items:1},
      480:{items:1},
      540:{items:2},
      768:{items:3},
      992:{items:4},
      1200:{items:4, nav: true, margin: 15, autoWidth: false}
    }
  }
  ));  
}

// Скрипты модификации товара
function goodsMods(inFancybox){
  // Функция собирает свойства в строку, для определения модификации товара
  function getSlugFromGoodsDataFormModificationsProperties(obj) {
    var properties = new Array();
    $(obj).each(function(i){
      properties[i] = parseInt($(this).val());
    });
    return properties.sort(function(a,b){return a - b}).join('_');
  }
   
  var 
    // Запоминаем поля выбора свойств, для ускорения работы со значениями свойств
    goodsDataProperties = (inFancybox) ? $('.fancybox-content form.product-view__form select[name="form[properties][]"]') : $('form.product-view__form select[name="form[properties][]"]'),
    // Запоминаем блоки с информацией по модификациям, для ускорения работы
    goodsDataModifications = (inFancybox) ? $('.fancybox-content div.product-modifications__list') : $('div.product-modifications__list');
    
  // Обновляет возможность выбора свойств модификации, для отключения возможности выбора по характеристикам модификации которой не существует.
  function updateVisibility (y) {
    // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
    goodsDataProperties.each(function(j){
      // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
      if( j != y ) {
        // Проходим по всем значениям текущего свойства модификации товара
        $(this).find('option').each(function(){
          // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
          var checkProperties = new Array();
          $(goodsDataProperties).each(function(i){
            checkProperties[i] = parseInt($(this).val());
          });
          // Пытаемся найти модификацию соответствующую выбранным значениям свойств
          checkProperties[j] = parseInt($(this).attr('value'));
          // Собираем хэш определяющий модификацию по свойствам
          slug = checkProperties.sort(function(a,b){return a - b}).join('_');
          // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
          if(!goodsDataModifications.filter('[rel="'+slug+'"]').length) {
           $(this).attr('disabled', true);
          // Если выбрав данное значение свойства товара можно подобрать модификацию, то выделяем вариант выбора как доступный.
          } else {
            $(this).attr('disabled', false);
          }
        });
      }
    });
  }
  // Обновляем возможность выбора модификации товара по свойствам. Для тех свойств, выбор по которым не возможен, отключаем такую возможность.
  // Проверяем возможность выбора на всех полях кроме первого, чтобы отключить во всех остальных варианты, которые не возможно выбрать
  updateVisibility (0);
  // Проверяем возможность выбора на всех полях кроме второго, чтобы в первом поле так же отключилась возможность выбора не существующих модификаций
  updateVisibility (1);

  // Изменение цены товара при изменении у товара свойства для модификации
  goodsDataProperties.each(function(){
    $(this).on('change', function(){
      var slug = getSlugFromGoodsDataFormModificationsProperties(goodsDataProperties),
        modificationBlock             = $('.product-modifications__list[rel="'+slug+'"]'),
        modificationId                = parseInt(modificationBlock.find('[name="id"]').val()),
        modificationArtNumber         = modificationBlock.find('[name="art_number"]').val(),
        modificationPriceNow          = parseInt(modificationBlock.find('[name="price_now"]').val()),
        modificationPriceNowFormated  = modificationBlock.find('.price_now_formated').html(),
        modificationPriceOld          = parseInt(modificationBlock.find('[name="price_old"]').val()),
        modificationPriceOldFormated  = modificationBlock.find('.price_old_formated').html(),
        modificationRestValue         = parseFloat(modificationBlock.find('[name="rest_value"]').val()),
        modificationDescription       = modificationBlock.find('.description').html(),
        modificationMeasureId         = parseInt(modificationBlock.find('[name="measure_id"]').val()),
        modificationMeasureName       = modificationBlock.find('[name="measure_name"]').val(),
        modificationMeasureDesc       = modificationBlock.find('[name="measure_desc"]').val(),
        modificationMeasurePrecision  = modificationBlock.find('[name="measure_precision"]').val(),
        modificationIsHasInCompareList= modificationBlock.find('[name="is_has_in_compare_list"]').val(),
        modificationGoodsModImageId   = modificationBlock.find('[name="goods_mod_image_id"]').val(),
        goodsModificationId           = $('.goodsDataMainModificationId'),
        goodsPriceNow                 = $('.goodsDataMainModificationPriceNow'),
        goodsPriceOld                 = $('.goodsDataMainModificationPriceOld'),
        goodsAvailable                = $('.product-view__available'),
        goodsAvailableTrue            = goodsAvailable.find('.product-view__available-item').filter('._available'),
        goodsAvailableFalse           = goodsAvailable.find('.product-view__available-item').filter('._not-available'),
        goodsAvailableAddCart         = $('.product-view__actions._add-to-form .product-view__add-buttons'),
        goodsArtNumberBlock           = $('.product-view__art-number'),
        goodsArtNumber                = goodsArtNumberBlock.find('span'),
        goodsCompareAddButton         = $('.goodsDataCompareButton.add'),
        goodsCompareDeleteButton      = $('.goodsDataCompareButton.delete'),
        goodsModDescriptionBlock      = $('.product-modifications__description'),
        goodsModEmpty      = $('.product-view__mod-empty');
       
      // Изменяем данные товара для выбранных параметров. Если нашлась выбранная модификация
      if(modificationBlock.length) {
        // Цена товара
        goodsPriceNow.html(modificationPriceNowFormated);
        $('.discount-block').data('now-price', modificationPriceNow);
        // Старая цена товара
        if(modificationPriceOld > modificationPriceNow) {
          goodsPriceOld.show().html(modificationPriceOldFormated);
          $('.discount-block').data('old-price', modificationPriceOld);
        } else {
          goodsPriceOld.hide().html('');
          $('.discount-block').data('old-price', 0);
        }
        // Считаем скидку в блоке
        calcDiscount();
        // Есть ли товар есть в наличии
        if(modificationRestValue>0) {
          goodsAvailableTrue.show();
          goodsAvailableFalse.hide();
          goodsAvailableAddCart.show();
          goodsModEmpty.hide();
        // Если товара нет в наличии
        } else {
          goodsAvailableTrue.hide();
          goodsAvailableFalse.show();
          goodsAvailableAddCart.hide();
          goodsModEmpty.show();
        }
        // Если товар есть в списке сравнения
        if(modificationIsHasInCompareList>0) {
          goodsCompareAddButton.hide();
          goodsCompareDeleteButton.show();
        // Если товара нет в списке сравнения
        } else {
          goodsCompareAddButton.show();
          goodsCompareDeleteButton.hide();
        }
        // Покажем артикул модификации товара, если он указан
        if(modificationArtNumber.length>0) {
          goodsArtNumberBlock.show();
          goodsArtNumber.html(modificationArtNumber);
        // Скроем артикул модификации товара, если он не указан
        } else {
          goodsArtNumberBlock.hide();
          goodsArtNumber.html('');
        }
        // Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
        if(modificationDescription.length > 0) {
          goodsModDescriptionBlock.show().html('<div>' + modificationDescription + '</div>');
        } else {
          goodsModDescriptionBlock.hide().html();
        }
        // Идентификатор товарной модификации
        goodsModificationId.val(modificationId);
        // Меняет главное изображение товара на изображение с идентификатором goods_mod_image_id
        function changePrimaryGoodsImage(goods_mod_image_id) {
          // Если не указан идентификатор модификации товара, значит ничего менять не нужно.
          if(1 > goods_mod_image_id) {
            return true;
          }
          var 
            // Блок с изображением выбранной модификации товара
            goodsModImageBlock = $('.image-list [data-id="' + parseInt(goods_mod_image_id) + '"'),
            // Блок, в котором находится главное изображение товара
            MainImageBlock = $('.product-view__main-image'),
            // Изображение модификации товара, на которое нужно будет изменить главное изображение товара.
            MediumImageUrl = goodsModImageBlock.find('a').attr('href'),
            // Главное изображение, в которое будем вставлять новое изображение
            MainImage = MainImageBlock.find('img'),
            // В этом объекте хранится идентификатор картинки главного изображения для коректной работы галереи изображений
            MainImageIdObject = MainImageBlock.attr('data-id')
          ;
          
          // Если изображение модификации товара найдено - изменяем главное изображение
          MainImage.attr('src', MediumImageUrl);
          MainImageBlock.find('a').attr('href', MediumImageUrl);
          // Изменяем идентификатор главного изображения
          MainImageBlock.attr("data-id", parseInt(goods_mod_image_id));
          return true;
        }
        // Обновляем изображние модификации товара, если оно указано
        changePrimaryGoodsImage(modificationGoodsModImageId);        
      } else {
        // Отправим запись об ошибке на сервер
        sendError('no modification by slug '+slug);
        alert('К сожалению сейчас не получается подобрать модификацию соответствующую выбранным параметрам.');
      }
    });
  });  
}
// Скрипты для изображения товара
function goodsImage() {
  // Изображения товара
  $(function(){
    $('.image-list').not('.slick-initialized').slick({
      slidesToShow: 3,
      slidesToScroll: 3,
      dots: false,
      arrows: false,
      vertical: true,
      verticalSwiping: true,
      // centerMode: false,
      focusOnSelect: true,
      infinite: false
    });
  })
}
// Инициализация табов на странице товара
function initTabs() {
  // Блок в котором находятся табы
  var tabBlock = $('.product-tabs');
  if(!tabBlock.length) {
    return false;
  }
  // По умолчанию делаем отметку о том что активного таба не найдено
  var isFind = 0;
  tabBlock.find('.tabs-list__item-link').each(function(i){
    // Если нашёлся активный там
    if($(this).hasClass('_active')) {
      // Инициализируем найденный таб
      $(this).click();
      // Ставим отметку, о том что не нужно инициализировать первый таб на странице
      isFind = 1;
    }
  });
  
  // Если не найдено ни одного таба с отметкой о том что он активен
  if(!isFind) {
    // Ставим активным первый таб на странице.
    var tab = $('.tabs-list .tabs-list__item .tabs-list__item-link').attr('id').slice(-1);
    tabSwitch(tab, true);
  }
  // Проверяет хэш и если по нему была открыта вкладка, то эта функция автоматически откроет её.
  checkTabHash();  
  // Биндим изменение хэша - проверка какой таб нужно открыть.
  $(window).bind('hashchange', function() { checkTabHash(); });  
}

// Проверяет хэш, переданый пользователем и открывает соответствующий раздел
function checkTabHash() {
  // Определяем текущий хэш страницы
  var hash = window.location.hash.substr(1);
  if(hash == 'goodsDataOpinionAdd') {
    hash = 'show_tab_4';
  }
  if(!hash.length || hash.indexOf('show_tab_') == -1) {
    return false;
  }
  // Открываем тот таб, который был указан в hash-е
  tabSwitch(hash.replace("show_tab_", ''))
}

// Выбор вкладки на странице товара
function tabSwitch(nb, noScroll) {
  var tabBlock = $('.product-tabs');
  tabBlock.find('.tabs-list__item-link').removeClass('_active');
  tabBlock.find('.tabs-content__item').hide();
  $('#tab_' + nb).addClass('_active');
  $('#content_' + nb).show();
  if('#goodsDataOpinionAdd' != document.location.hash && !noScroll) {
    // Записываем в хэш информацию о том какой таб сейчас открыт, для возможности скопировать и передать ссылку с открытым нужным табом
    document.location.hash = "#show_tab_" + nb;  
  }  
}
/* END карточка товара */

// Функции для главной страницы
function indexPage() {
  // Слайдер на главной
  var $slideshow = $('#slideshow .slideshow__container');
  
  $slideshow.owlCarousel({
    items: 1,
    smartSpeed: 500,
    loop: false,
    lazyLoad: true,
    dots: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    animateOut: 'fadeOut',
  });
  // Слайдер категорий на главной
  var $categories = $('.categories-list');
  
  $categories.owlCarousel(
  $.extend(OWL_DEFAULT,  
  {
    animateOut: 'fadeOut',
    onInitialized: function(event){
      var colorsArray = ['#bceac0', '#fae0fc', '#f7efca', '#f7dfca','#d2caf7','#caeef7']
      var element = event.target; 
      var items = event.item.count;

      for(var i = 0; i <= items; i++ ){
        var currentColor = (i >= colorsArray.length) ? colorsArray[Math.abs(colorsArray.length - i)] : colorsArray[i];
        
        $(element).find('.owl-item').eq(i).find('.categories-list__item').css('background', currentColor)
      }
    },
    responsive: {
      0:{items:1},
      320:{items:2},
      480:{items:3},
      540:{items:3},
      768:{items:5},
      992:{items:5},
      1200:{items:6, nav: true,margin: 15, autoWidth: false}
    }    
  }));
  
  
  // Товары на главной | Хиты | Новинки |Распродажа
  $(".pdt-index .products-grid, .pdt-favorites .products-grid, .pdt-new .products-grid, .pdt-sale .products-grid").owlCarousel(
  $.extend(OWL_DEFAULT,
  {
    items: 4,
    responsive: {
      0:{items:1},
      320:{items:1},
      480:{items:1},
      540:{items:2},
      768:{items:3},
      992:{items:4},
      1200:{items:4, nav: true, margin: 15, autoWidth: false}
    }
  }
  ));
  // Баннеры на главной
  $(function(){
    var $bannersMobile = $('.banners-mobile');
    $('#banners').find('.banner').each(function(i, el){
      var $banner = $(el).clone().addClass('_mobile');

      if(i % 2 === 0){
        var $row = $('<div>').addClass('banners-mobile__row')
        $bannersMobile.append($row)
      }
      $bannersMobile.find('.banners-mobile__row:last').append($banner);
      $bannersMobile.find('.banner').each(function(){
        var $bannerLink = $(this).find('a');
        $bannerLink.attr('data-background-image', $bannerLink.attr('data-mobile-bg'))
      })
      lozad().observe();
    })
    
    function bannersSlider() {
      if(getClientWidth() <= 375){
        $bannersMobile.addClass('owl-carousel').owlCarousel({
          items: 1,
          margin: 15
        })
      } else {
        $bannersMobile.trigger('destroy.owl.carousel')
      }
    }
    bannersSlider();
    
    $(window).resize(function(){
        bannersSlider();
    })
  })

  // Преимущества
  $(".our-features-list").owlCarousel(
  $.extend(OWL_DEFAULT,
      {
    items: 4,
    animateOut: 'fadeOut',
    onInitialized: function(event){
      var colorsArray = ['#e0e2f8', '#f8e0e0', '#ffffd7', '#d7ffdb']
      var element = event.target; 
      var items = event.item.count;

      for(var i = 0; i <= items; i++ ){
        var currentColor = (i >= colorsArray.length) ? colorsArray[Math.abs(colorsArray.length - i)] : colorsArray[i];
        
        $(element).find('.owl-item').eq(i).find('.our-features-list__item').css('background', currentColor)
      }
    },
    responsive: {
      0:{items:1},
      320:{items:1},
      480:{items:1},
      540:{items:2},
      768:{items:4},
      992:{items:4},
      1200:{items:4, nav: true, margin: 15, autoWidth: false}
    }
  }
  ));  
  
  // Слайдер новостей (все новости без группировки)
  $(".news .news__list").owlCarousel(
    $.extend(OWL_DEFAULT,
    {
    items: 2,
    onInitialized: function(event){
      var colorsArray = ['#fce3a1', '#14d9c5']
      var element = event.target; 
      var items = event.item.count;

      for(var i = 0; i <= items; i++ ){
        var currentColor = (i >= colorsArray.length) ? colorsArray[Math.abs(colorsArray.length - i)] : colorsArray[i];
        
        $(element).find('.owl-item').eq(i).find('.news__item').css('border-color', currentColor)
      }
    },    
    responsive:{
      0:{items:1},
      576:{items:2},
      992:{items:2},
      1199:{items:2, nav: true,margin: 15, autoWidth: false}
    }
  }));
  // Счётчик даты в акциях
  $(function(){counterDate()})  
}

// Предзагрузчик
function preloadHide(currentPreloader, nodelay) {
  var $preloader = currentPreloader || $('.preloader'),
  $spinner = $preloader.find('.content-loading');
  $spinner.fadeOut();
  $preloader.delay(nodelay || 500).fadeOut('slow');
}

function preloadShow(currentPreloader) {
  var $preloader = currentPreloader || $('.preloader'),
  $spinner = $preloader.find('.content-loading');
  $spinner.show();
  $preloader.show();
}
function preloadButton($button) {
  $button.html('<span class="lds-ellipsis"><span></span><span></span><span></span><span></span></span>')
}

// Загрузка основных функций шаблона
$(function(){
  mainFunctions();
  addCart();
  quantity();
  quickView();
  quickViewMod();
  // Запуск Избранное & Сравнение
  addTo();
});

// Запуск основных функций для разных разрешений экрана
$(function(){
  if(getClientWidth() > 767){
    
  }
  // Запуск функций при изменении экрана
  $(window).resize(function(){
    if(getClientWidth() > 767){

    }
  });
});

// Наверх
$(function(){
	// fade in #back-top
	var $topBtn = $('#back-top');
	
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$topBtn.addClass('_active');
		} else {
			$topBtn.removeClass('_active');
		}		
  });
  
	$topBtn.on('click',function () {
		$('body, html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});
});
// Модальное окно
$(function(){
  function modal() {
    if(!$.cookie('modal')){
      // Если cookie не установлено появится окно с задержкой 3 секунды
      var delay = 3000;
      var data = $("#fancybox-popup").html();
      setTimeout(function(){
        $.fancybox.open(data,{
          autoSize: true,
          maxWidth: 700,
          padding: 15,
          content: data
        });       
      }, delay)
      
     // Запоминаем в куках, что посетитель уже заходил
     $.cookie('modal', true, {
      // Время хранения cookie в днях
       expires: 1,
       path: '/'
     });    
    }
  }  
  // Уберите комментарии // со строчек ниже для запуска
  // modal();
})

// Отсчет даты до окончания акции
function counterDate() {
  // Устанавливаем дату обратного отсчета ММ-ДД-ГГ
  $('.ico._sale-counter').each(function(i, el){
    var end = $(el).attr('end');
    var countDownDate = new Date(end).getTime();
    // Обновление счетчика каждую секунду
    var x = setInterval(function() {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      // Вывод
      $(el).find('.days span').text(days);
      $(el).find('.hours span').text(hours);
      $(el).find('.minutes span').text(minutes);
      $(el).find('.seconds span').text(seconds);
      // Счетчик завершен
      if (distance < 0) {
        clearInterval(x);
        $(el).find('span').text("0");
      }
    }, 1000);
  })
}
// Форма поиска ( Сразу же помечаем объект поиска, как инициализированный, чтобы случайно не инициализировать его дважды.)
function SearchFieldInit(obj) {
    // Блок в котором лежит поле поиска
    obj.f_search = obj.find('.search__form');
    // Если поля поиска не нашлось, завершаем работу, ничего страшного.
    if(0 == obj.f_search.length) {
      return false;
    }
    // Поле поиска товара
    obj.s_search = obj.f_search.find('.search__input');
    // Обнуление данных в форме поиска
    obj.s_reset  = obj.f_search.find('.search__form-reset-btn');
    // Проверка на существование функции проверки поля и действий с ним
    if(typeof(obj.SearchFieldCheck) != 'function') {
      console.log('function SearchFieldCheck is not found in object for SearchFieldInit', {status: 'error'});
      return false;
    // Проверка, сколько полей поиска нам подсунули за раз на инициализацию
    } else if(1 < obj.f_search.length) {
      console.log('function SearchFieldInit must have only one search object', {status: 'error'});
      return false;
    }
    // Создаём функцию которая будет отвечать за основные действия с полем поиска
    obj.__SearchFieldCheck = function (isAfter) {
      // Если в поле текста есть вбитые данные
      if(obj.s_search.val().length) {
        obj.f_search.addClass('search__filled');
        $('.catalog-button').addClass('search__filled');
      } else {
        obj.f_search.removeClass('search__filled');
        $('.catalog-button').removeClass('search__filled');
      }
      // При нажатии клавиши данных внутри поля ещё нет, так что проверки вернут информацию что менять поле не нужно, хотя как только операция будет завершена данные в поле появятся. Поэтому произведём вторую проверку спустя 2 сотых секунды.
      if(typeof( isAfter ) == "undefined" || !isAfter) {
        setTimeout(function() { obj.__SearchFieldCheck(1); },20);
      }else{
        return obj.SearchFieldCheck();
      }
    }
    // Действия с инпут полем поиска
    obj.s_search.click(function(){
      obj.__SearchFieldCheck();
    }).focus(function(){
      obj.f_search.addClass('search__focused');
      obj.__SearchFieldCheck();
    }).blur(function(){
      obj.f_search.removeClass('search__focused');
      obj.__SearchFieldCheck();
    }).keyup(function(I){
  		switch(I.keyCode) {
  			// игнорируем нажатия на эти клавишы
  			case 13:  // enter
  			case 27:  // escape
  			case 38:  // стрелка вверх
  			case 40:  // стрелка вниз
  			break;
  
  			default:
          obj.f_search.removeClass('search__focused');
          obj.__SearchFieldCheck();
  		  break;
		  }			
    }).bind('paste', function(e){
      obj.__SearchFieldCheck();
      setTimeout(function() { obj.__SearchFieldCheck(); },20);
    }).bind('cut', function(e){
      $('#search-result').hide();
      $('#search-result .search__result-inner .result-item').remove();
      obj.__SearchFieldCheck();
    });
  	//Считываем нажатие клавиш, уже после вывода подсказки
	  var suggestCount;
	  var suggestSelected = 0;
	  
    function keyActivate(n){
      var $links = $('#search-result .result-item a');
    	$links.eq(suggestSelected-1).removeClass('_active');
    
    	if(n == 1 && suggestSelected < suggestCount){
    		suggestSelected++;
    	}else if(n == -1 && suggestSelected > 0){
    		suggestSelected--;
    	}
    	if( suggestSelected > 0){
    		$links.eq(suggestSelected-1).addClass('_active');
    	}
    }
  	obj.s_search.keydown(function(I){
  		switch(I.keyCode) {
  			// По нажатию клавиш прячем подсказку
  			case 27: // escape
  				$('#search-result').hide();
  				return false;
  			break;
  			// Нажатие enter при выделенном пункте из поиска
  			case 13: // enter
  			  if(suggestSelected){
    			  var $link = $('#search-result .result-item').eq(suggestSelected - 1).find('a');
    			  var href = $link.attr('href');
    			  if(href){
    			    document.location = href
    			  } else {
    			    $link.trigger('click')
    			  }
    			  return false;
  			  }
  			break;
  			// делаем переход по подсказке стрелочками клавиатуры
  			case 38: // стрелка вверх
  			case 40: // стрелка вниз
  				I.preventDefault();
  				suggestCount = $('#search-result .result-item').length
  				if(suggestCount){
  					//делаем выделение пунктов в слое, переход по стрелочкам
  					keyActivate(I.keyCode-39);
  				}
  			break;
  			default:
  			suggestSelected = 0;
  			break;
  		}
  	});
  	
    // Кнопка обнуления данных в форме поиска
    obj.s_reset.click(function(){
      obj.s_search.val('').focus();
      $('#search-result').hide();
      $('#search-result .search__result-inner .result-item').remove();
    })
    // Проверка данных в форме после инициализации функционала. Возможно браузер вставил туда какой-либо текст, нужно обработать и такой вариант
    obj.__SearchFieldCheck();
  }
// Аналог php функции.
function htmlspecialchars(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function substr(str,start,len){str+='';var end=str.length;if(start<0){start+=end;}end=typeof len==='undefined'?end:(len<0?len+end:len+start);return start>=str.length||start<0||start>end?!1:str.slice(start,end);}
function md5(str){var xl;var rotateLeft=function(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));};var addUnsigned=function(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}else{return(lResult^0x40000000^lX8^lY8);}}else{return(lResult^lX8^lY8);}};var _F=function(x,y,z){return(x&y)|((~x)&z);};var _G=function(x,y,z){return(x&z)|(y&(~z));};var _H=function(x,y,z){return(x^y^z);};var _I=function(x,y,z){return(y^(x|(~z)));};var _FF=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_F(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _GG=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_G(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _HH=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_H(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _II=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_I(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var convertToWordArray=function(str){var lWordCount;var lMessageLength=str.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=new Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(str.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;};var wordToHex=function(lValue){var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;wordToHexValue_temp="0"+lByte.toString(16);wordToHexValue=wordToHexValue+wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);}
return wordToHexValue;};var x=[],k,AA,BB,CC,DD,a,b,c,d,S11=7,S12=12,S13=17,S14=22,S21=5,S22=9,S23=14,S24=20,S31=4,S32=11,S33=16,S34=23,S41=6,S42=10,S43=15,S44=21;str=this.utf8_encode(str);x=convertToWordArray(str);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;xl=x.length;for(k=0;k<xl;k+=16){AA=a;BB=b;CC=c;DD=d;a=_FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=_FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=_FF(c,d,a,b,x[k+2],S13,0x242070DB);b=_FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=_FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=_FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=_FF(c,d,a,b,x[k+6],S13,0xA8304613);b=_FF(b,c,d,a,x[k+7],S14,0xFD469501);a=_FF(a,b,c,d,x[k+8],S11,0x698098D8);d=_FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);a=_GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=_GG(d,a,b,c,x[k+6],S22,0xC040B340);c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=_GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=_GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=_GG(d,a,b,c,x[k+10],S22,0x2441453);c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=_GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=_GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=_GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=_GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=_GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=_GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=_HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=_HH(d,a,b,c,x[k+8],S32,0x8771F681);c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=_HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=_HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=_HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=_HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=_HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=_HH(b,c,d,a,x[k+6],S34,0x4881D05);a=_HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=_HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=_II(a,b,c,d,x[k+0],S41,0xF4292244);d=_II(d,a,b,c,x[k+7],S42,0x432AFF97);c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=_II(b,c,d,a,x[k+5],S44,0xFC93A039);a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);d=_II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=_II(b,c,d,a,x[k+1],S44,0x85845DD1);a=_II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=_II(c,d,a,b,x[k+6],S43,0xA3014314);b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=_II(a,b,c,d,x[k+4],S41,0xF7537E82);d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=_II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=_II(b,c,d,a,x[k+9],S44,0xEB86D391);a=addUnsigned(a,AA);b=addUnsigned(b,BB);c=addUnsigned(c,CC);d=addUnsigned(d,DD);}
var temp=wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);return temp.toLowerCase();}
function utf8_encode(argString){var string=(argString+'');var utftext="";var start,end;var stringl=0;start=end=0;stringl=string.length;for(var n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++;}else if(c1>127&&c1<2048){enc=String.fromCharCode((c1>>6)|192)+String.fromCharCode((c1&63)|128);}else{enc=String.fromCharCode((c1>>12)|224)+String.fromCharCode(((c1>>6)&63)|128)+String.fromCharCode((c1&63)|128);}
if(enc!==null){if(end>start){utftext+=string.substring(start,end);}
utftext+=enc;start=end=n+1;}}
if(end>start){utftext+=string.substring(start,string.length);}
return utftext;}
function rand(min,max){var argc=arguments.length;if(argc===0){min=0;max=2147483647;}else if(argc===1){throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');}return Math.floor(Math.random()*(max-min+1))+min;}
// Получить md5 хэш
function GenMd5Hash () {
  return substr(md5(parseInt(new Date().getTime() / 1000, 10)),rand(0,24),8);
}
// Живой поиск
$(function() {
  // Навигационная таблица над таблицей с данными
  var searchBlock = $('.search');
  var options = {
    target:                 'form.store_ajax_catalog',
    url:                    '/admin/store_catalog',
    items_target:           '#goods',
    last_search_query:      '',
  };
  // По этому хэшу будем обращаться к объекту извне
  var randHash = GenMd5Hash();
  // Если объекта со списком ajax функций не существует, создаём её
  if(typeof(document.SearchInCatalogAjaxQuerySender) == 'undefined') {
    document.SearchInCatalogAjaxQuerySender = {};
  }
  // Поле поиска обновилось, внутри него можно выполнять любые действия
  searchBlock.SearchFieldCheck = function () {
    // Отменяем выполнение последнего запущенного через таймаут скрипта, если таковой был.
    if(typeof(document.lastTimeoutId) != 'undefined') {
      clearTimeout(document.lastTimeoutId);
    }
    document.lastTimeoutId = setTimeout("document.SearchInCatalogAjaxQuerySender['" + randHash + "']('" + htmlspecialchars(searchBlock.s_search.val()) + "');", 300);
  }
  // Отправляет запрос к серверу с задачей поиска товаров
  document.SearchInCatalogAjaxQuerySender[randHash] = function (old_val) {
    var last_search_query_array = [];
    
    // sessionStorage is available
    if (typeof sessionStorage !== 'undefined') {
        try {
          if(sessionStorage.getItem('lastSearchQueryArray')){
            last_search_query_array = JSON.parse(sessionStorage.getItem('lastSearchQueryArray'));
            
            // Находим соответствие текущего запроса с sessionStorage
            var currentSearch = $.grep(last_search_query_array, function (item){
              return item.search_query == old_val
            })[0]
            
            if(currentSearch){
              showDropdownSearch(JSON.parse(currentSearch.content));
              
              return;
            }
          } else {
            sessionStorage.setItem('lastSearchQueryArray', '[]')
          }
        } catch(e) {
            // sessionStorage is disabled
        }
    }
    
    // Если текущее значение не изменилось спустя 300 сотых секунды и это значение не то по которому мы искали товары при последнем запросе
    if(htmlspecialchars(searchBlock.s_search.val()) == old_val && searchBlock.s_search.val().length > 1) {
      // Запоминаем этот запрос, который мы ищем, чтобы не произвводить повторного поиска
      options['last_search_query'] = old_val;
      // Добавляем нашей форме поиска поле загрузки
      searchBlock.f_search.addClass('search__loading');
      // Собираем параметры для Ajax запроса
      var
        params = {
          'ajax_q'                : 1,
          'goods_search_field_id' : 0,
          'q'                     : options['last_search_query'],
        },
        // Объект со значением которого будем в последствии проверять полученные от сервера данные
        search_field_obj = searchBlock.s_search;
      // Аяксом отправляем запрос на поиск нужных товаров и категорий
      $.ajax({
        type: "POST",
        cache: false,
        url: searchBlock.f_search.attr('action'),
        data: params,
        dataType: 'json',
        beforeSend: function(){
          searchBlock.find('.search-submit .header-searchIcon').html('<i class="fal fa-circle-notch fa-spin"></i>')
        },
        success: function(data) {
          // Если набранный запрос не соответствует полученным данным, видимо запрос пришёл не вовремя, отменяем его.
          if(search_field_obj.val() != old_val) {
            return false;
          }
          
          // Записываем в sessionStorage
          if (typeof sessionStorage !== 'undefined') {
              try {
                sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
                
                // Находим соответствие текущего запроса с sessionStorage
                var currentSearch = $.grep(last_search_query_array, function (item){
                  return item.search_query == old_val
                })[0]
                //Если такого запроса ещё не было запишем его в sessionStorage
                if(typeof currentSearch == 'undefined'){
                  // Добавляем в массив последних запросов данные по текущему запросу
                  last_search_query_array.push({
                    search_query: old_val,
                    content: JSON.stringify(data)
                  })
                  sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
                }        
              } catch(e) {
                  // sessionStorage is disabled
              }
          }         
          // Показываем результаты на основе пришедших данных
          showDropdownSearch(data);
          
          // Убираем информацию о том что запрос грузится.
          searchBlock.f_search.removeClass("search__loading");
          searchBlock.find('.search-submit .header-searchIcon').html('<i class="fal fa-search"></i>')
          // console.log('andAJAX')
        }
      });
    }else{
      $("#search-result").removeClass('_active').hide();
    }
    
    function showDropdownSearch(data){
      // Отображение категорий в поиске
      if(data.category.length!=undefined && data.category.length>0){
        $(".result-category .result-item").remove();
        $("#search-result").removeClass('_active').hide();
        $("#search-result .search__result-inner .result-category").find('.result__title').remove();
        $("#search-result .search__result-inner .result-category").append('<h3 class="result__title">Категории</h3>');
        
        for(с=0; с < data.category.length; с++){
          // Проверка наличия изображения
          if (data.category[с].image_icon == null) {
            data.category[с].image_icon = '/design/no-photo-icon.png'
          } else {
            data.category[с].image_icon = data.category[с].image_icon;
          }
          // Отображаем результат поиска
         $("#search-result").addClass('_active').show();
          $("#search-result .search__result-inner .result-category").append('<div class="result-item" data-id="'+ data.category[с].goods_cat_id +'"><a href="'+ data.category[с].url +'"><img src="'+ data.category[с].image_icon +'" class="goods-image-icon" /><span>'+ data.category[с].goods_cat_name +'</span></a></div>');
        }
      }else{
        $(".result-category .result-item").remove();
        $("#search-result").removeClass('_active').hide();
      }
      // Отображение товаров в поиске
      if(data.goods.length!=undefined && data.goods.length>0){
        $(".result-goods .result-item").remove();
        $("#search-result").removeClass('_active').hide();
        
        $("#search-result .search__result-inner .result-goods").find('.result__title').remove();
        $("#search-result .search__result-inner .result-goods").append('<h3 class="result__title">Товары</h3>');
        
        for(i=0; i < data.goods.length; i++){
          // Проверка наличия изображения
          if (data.goods[i].image_icon == null) {
            data.goods[i].image_icon = '/design/no-photo-icon.png'
          } else {
            data.goods[i].image_icon = data.goods[i].image_icon;
          }
          // Отображаем результат поиска
         $("#search-result").addClass('_active').show();
         if(i <= 4 ){
          $("#search-result .search__result-inner .result-goods").append('<div class="result-item" data-id="'+ data.goods[i].goods_id +'"><a href="'+ data.goods[i].url +'"><img src="'+ data.goods[i].image_icon +'" class="goods-image-icon" /><span>'+ data.goods[i].goods_name +'</span></a></div>');
         }
         
        // Если последняя итерация цикла вставим кнопку "показать все"
         if(i == data.goods.length - 1){
          $("#search-result .search__result-inner #show-wrap").remove();
          
          var $showAllBtn = $('<a>').text('Все результаты').addClass('show-all').on('click', function(){$('.search__form').submit();})
          var $showAllWrap = $('<div>').attr('id', 'show-wrap').addClass('result-item').append($showAllBtn)
          
          $("#search-result .search__result-inner .result-goods").append($showAllWrap)
         }
        }
      }else{
        $(".result-goods .result-item").remove();
        $("#search-result").removeClass('_active').hide();
      }
      // Скрываем результаты поиска если ничего не найдено
      if((data.category.length + data.goods.length) > 0){
       $("#search-result").addClass('_active').show();
      //   console.log("show");
      }else{
        $("#search-result").removeClass('_active').hide();
      //   console.log("hide");
      }
      
      if((data.category.length) > 0){
        $(".result-category").show().addClass('_visible');
      }else{
        $(".result-category").hide().removeClass('_visible');
      }
      
      if((data.goods.length) > 0){
        $(".result-goods").show();
      }else{
        $(".result-goods").hide();
      }         
    }
  }
  SearchFieldInit(searchBlock);
 
});