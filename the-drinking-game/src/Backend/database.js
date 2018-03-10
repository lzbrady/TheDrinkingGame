import fire from './fire';
import {nhieRandomNumber} from './database-nhie';

export function createGame(playerName) {
    //TODO: Ensure game code doesn't exist already
    let gameCode = generateGameCode();
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);
    ref.set({[playerName]: true});
    ref
        .child('redirect')
        .set(false);
    ref
        .child('metadata')
        .child('nhie')
        .set(nhieRandomNumber());
    return gameCode;
}


export function joinGame(playerName, gameCode) {
    //TODO: Check to make sure players < 8
    let fireRef = fire
        .database()
        .ref('games')
        .child(gameCode);

    // Check if lobby exists
    return fireRef
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() === null) {
                return {error: "Lobby Does Not Exist"};
            } else {
                return checkPlayerNameExists(playerName, gameCode);
            }
        });
}

function checkPlayerNameExists(playerName, gameCode) {
    // Check if player exists
    let playerRef = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName);
    return playerRef
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() !== null) {
                return {error: "Player Name Taken"};
            } else {
                return actuallyJoinGame(playerName, gameCode);
            }
        });
}

function actuallyJoinGame(playerName, gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName)
        .set(true);
    return {success: true};
}

export function removePlayer(playerName, gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName)
        .remove();
}

function generateGameCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) 
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}

export function redirect(gameCode, redirectTo) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('redirect')
        .set(redirectTo);
}