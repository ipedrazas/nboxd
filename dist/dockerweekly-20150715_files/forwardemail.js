/*jslint indent: 2, regexp: true, browser: true*/
/*global jQuery */
jQuery(document).ready(
  function () {
    'use strict';
    var isOpen = true, rootElement = null,
      path = (window.location.pathname).replace('/email/emailWebview', '/email/forwardToFriend'),
      // validate email
      validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      },
      // get parameter from URL
      getURLParameter = function (name) {
        var returnVal = decodeURIComponent((new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || ['', null])[1]);
        return returnVal;
      },
      // open/close the forward to friend dialog
      togglePanel = function () {
        isOpen = !isOpen;
        if (isOpen) {
          rootElement.find('.ftf_mainContent').stop().slideUp('slow', function () {
            rootElement.stop().animate({
              width : '170px',
              marginLeft : '-85px',
              padding : '0.5em'
            }, function () {
              jQuery(this).find('.ftf_mainContent').stop().slideUp('slow');
            }).each(function () {
              jQuery(this).find('.ftf_toggleSwitch').stop().animate({
                fontSize : '100%'
              }).find('.ftf_icon img').stop().animate({
                top : '-12px'
              }, 'slow');
            });
          });
        } else {
          rootElement.stop().animate({
            width : '400px',
            marginLeft : '-200px',
            padding : '0.5em 1.5em'
          }, function () {
            jQuery(this).find('.ftf_mainContent').stop().slideDown('slow');
          }).each(function () {
            jQuery(this).find('.ftf_toggleSwitch').stop().animate({
              fontSize : '140%'
            }).find('.ftf_icon img').stop().animate({
              top : '0px'
            }, 'slow');
          });
        }
      },
      // add ftf dialog elements to the dom
      appendElements = function () {
        jQuery('body').prepend(
          '<div id="forwardtoFriendDropDown" style="display:none;">'
              + '<div class="ftf_toggleSwitch"><div class="ftf_icon"><img height="24" src="/images/icons/ftf_arrows.png"></div><div>Forward to a Friend</div></div>'
              + '<div class="ftf_mainContent">'
              + '<div class="ftf_fields_container">'
              + '  <ul>'
              + '    <li class="ftf_fname ftf_required">'
              + '      <div class="ftf_field"><label for="ftf_friend_fname">Friend\'s First Name:</label><input name="ftf_friend_fname" type="text"></div>'
              + '      <div class="ftf_errorMessage">Required</div>'
              + '    </li>'
              + '    <li class="ftf_lname ftf_required">'
              + '      <div class="ftf_field"><label for="ftf_friend_lname">Friend\'s Last Name:</label><input name="ftf_friend_lname" type="text"></div>'
              + '      <div class="ftf_errorMessage">Required</div>'
              + '    </li>'
              + '    <li class="ftf_email ftf_required">'
              + '      <div class="ftf_field"><label for="ftf_friend_email">Friend\'s Email:</label><input name="ftf_friend_email" type="text"></div>'
              + '      <div class="ftf_errorMessage">Invalid email address</div>'
              + '    </li>'
              //+ '    <li><label for="ftf_friend_message">Message:</label><textarea rows="4" name="ftf_friend_message"></textarea></li>'
              + '  </ul>'
              + '  <div class="ftf_success_message">Successfully Sent</div>'
              + '</div>'
              + '<div class="ftf_buttonContainer">'
              + '  <div class="ftf_state_initial"><button class="cancelButton">CANCEL</button><button class="sendButton">SEND</button></div>'
              + '  <div class="ftf_state_sent"><button class="sendAnotherButton">SEND ANOTHER</button><button class="doneButton">DONE</button></div>'
              + '</div></div></div>'
        );
      },
      resetForm = function () {
        rootElement.find('.ftf_mainContent input, .ftf_mainContent textarea,.ftf_mainContent button').removeAttr('disabled');
        rootElement.find('.ftf_mainContent input').val('');
        rootElement.find('.ftf_mainContent textarea').val('');
      },
      completedAction = function (message, className) {
        rootElement.find('.ftf_fields_container').height(rootElement.find('.ftf_fields_container').height());
        resetForm();
        rootElement.find('.ftf_buttonContainer .ftf_state_initial').fadeOut('fast', function () {
          rootElement.find('.ftf_buttonContainer .ftf_state_sent').fadeIn('fast');
        });
        rootElement.find('.ftf_success_message').text(message).fadeIn('fast');
      },
      // add behavior to the elements
      attachBehavior = function () {
        rootElement.find('.ftf_mainContent').find('button.doneButton, button.cancelButton, button.sendAnotherButton').click(resetForm);
        rootElement.find('.ftf_toggleSwitch, .ftf_mainContent button.cancelButton,.ftf_toggleSwitch, .ftf_mainContent button.doneButton').click(
          function () {
            togglePanel();
            rootElement.find('.ftf_success_message').hide();
          }
        );
        rootElement.find('.ftf_toggleSwitch, .ftf_mainContent button.sendAnotherButton').click(function () {
          rootElement.find('.ftf_buttonContainer .ftf_state_sent').fadeOut('fast', function () {
            rootElement.find('.ftf_buttonContainer .ftf_state_initial').fadeIn('fast');
            rootElement.find('.ftf_fields_container').height('auto');
          });
          rootElement.find('.ftf_success_message').fadeOut('fast');
        });
        rootElement.find('.ftf_mainContent input').focus(function () {
          jQuery(this).parents('li').removeClass('error');
        });
        rootElement.find('.ftf_mainContent button.sendButton').click(function () {
          var values = [], hasError = false;
          rootElement.find('.ftf_mainContent input').each(function () {
            values.push(this.value);
          });
          if (values[0] === '') {
            rootElement.find('.ftf_mainContent li.ftf_fname').addClass('error');
            hasError = true;
          }
          if (values[1] === '') {
            rootElement.find('.ftf_mainContent li.ftf_lname').addClass('error');
            hasError = true;
          }
          if (!validateEmail(values[2])) {
            rootElement.find('.ftf_mainContent li.ftf_email').addClass('error');
            hasError = true;
          }
          if (hasError) {
            return;
          }
          rootElement.find('.ftf_mainContent input,.ftf_mainContent textarea,.ftf_mainContent button').attr('disabled', 'disabled');
          jQuery.get(path, {
            fname : values[0],
            lname : values[1],
            emailAddress : values[2],
            //message : values[2],
            mkt_tok : getURLParameter('mkt_tok')
          }, function (html) {
            if (html === '') {
              completedAction('An error occurred in forwarding your email.');
            } else {
              completedAction(html);
            }
          }).error(function () {
            completedAction('An error occurred in forwarding your email.');
          });
        });
      },
      // initialize the display of ftf elements
      init = function () {
        if (getURLParameter('ftf') === 'true') {
          rootElement.fadeIn('slow', function () {
            attachBehavior();
            togglePanel();
          });
        }
      };
    appendElements();
    rootElement = jQuery('#forwardtoFriendDropDown');
    setTimeout(init, 1000);
  }
);
