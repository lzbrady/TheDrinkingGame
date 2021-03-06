import React, {Component} from 'react';

import {createGame, joinGame} from './Backend/database';
import './main-page.css';

class MainPage extends Component {
    constructor() {
        super();

        this.state = {
            playerName: "",
            gameCode: "",
            error: ""
        }

        this.handleChange = this
            .handleChange
            .bind(this);
        this.gameCodeChange = this
            .gameCodeChange
            .bind(this);
        this.newGameSubmit = this
            .newGameSubmit
            .bind(this);
        this.joinGameSubmit = this
            .joinGameSubmit
            .bind(this);
        this.contact = this
            .contact
            .bind(this);
    }

    handleChange(event) {
        this.setState({playerName: event.target.value});
    }

    gameCodeChange(event) {
        this.setState({gameCode: event.target.value});
    }

    newGameSubmit(e) {
        if (!e.key || e.key === 'Enter') {
            if (typeof(Storage) !== "undefined") {
                this.setState({error: ""});
                let code = createGame(this.state.playerName);

                if (code.error) {
                    this.setState(code);
                } else {
                    localStorage.setItem("username", this.state.playerName.trim());
                    // Must attempt to read to persist
                    localStorage.getItem('username');
                    this.setState({error: ""});
                    this
                        .props
                        .history
                        .push(`/lobby/${code}`);
                }
            } else {
                // Sorry! No Web Storage support..
                this.setState({
                    error: "Your browser does not support session storage. Try updating you current browser," +
                            " or seek a different one if the problem persits. We apologize for the inconvenie" +
                            "nce."
                });
            }
        }
    }

    joinGameSubmit(event) {
        if (typeof(Storage) !== "undefined") {
            this.setState({error: ""});
            localStorage.setItem("username", this.state.playerName.trim());
            // Must attempt to read to persist
            localStorage.getItem('username');
            joinGame(this.state.playerName, this.state.gameCode).then((rtn) => {
                if (rtn.success) {
                    this
                        .props
                        .history
                        .push(`/lobby/${this.state.gameCode}`);
                } else {
                    this.setState(rtn);
                }
            });
        } else {
            // Sorry! No Web Storage support..
            this.setState({
                error: "Your browser does not support session storage. Try updating you current browser," +
                        " or seek a different one if the problem persits. We apologize for the inconvenie" +
                        "nce."
            });
        }
    }

    contact() {
        let win = window.open(`${window.location}contact`, ' _blank ');
        win.focus();
    }

    render() {
        return (
            <div className="main-page">
                <h1 className="title">The Drinking Game</h1>
                <div className="new-game-div">
                    <p className="main-page-label">Name:</p>
                    <input
                        type="text"
                        className="main-page-input"
                        onChange={this.handleChange}
                        onKeyPress={this.newGameSubmit}
                        name="name"
                        placeholder="Player Name"/>
                    <button
                        className={(this.state.playerName === "")
                        ? "main-page-disabled-button"
                        : "main-page-button"}
                        disabled={this.state.playerName === ""}
                        onClick={this.newGameSubmit}>Create Game</button>
                </div>
                <div className="join-game-div">
                    <p className="main-page-label">Game Code:</p>
                    <input
                        type="text"
                        id="game-code-input"
                        className="main-page-input"
                        onChange={this.gameCodeChange}
                        name="name"
                        placeholder="Game Code (ab123)"/>
                    <button
                        className={(this.state.playerName === "" || this.state.gameCode === "")
                        ? "main-page-disabled-button"
                        : "main-page-button"}
                        disabled={this.state.playerName === "" || this.state.gameCode === ""}
                        onClick={this.joinGameSubmit}>Join Game</button>
                </div>
                <p
                    className={this.state.error === ""
                    ? "hide"
                    : "error-message"}>{this.state.error}</p>
                <button className="contact-button" onClick={this.contact}>
                    Feedback / Suggestions
                </button>
                <form
                    action="https://www.paypal.com/cgi-bin/webscr"
                    method="post"
                    target="_blank"
                    className="paypal">
                    <input type="hidden" name="cmd" value="_s-xclick"/>
                    <input type="hidden" name="hosted_button_id" value="T9FJG2UANMSCW"/>
                    <input
                        type="image"
                        src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                        border="0"
                        name="submit"
                        alt="PayPal - The safer, easier way to pay online!"/>
                    <img
                        alt=""
                        border="0"
                        src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                        width="1"
                        height="1"/>
                </form>
            </div>
        );
    }
}

export default MainPage;
