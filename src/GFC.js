import React, {useState, useEffect} from 'react';

export default function GFC (props) {

    const apiURL = 'https://us-central1-gameforcrypto.cloudfunctions.net';

    const [gamerName, setGamerName] = useState(null);
    const [gamerHashValue, setGamerHashValue] = useState("");
    const [status, setStatus] = useState(null);

    const [contests, setContests] = useState(null);

    const [selectedContest, setSelectedContest] = useState(null);

    useEffect(() => {

        if(props.selectedContest){
            console.log('props.selectedContest', props.selectedContest);
            setSelectedContest(props.selectedContest);
        }

    },[props.selectedContest])

    useEffect(() => {

        if(selectedContest){
            console.log('selectedContest', selectedContest);
        }

    },[selectedContest])

    useEffect(() => {
        if(gamerName){
            if(props.setGamerName){
                //Set Gamer Name
                props.setGamerName(gamerName);
            }
        }
    },[gamerName])

    useEffect(() => {
        if(contests){
            console.log(`Contests`, contests);
            if(props.setContests){
                //Set Contests
                props.setContests(contests);
            }
        }
    },[contests])

    const handleChangeStatus = (_status) => {
        setStatus(_status);
    }

    const handleConnectGFC = () => {
        console.log('handleConnectGFC', gamerHashValue);

        if(gamerHashValue !== ""){
            handleChangeStatus('Attempting GFC connection...');

            let postData = {
                gamerHash: gamerHashValue,
                game: 'Snake',
            }

            fetch(`${apiURL}/connectFromGame`,
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
    
                    console.log('Inside handleConnectGFC');
                    console.log(data);
                    
                    if(data.gamerName){
                        setGamerName(data.gamerName);
                        handleChangeStatus(`Successfully connected to GFC! Welcome ${data.gamerName}`);
                    }

                    if(data.contests){
                        setContests(data.contests);
                    }

                    
                })
            })

        } else {
            handleChangeStatus('Could not connect. No gamer has specified.');
        }
        
    }

    const handleSelectContest = (contestID) => {

        if(props.selectContest){
            props.selectContest(contestID);
        }

    }

    const displayGamerHashForm = () => {
        let display = null;

        if(gamerName === null){
            display = (
                <div>
                    <label>Gamer Hash: </label>
                    <input type={'text'} value={gamerHashValue} onChange={(event) =>{
                        setGamerHashValue(event.target.value);
                    }}/>
                    <button
                    onClick={() => {
                        handleConnectGFC();
                    }}
                    > Connect To GFC! </button>
                </div>
            )
        }

        return display;
    }

    const displayGamerName = () => {
        let display = null;

        if(gamerName){
            display = (
                <div>
                    <h3> Gamer Name: {gamerName} </h3>
                </div>
            )
        }

        return display;
    }

    const displayContests = () => {
        let display = null;
        let displayEntries = [];

        if(contests){
            for(let contest in contests){

                let _playStatus = null;

                if(selectedContest === contest){
                    _playStatus = (
                        <h4> ACTIVE! </h4>
                    )
                } else {
                    _playStatus = (
                        <button
                        onClick={() => {
                            handleSelectContest(contest);
                        }}
                        > Play Contest! </button>
                    )
                }
                let _entry = (
                    <React.Fragment>
                    <p> ContestID: {contests[contest].contestID} </p>
                    <p> Goal: {contests[contest].goalDesc} </p>
                    {_playStatus}
                    </React.Fragment>
                )

                displayEntries.push(_entry);
            }
        }

        if(displayEntries.length > 0){
            display = (
                <React.Fragment>
                    {displayEntries}
                </React.Fragment>
            )
        }

        return display;
    }

    const displaySelectedContest = () => {
        let display = null;

        if(selectedContest){
            display = (
                <div>
                    <h3> Active Contest: {selectedContest} </h3>
                </div>
            )
        }

        return display;
    }

    return (
        <div>
            <h2>Game For Crypto Integration</h2>
            {displayGamerHashForm()}
            {displayGamerName()}
            {displayContests()}
            {displaySelectedContest()}
        </div>
    )
}