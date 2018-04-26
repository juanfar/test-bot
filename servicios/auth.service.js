'use strict'

var SigninCardName = 'Sign-in card';

function createCard(selectedCardName, session) {
    
    return createSigninCard(session); 
}

function createSigninCard(session) {
    return new builder.SigninCard(session)
        .text('BotFramework Sign-in Card')
        .button('Sign-in', 'https://login.microsoftonline.com');
}