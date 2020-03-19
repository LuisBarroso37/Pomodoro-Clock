//NOTES:
/* Dependencies are React, ReactDOM, and 
    Accurate_Interval.js by Squuege (external script 
    to keep setInterval() from drifting over time & 
    thus ensuring timer goes off at correct mark).*/

    class Clock extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            play: false,
            breakTimer: 5,
            sessionTimer: 25,
            timerLabel: 'Session',
            timerCountdown: 25 * 60, // time in seconds, format mm:ss done in the rendering method of the timer component
            runningTimer: null //"Global variable" to hold the setInterval function in order to be able to use clearInterval function
          };
          this.audioRef = React.createRef(); //reference to be able to play audio element
          this.handleClick = this.handleClick.bind(this);
          this.handleReset = this.handleReset.bind(this);
          this.handlePlay = this.handlePlay.bind(this);
        }
        
        //Handle clicking +/- buttons of break length and session length
        handleClick(argument) {
          if (argument == 'sessionIncrease') {
            if (this.state.sessionTimer >= 60) {
              this.setState({
                sessionTimer: 60,
                timerCountdown: 60 * 60
              });
            } else {
              this.setState({
                sessionTimer: this.state.sessionTimer + 1,
                timerCountdown: (this.state.sessionTimer + 1) * 60
              });
            }
          } else if (argument == 'sessionDecrease') {
            if (this.state.sessionTimer <= 1) {
              this.setState({
                sessionTimer: 1,
                timerCountdown: 1 * 60
              });
            } else {
              this.setState({
                sessionTimer: this.state.sessionTimer - 1,
                timerCountdown: (this.state.sessionTimer - 1) * 60
              });
            }
          } else if (argument == 'breakIncrease') {
            if (this.state.breakTimer >= 60) {
              this.setState({
                breakTimer: 60
              });
            } else {
              this.setState({
                breakTimer: this.state.breakTimer + 1
              });
            }
          } else if (argument == 'breakDecrease') {
            if (this.state.breakTimer <= 1) {
              this.setState({
                breakTimer: 1
              });
            } else {
              this.setState({
                breakTimer: this.state.breakTimer - 1
              });
            }
          }
        }
        
              //If reset is clicked then everything goes back to the original values - the audio is rewinded and the countdown is stopped
        handleReset() {
          clearInterval(this.state.runningTimer);
          this.audioRef.current.pause();
          this.audioRef.current.currentTime = 0;
          this.setState({
            breakTimer: 5,
            sessionTimer: 25,
            timerLabel: 'Session',
            timerCountdown: 25 * 60,
            play: false,
            runningTimer: null
          });
        }
        
        //Handling all the countdown logic when you press play or pause
        handlePlay() {
          if (this.state.play == false) {
            this.setState({
              play: true,
              //setInterval will run the code inside every second (1000ms)
              runningTimer: setInterval(() => {
                this.setState({timerCountdown: this.state.timerCountdown - 1});
              if (this.state.timerCountdown == 0) {
                this.audioRef.current.play();
              } else if (this.state.timerCountdown < 0) {
                if (this.state.timerLabel == 'Session') {
                  this.setState ({
                    timerCountdown: this.state.breakTimer * 60,
                    timerLabel: 'Break'
                  });
                } else {
                  this.setState ({
                    timerCountdown: this.state.sessionTimer * 60,
                    timerLabel: 'Session'
                  });
                }
              }
            }, 1000)
            });
          } else {
            //If pause is clicked then stop the timer countdown and the audio rewinded
            clearInterval(this.state.runningTimer);
            this.audioRef.current.pause();
            this.audioRef.current.currentTime = 0;
            this.setState({
              play: false,
              timerLabel: this.state.timerLabel,
              timerCountdown: this.state.timerCountdown,
              runningTimer: null
            });
          }
        }
        
        render() {
          return (
            <div id="clock" className="container-fluid">
              <Timer play={this.handlePlay} reset={this.handleReset} playState={this.state.play} timerLabel={this.state.timerLabel} timerCountdown={this.state.timerCountdown} formatTime= {this.formatTime}/>
              <Break break={this.state.breakTimer} onClick={this.handleClick}/>
              <Session session={this.state.sessionTimer} onClick={this.handleClick}/>
              <audio id="beep" preload='auto' ref={this.audioRef} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3"></audio>
            </div>
          );
        }
      }
      
      const Break = (props) => {
        return (
          <div id="break">
            <p id="break-label">Break Length</p>
            <div id="break-buttons">
              <button onClick={() => props.onClick('breakDecrease')} id="break-decrement">-</button>
              <p id="break-length">{props.break}</p>
              <button onClick={() => props.onClick('breakIncrease')} id="break-increment">+</button>
            </div>
          </div>
        );
      };
      
      const Session = (props) => {
        return (
          <div id="session">
            <p id="session-label">Session Length</p>
            <div id="session-buttons">
              <button onClick={() => props.onClick('sessionDecrease')} id="session-decrement">-</button>
              <p id="session-length">{props.session}</p>
              <button onClick={() => props.onClick('sessionIncrease')} id="session-increment">+</button>
            </div>
          </div>
        );
      };
      
      const Timer = (props) => {
        //function to transform the time in seconds to format mm:ss
        const formatTime = (time) => {
          var minutes = Math.floor(time / 60);
          if (minutes < 10) {minutes = '0' + minutes};
          
          var seconds = time - minutes * 60;
          if (seconds < 10) {seconds = '0' + seconds};
          
          return minutes + ':' + seconds;
        }
        return (
          <div id="timer">
            <div id="display">
              <p id="timer-label">{props.timerLabel}</p>
              <p id="time-left">{formatTime(props.timerCountdown)}</p>
            </div>
            <div id ="control-buttons">
              {!props.playState ? (<i id="start_stop" onClick={props.play} class="fas fa-play"></i>) : (<i id="start_stop" onClick={props.play} class="fas fa-pause"></i>)}
              <i id="reset" onClick={props.reset} class="fas fa-sync"></i>
            </div>
          </div>
        );
      };
      
      ReactDOM.render(<Clock />, document.getElementById("root"));