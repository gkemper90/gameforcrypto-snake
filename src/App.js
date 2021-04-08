import React, {useState, useEffect} from 'react';
import SnakeGame from '../src/SnakeGame.jsx'

//Game For Crypto Integration
import GFC from '../src/GFC';
//End Game For Crypto Integration

//import './index.css'

export default function App() {

    const apiURL = 'https://us-central1-gameforcrypto.cloudfunctions.net';

    const [selectedContest, setSelectedContest] = useState(null);
    const [gamerName, setGamerName] = useState(null);
    const [contests, setContests] = useState(null);
    const [playsAvailable, setPlaysAvailable] = useState(null);
    const [usedPlays, setUsedPlays] = useState(null);

    const [completedPlays, setCompletedPlays] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        console.log('contests', contests);
    },[contests])

    useEffect(() => {
        if(selectedContest){
            console.log('selectedContest', selectedContest);
            //Set Available Plays / Reset Used Plays
            let currentContest = contests[selectedContest];

            console.log('currentContest', currentContest);
            if(currentContest.playsRemaining === "unlimited"){
                setPlaysAvailable(999);
            } else {
                setPlaysAvailable(currentContest.playsRemaining);
                setUsedPlays(0);
                setCompletedPlays(null);
            }
        }
    },[selectedContest])

    const handleChangeStatus = (_status) => {
        setStatus(_status);
    }

    const postContestScore = (score) => {
        //selectedContest (contestEntry)
        //score
        console.log('postContestScore', score, selectedContest);

        if(score !== null || score !== undefined){
            handleChangeStatus('Attempting post play result...');

            let postData = {
                contestEntry: selectedContest,
                score: score,
            }

            fetch(`${apiURL}/postPlayScore`,
                {
                    method: 'POST',
                    body: JSON.stringify(postData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            .then((res) => {
                let retData = res.json();
        
                console.log(retData);
        
                retData.then((data) => {
    
                    console.log('Inside postContestScore');
                    console.log(data);
                    
                    if(data.status === 'success'){
                        handleChangeStatus(`Successfully posted contest score to GFC!`);
                    } else {
                        handleChangeStatus(`Posting score to GFC failed.`);
                    }
                    
                })
            })

        } else {
            handleChangeStatus('Attempted to post an empty score... strange!');
        }
        
    }

    const handleSetGamerName = (_gamerName) => {
        if(gamerName !== _gamerName){
            setGamerName(_gamerName);
        }
    }

    const handleSetContests = (_contests) => {
        console.log('handleSetContests', _contests);
        if(contests !== _contests){
            setContests(_contests);
        }
    }

    const handleSelectContest = (_contest) => {
        if(selectedContest !== _contest){
            setSelectedContest(_contest);
        }
    }

    const handleGetPlaysAvailable = () => {
        console.log('handleGetPlaysAvailable');
        let playsLeft = playsAvailable - usedPlays;

        console.log('handleGetPlaysAvailable', playsLeft);

        return playsLeft;
    }

    const handleCompletedPlay = (score) => {
        let _usedPlays = usedPlays;
        _usedPlays += 1;

        let _completedPlays = completedPlays;

        if(_completedPlays === null){
            _completedPlays = [];
        }

        let playResult = {
            score: score,
        }

        _completedPlays.push(playResult);

        //Send Score To GFC
        postContestScore(score);

        setUsedPlays(_usedPlays);
        setCompletedPlays(_completedPlays);
    }

    const displayContestScores = () => {
        let display = null;
        let displayEntries = null;

        if(completedPlays !== null){
            displayEntries = completedPlays.map( play => {
                return (
                    <p>Play Result - Score: {play.score} </p>
                )
            })
        }

        if(displayEntries){
            display = (
                <div>
                    {displayEntries}
                </div>
            )
        }

        return display;
    }

    const displayPlaysAvailable = () => {
        let display = null;

        if(playsAvailable !== null){

            let remaining = playsAvailable - usedPlays;
            display = (
                <p> Plays Available: {remaining} </p>
            )
        }

        return display;
    }

    return (
        <React.Fragment>
        <h1>react-simple-snake</h1>
        <GFC selectedContest={selectedContest} selectContest={handleSelectContest} setGamerName={handleSetGamerName} setContests={handleSetContests} />
        {displayPlaysAvailable()}
        {displayContestScores()}
        <div className="textWrapper">
          <p id="instructions">Use the arrow keys or W/A/S/D to play</p>
        </div>
        <SnakeGame gamerName={gamerName}  contestID={selectedContest} getPlaysAvailable={handleGetPlaysAvailable} completePlay={handleCompletedPlay} />
        </React.Fragment>
    )

}