//Created by: Byron Georgopoulos
//Created on: 24/07/2020
//Last Updated on: 29/07/2020
//Created for: HyperionDev: L02T12 - Capstone I
//Description: This is where my states, global variables, functions, and all rendering happens my Blackjack game, made using 'npx create-react-app.

//Import React
import React from 'react';

//Font-Awesome (for Icons)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from '@fortawesome/free-brands-svg-icons';
import { faWallet, faRedo, faQuestionCircle, faLock, faThumbsUp, faSync, faSmile, faPoop, faMeh, faGrinStars, faUser, faHome, faTimes, faHandPaper, faHandPointer, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

//Import React-Bootstrap Components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

//Global Boolean Variables
let userLockedBet = false;
let sufFunds = true;
let userLost = false;
let userBlackjack = false;
let userWon = false;
let breakEven = false;
let custBet = false;

class Blackjack extends React.Component {

    constructor(props) {
        super(props);

        //State Variables Declaration / Initialization
        this.state = {
            wallet: 100,
            userBet: 0,
            userHand: [],
            renderUserHand: [],
            userTot: 0,
            dealerHand: [],
            renderDealerHand: [],
            dealerTot: 0,
            errorMsg: '',
            showModal: false,
        };

        //FAQ Modal Bind
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    //Handles the users desired bet amount (whether from dropdown or input box
    //Input box has if statements to determine whether value entered is valid or not
    handleUserBet = (event) => {
        let userBet = event.target.value;
        let userBetNum = parseFloat(userBet);

        this.setState({ userBet: userBetNum });

        if (userBet > this.state.wallet)
        {
            sufFunds = false;
            let errorMsg = 'You have entered an amount of: $' + userBet + ', which is more than your current wallet of: $'
                            + this.state.wallet + '. Please enter an ammount less than: $' + this.state.wallet + '.';
            this.setState({ errorMsg: errorMsg});
        }
        else
        {
            if (userBet <= 0)
            {
                sufFunds = false;
                let errorMsg = 'Please enter a valid amount or an amount greater than $0.';
                this.setState({ errorMsg: errorMsg });
            }
                else
                {
                    sufFunds = true;
                } 
        }
    }

    //Function that checks what cards must be red for the user
    redCardUser = (userHand) => {

        if (userHand.includes('♦') || userHand.includes('♥'))
        {
            return { color: 'red' }
        }
    }

    //Function that checks what cards must be red for the dealer
    redCardDealer = (dealerHand) => {

        if (dealerHand.includes('♦') || dealerHand.includes('♥')) {
            return { color: 'red' }
        }
    }

    //Renders the users hand using array.map
    renderUserHand = () => {
        let userHand = this.state.userHand;

        const renderUserHand = userHand.map((userHand, index) =>
            <div id='userCards'>
                <ListGroup.Item>
                    <h6>Card# {index + 1}</h6>
                    <hr></hr>
                    <br></br>
                    <h2 style={this.redCardUser(userHand)}>{userHand}</h2>
                    <br></br>
                </ListGroup.Item>
            </div>
        );

        this.setState({ renderUserHand: renderUserHand });
    }

    //Renders the dealers hand using array.map
    renderDealerHand = () => {

        const dealerHand = this.state.dealerHand;

        const renderDealerHand = dealerHand.map((dealerHand, index) =>
           <div id='dealerCards'>
                <ListGroup.Item>
                    <h6>Card # {index + 1}</h6>
                    <hr></hr>
                    <br></br>
                    <h2 style={this.redCardDealer(dealerHand)}>{dealerHand}</h2>
                    <br></br>
                </ListGroup.Item>
           </div>
        );

        this.setState({ renderDealerHand: renderDealerHand});
    }

    //Generates a random hand for the user before it is rendered above
    genUserHand = () => {
        userLockedBet = true;

        //Initialize Deck (Array)
        const cardNum = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
        const cardSuit = ['♦', '♣', '♥', '♠'];

        //Random Card 1 for the user
        let randomNum1 = Math.floor((Math.random() * 13));
        let userNum1 = cardNum[randomNum1];
        let randomSuit1 = Math.floor((Math.random() * 4));
        let userSuit1 = cardSuit[randomSuit1];

        //Random Card 2 for the user
        let randomNum2 = Math.floor((Math.random() * 13));
        let userNum2 = cardNum[randomNum2];
        let randomSuit2 = Math.floor((Math.random() * 4));
        let userSuit2 = cardSuit[randomSuit2];

        //Creates the user's hand, and pushs it to an array
        const userHand = this.state.userHand;
        let userCard1 = userSuit1 + userNum1;
        userHand.push(userCard1);
        let userCard2 = userSuit2 + userNum2;
        userHand.push(userCard2);

        //Sets the state of the users FULL hand (2 cards in total)
        this.setState({ userHand: userHand});

        //Initializes the value of the two cards
        let card1 = 0;
        let card2 = 0;

        //Card 1: Determines if a letter card is drawn randomly above, and it's corresponding value as a number
        if (typeof userNum1 === 'string')
        {
            if (userNum1 === 'J' || userNum1 === 'Q' || userNum1 === 'K')
            {
                card1 = 10;
            }
            else
            {
                if (userNum1 === 'A')
                {
                    card1 = 11;
                }
            }
        }
        else
        {
            card1 = userNum1;
        }

        //Card 2:  Determines if a letter card is drawn randomly above, and it's corresponding value as a number
        if (typeof userNum2 === 'string')
        {
            if (userNum2 === 'J' || userNum2 === 'Q' || userNum2 === 'K')
            {
                card2 = 10;
            }
            else
            {
            if (userNum2 === 'A')
                {
                    card2 = 11;
                }
            }
        }
        else
        {
            card2 = userNum2;
        }

        //Adds the two cards together and determine the user's hand
        let userTot = this.state.userTot;
        userTot = card1+card2;
        this.setState({userTot: userTot});

        //Various checks, and updates the state of the users wallet, depending on their bet
        if (userTot > 21)
        {
            console.log('Error. Double Aces');
        }
        else
        {
            let wallet = this.state.wallet;
            let userBet = this.state.userBet;

            if (userTot === 21)
            {
                userBlackjack = true;
                let newWallet = wallet + (userBet * 1.5);
                this.setState({ wallet: newWallet });
            }
        }
    }

    //Generates a random hand for the dealer before it is rendered above (Note: dealer only has one card on render)
    genDealerHand = () => {

        //Initialize Deck (Array)
        const cardNum = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        const cardSuit = ['♦', '♣', '♥', '♠'];

        //Random card for the dealer
        let randomNum1 = Math.floor((Math.random() * 13));
        let dealerNum1 = cardNum[randomNum1];
        let randomSuit1 = Math.floor((Math.random() * 4));
        let dealerSuit1 = cardSuit[randomSuit1];

        //Creates the dealer's hand, and pushs it to an array
        const dealerHand = this.state.dealerHand;
        let dealerCard1 = dealerSuit1+dealerNum1;
        dealerHand.push(dealerCard1);

        //Sets the state of the dealers FULL hand (1 card in total)
        this.setState({ dealerHand: dealerHand});

        //Initializes the value of the dealers 1 card
        let card1 = 0;

        //Determines if a letter card is drawn randomly above, and it's corresponding value as a number
        if (typeof dealerNum1 === 'string') {
            if (dealerNum1 === 'J' || dealerNum1 === 'Q' || dealerNum1 === 'K') {
                card1 = 10;
            }
            else {
                if (dealerNum1 === 'A') {
                    card1 = 11;
                }
            }
        }
        else {
            card1 = dealerNum1;
        }

        //Sets the state of the dealers hand
        let dealerTot = this.state.dealerTot;
        dealerTot = card1
        this.setState({ dealerTot: dealerTot });

    }

    //For when the 'Lock in Bet' button is pressed. 
    lockInBet = () => {

        //Changes global boolean variable for rendering
        userLockedBet = true;
        //Changes state of users wallet and bet
        let userBet = this.state.userBet;
        let wallet = this.state.wallet;
        
        //If statement to determine if the user's desired bet is bigger than their current wallet
        if (userBet > wallet)
        {
            sufFunds = false;
            userLockedBet = false;
            this.forceUpdate();
            this.setState({ userHand: [] });
            this.setState({ dealerHand: [] });
        }
        else
        {
            userLockedBet = true;
            sufFunds = true;
            this.forceUpdate();
            this.setState({ userBet: userBet});
            let newWallet = wallet - userBet;
            this.setState({ wallet: newWallet});
        }

    }

    //Function when the user clicks the 'Hit' button
    userHit = () => {

        //Set State of the users wallet and bet
        let userBet = this.state.userBet;
        let wallet = this.state.wallet;

        //Initialize Deck (Array)
        const cardNum = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        const cardSuit = ['♦', '♣', '♥', '♠'];

        //Random Card for the user if the chose to Hit
        let randomNum1 = Math.floor((Math.random() * 13));
        let userNum1 = cardNum[randomNum1];
        let randomSuit1 = Math.floor((Math.random() * 4));
        let userSuit1 = cardSuit[randomSuit1];

        //Pushes the new random card to the array
        const userHand = this.state.userHand;
        let userCard1 = userSuit1 + userNum1;
        userHand.push(userCard1);

        //Sets the state of the new deck into the array in the this.state above
        this.setState({ userHand: userHand });

        //Initializes the value of the card
        let card1 = 0;

        //Determines if a letter card is drawn randomly above, and it's corresponding value as a number
        if (typeof userNum1 === 'string') 
        {
            if (userNum1 === 'J' || userNum1 === 'Q' || userNum1 === 'K')
            {
                card1 = 10;
            }
            else
            {
                if (userNum1 === 'A')
                {
                    card1 = 11;
                }
            }
        }
        else
        {
            card1 = userNum1;
        }

        //Adds the new cards value to the state of the previous users total hand
        let userTot = this.state.userTot;
        userTot = userTot + card1;
        
        //Determine if the user lost, or hit a blackjack (21), and cash out accordingly
        if (userTot > 21)
        {
            userLost = true;
        }
        else
        {
            if (userTot === 21)
            {
                userBlackjack = true;
                let newWallet = wallet + (userBet *2.5);
                this.setState({ wallet: newWallet});
            }
        }
        
        //Sets the state of the users new total hand
        this.setState({ userTot: userTot});

    }

    //Function when the user clicks the 'Stand' button
    userStand = () => {

        //Gets the value of the dealers current hand
        let dealerTot = this.state.dealerTot;

        //Initialize Deck (Array)
        const cardNum = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        const cardSuit = ['♦', '♣', '♥', '♠'];

        //While the dealers total hand is less than 17, the dealer must keep drawing cards
        do
        {
            let randomNum1 = Math.floor((Math.random() * 13));
            let dealerNum1 = cardNum[randomNum1];
            let randomSuit1 = Math.floor((Math.random() * 4));
            let dealerSuit1 = cardSuit[randomSuit1];

            const dealerHand = this.state.dealerHand;
            let dealerCard1 = dealerSuit1 + dealerNum1;
            dealerHand.push(dealerCard1);

            this.setState({ dealerHand: dealerHand });

            let card1 = 0;

            if (typeof dealerNum1 === 'string') {
                if (dealerNum1 === 'J' || dealerNum1 === 'Q' || dealerNum1 === 'K') {
                    card1 = 10;
                }
                else {
                    if (dealerNum1 === 'A') {
                        card1 = 11;
                    }
                }
            }
            else {
                card1 = dealerNum1;
            }

            dealerTot = dealerTot + card1;
            this.setState({ dealerTot: dealerTot });

        }
        while (dealerTot < 17)

        //Creates local variables of the current state of the users total hand, the dealers total hand, and the amount the user bet / locked in
        let userTot = this.state.userTot;
        let wallet = this.state.wallet;
        let userBet = this.state.userBet;
        
        //Determine if the users total is greater than the dealers total, and changes the global boolean variable (userWon) to true for rendering purposes
        //It also puts the users winiings (and original locked in amount) back into their wallet via setState
        if (userTot > dealerTot)
        {
            userWon = true;
            let newWallet = wallet + (userBet * 2);
            this.setState ({ wallet: newWallet});
        }

        //Determines if the dealer went 'bust' (drew too many cards and went over 21) and does the same as the above if statement
        if (dealerTot > 21)
        {
            userWon = true;
            let newWallet = wallet + (userBet * 2);
            this.setState({ wallet: newWallet });
        }

        //Determines if the dealers total is less than 21 (didn't go bust) AND is greater than the users total
        //It then updates global boolean variables for rendering purposes, to indicate the user lost
        if (dealerTot > userTot && dealerTot < 21)
        {
            userLost = true;
            userWon = false;
        }

        //Determines if the users and dealers values are equal, and that the delaers total is less than 21 (didn't go bust)
        //It then gives the user back their locked in amount into their wallet, since it was a tie (break even: no money lost or won)
        if (dealerTot === userTot && dealerTot < 21)
        {
            breakEven = true;
            let newWallet = wallet + (userBet);
            this.setState({ wallet: newWallet});
        }

        //Determines if the dealer hit 21, and updates global boolean variables for rendering purposes to indicate that the user lost
        if (dealerTot === 21)
        {
            userWon = false;
            userLost = true;
        }

        //Determines if the user hit a blackjack, and updates global boolean variables for rendering purposes
        if (userTot === 21)
        {
            userBlackjack = true;
        }
        
    }

    //Function for when a round is over, and the 'Try Again?' button is clicked
    tryAgain = () => {

        //Resets all the global boolean variables to their default, so that a new round can start and all rendered components disapear or change
        userLockedBet = false;
        userLost = false;
        userBlackjack = false;
        userWon = false;
        breakEven = false;

        //Sets the state of all the arrays and values to their default (except for the wallet), as a new round has started
        this.setState({ userBet: 0});
        this.setState({ userHand: []});
        this.setState({ renderUserHand: []});
        this.setState({ userTot: 0});
        this.setState({ dealerHand: []});
        this.setState({ renderDealerHand: []});
        this.setState({ dealerTot: 0});
    }

    //Function for when the user wants to restart the game (set their wallet back to $100), and the 'Restart' button is clicked
    restart = () => {

        //Resets all the global boolean variables to their default
        userLockedBet = false;
        userLost = false;
        userBlackjack = false;
        userWon = false;
        breakEven = false;

        //Sets the state of all the arrays and values to their default (including the wallet), as a new whole game has started
        this.setState({ wallet: 100});
        this.setState( {userBet: 0});
        this.setState({ userBet: 0 });
        this.setState({ userHand: [] });
        this.setState({ renderUserHand: [] });
        this.setState({ userTot: 0 });
        this.setState({ dealerHand: [] });
        this.setState({ renderDealerHand: [] });
        this.setState({ dealerTot: 0 });
    }

    //Sets the state of the FAQ modal's boolean value to true, in order to display the FAQ modal
    openModal = () => {
        this.setState({ showModal: true});
    }

    //Sets the state of the FAQ modal's boolean value to false, in order to close the FAQ modal
    closeModal = () => {
        this.setState({ showModal: false});
    }

    //Function that changes the state of the global boolean value 'custBet', if the user wants to input their own bet via the keyboard instead of via the dropdown menu provided, simply for rendering purposes
    //Note: using the input field instead of the dropdown menu to place bets is not reccomended
    custBet = () => {
        custBet = !custBet;
        this.forceUpdate();
    }

    //Where everything is displayed and rendered for the user to see
    render() {

        return (
            <blackjack className='App'>

                {/* The FAQ Modal Starts */}

                <Modal id='rulesModal' show={this.state.showModal} onHide={this.closeModal} animation={true} centered size='xl'>
                    <Modal.Body>
                        <h2><FontAwesomeIcon icon={faReact} /> Reac-Jack FAQ <FontAwesomeIcon icon={faReact} /> </h2>
                        <hr></hr>
                        <Tabs id="uncontrolled-tab-example">
                            <Tab eventKey='rules' title='Reac-Jack Rules'>
                                <br></br>
                                <h4> <FontAwesomeIcon icon={faExclamationCircle} /> Reac-Jack Rules & Differences to Classic Blackjack:</h4>
                                <br></br>
                                <ListGroup id='rulesList'>
                                    <ListGroup.Item>1. The goal of blackjack is to beat the dealer's hand without going over 21.</ListGroup.Item>
                                    <ListGroup.Item>2. Face cards are worth 10, and Aces are worth 11. This is unlike classic blackjack, where Aces are worth either 11 or 1. Watch out for this.</ListGroup.Item>
                                    <ListGroup.Item>3. Each player starts with two cards, and one of the dealer's cards is hidden until the end.</ListGroup.Item>
                                    <ListGroup.Item>4. To 'Hit' is to ask for another card. To 'Stand' is to hold your total and end your turn.</ListGroup.Item>
                                    <ListGroup.Item>5. If you go over 21, you go bust (lose), and the dealer wins regardless of the dealer's hand.</ListGroup.Item>
                                    <ListGroup.Item>6. If you are dealt 21 from the start (Ace & 10), you got a blackjack. If you hit 21 at all before it is the dealer's turn, you still get a blackajck (unlike in classic blackjack).</ListGroup.Item>
                                    <ListGroup.Item>7. A blackjack means you win what you bet, plus 50%.</ListGroup.Item>
                                    <ListGroup.Item>8. For example, if you bet $10, and get a blackjack, you will get a total of $25 (the $10 you bet, plus another $10 for winning, plus 50% of $10 (which is $5) for a total of $25).</ListGroup.Item>
                                    <ListGroup.Item>9. The dealer will hit until his/her cards total 17 or higher.</ListGroup.Item>
                                    <ListGroup.Item>10. There is no 'doubling down' in Reac-Jack (unlike classic blackjack).</ListGroup.Item>
                                    <ListGroup.Item>11. There is no splitting cards in Reac-Jack (unlike classic blackjack).</ListGroup.Item>
                                </ListGroup>
                            </Tab>
                            <Tab eventKey='ui' title='User Interface'>
                                <br></br>
                                <h4> <FontAwesomeIcon icon={faHandPointer} />  User Interface: </h4>
                                <br></br>
                                <ListGroup id='rulesList'>
                                    <ListGroup.Item>
                                        <Container>
                                            <Row>
                                                <Col sm={4}><Button className='uiBtns' variant='dark'><FontAwesomeIcon icon={faSync} /> Restart</Button></Col>
                                                <Col sm={8}><h6 className='uiText'>Restarts the whole game, setting your wallet back to $100.</h6></Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Container>
                                            <Row>
                                                <Col sm={4}><Button className='uiBtns' variant='info'><FontAwesomeIcon icon={faQuestionCircle} /> FAQ</Button></Col>
                                                <Col sm={8}><h6 className='uiText'>Rules of Reac-Jack, differences to classic Blackjack, and UI Help (this pop-over).</h6></Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Container>
                                            <Row>
                                                <Col sm={4}><h6 className='uiText'><FontAwesomeIcon icon={faWallet} />  Your Wallet: ${this.state.wallet}.</h6></Col>
                                                <Col sm={8}><h6 className='uiText'>Your current wallet. The default (starting) amount is $100.</h6></Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Container>
                                            <Row>
                                                <Col sm={4}>
                                                    <Form.Control id='uiSelect' disabled as='select' custom onChange={this.handleUserBet}>
                                                    <option defaultValue value='0'>Please Select A Value</option>
                                                    <option value='5'>5</option>
                                                    <option value='10'>10</option>
                                                    <option value='15'>15</option>
                                                    <option value='20'>20</option>
                                                    <option value='25'>25</option>
                                                    <option value='50'>50</option>
                                                </Form.Control>
                                                </Col>
                                                <Col sm={8}><h6 className='uiText'>Dropdown to select bet amount (in $ / USD) to lock in before cards are dealt.</h6></Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Container>
                                            <Row>
                                                <Col sm={4}><Button className='uiBtns' variant='success'><FontAwesomeIcon icon={faLock} /> Lock In Bet</Button></Col>
                                                <Col sm={8}><h6 className='uiText'>Locks in your bet (removing the $ from your wallet), and deals the cards.</h6></Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Container>
                                            <Row>
                                                <Col sm={4}><Button className='uiBtns' variant='primary'><FontAwesomeIcon icon={faThumbsUp} /> Hit!</Button></Col>
                                                <Col sm={8}><h6 className='uiText'>Draws another card for the player (see Rule#4 in the 'Rules' tab).</h6></Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Container>
                                            <Row>
                                                <Col sm={4}><Button className='uiBtns' variant='warning'><FontAwesomeIcon icon={faHandPaper} /> Stand</Button></Col>
                                                <Col sm={8}><h6 className='uiText'>Stops players turn, & starts dealers turn (see Rule#4 in the 'Rules' tab).</h6></Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Container>
                                            <Row>
                                                <Col sm={4}><Button className='uiBtns' variant='success'> <FontAwesomeIcon icon={faRedo} /> Try Again?</Button></Col>
                                                <Col sm={8}><h6 className='uiText'>Round is over. Click to start another round (outcome of round indicated above).</h6></Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='danger' onClick={this.closeModal}> <FontAwesomeIcon icon={faTimes} /> Close</Button>
                    </Modal.Footer>
                </Modal> 

                {/* The FAQ Modal Ends */}

                <br></br>
                <h1> <FontAwesomeIcon icon={faReact} /> Reac-Jack <FontAwesomeIcon icon={faReact} /></h1>
                <hr></hr>
                <h5>This is my take of the popular casino game: Blackjack (a.k.a 21). It is pretty much identical to the orginal,
                    with a couple of changes implemented. Click the 'Rules' button below to see a full list of the rules. Enjoy, and
                    gamble responsibly.</h5>
                <br></br>
                <h6>This was made by Byron Georgopoulos for <a href='https://www.hyperiondev.com/' target='_blank'>HyperionDev</a> (L02T12 - Capstone I) using React Components.</h6>
                <hr></hr>
                <Container>
                    <Row>
                        <Col>
                            <Button onClick={this.restart} id='restartBtn' variant='dark'><FontAwesomeIcon icon={faSync} /> Restart</Button>
                        </Col>
                        <Col>
                            <Button onClick={this.openModal} id='rulesBtn' variant='info'><FontAwesomeIcon icon={faQuestionCircle} /> FAQ</Button>
                        </Col>
                    </Row>
                </Container>

                <hr></hr>
                <h4> <FontAwesomeIcon icon={faWallet} />  Your Wallet: ${this.state.wallet}.</h4>

                {/* START: Determines if the userLockedBet global boolean variable is true or false for rendering and display */}
                {
                    !userLockedBet &&
                    <div>
                        <hr></hr>
                        <Form id='userBet'>
                            <Form.Group>
                                <Form.Label>Place Your Bet (in $ / USD):</Form.Label>
                                <Form.Control as='select' custom onChange={this.handleUserBet}>
                                    <option defaultValue value='0'>Please Select A Value</option>
                                    <option value='5'>5</option>
                                    <option value='10'>10</option>
                                    <option value='15'>15</option>
                                    <option value='20'>20</option>
                                    <option value='25'>25</option>
                                    <option value='50'>50</option>
                                </Form.Control>
                                <Button onClick={this.custBet} variant='link'>Not Recommended: Use a custom value. (Click to Hide/Show).</Button>
                                {
                                    custBet &&
                                    <div>
                                        <Form.Control onChange={this.handleUserBet} type='text' placeholder='e.g. 10' /> 
                                    </div>
                                }
                            </Form.Group>
                            <Form.Group>
                                <br></br>
                                {
                                    sufFunds &&
                                    <div>
                                        <Button onClick={() => { this.lockInBet(); this.genUserHand(); this.renderUserHand(); this.genDealerHand(); this.renderDealerHand(); }} variant='success'><FontAwesomeIcon icon={faLock} /> Lock In Bet</Button>
                                        <p id='lockInTxt'>(and deal the cards...)</p>
                                    </div>
                                }
                            </Form.Group>
                            <Form.Group>
                                {
                                    !sufFunds &&
                                    <div>
                                        <h6>{this.state.errorMsg}</h6>
                                    </div>
                                }
                            </Form.Group>
                        </Form>
                        <hr></hr>
                    </div>
                }
                {/* END: Determines if the userLockedBet global boolean variable is true or false for rendering and display */}


                {/* START: Determines if the userLockedBet global boolean variable is true, and displays the users and dealers cards and total hand*/}
                {/* START: It also renders users Locked In Bet*/}
                {
                    userLockedBet &&
                    <div>
                        <hr></hr>
                        <h5>You locked in a bet of: ${this.state.userBet}.</h5>
                        
                        {/* START: Displays/renders the 'Hit' and 'Stand' buttons, if all global boolean variables are set to false (meaning the round is still in session*/}
                        {
                            !userBlackjack &&
                            <div>
                                
                                {
                                    !userLost &&
                                    <div>

                                        {
                                            !userWon &&
                                            <div>

                                                {
                                                    !breakEven &&
                                                    <div>
                                                        <br></br>
                                                        <Container>
                                                            <Row>
                                                                <Col>
                                                                    <Button onClick={() => { this.userHit(); this.renderUserHand(); }} id='hitBtn' variant='primary'><FontAwesomeIcon icon={faThumbsUp} /> Hit!</Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button onClick={() => { this.userStand(); this.renderDealerHand(); }} id='standBtn' variant='warning'><FontAwesomeIcon icon={faHandPaper} /> Stand</Button>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                        <br></br>
                                                    </div>
                                                }

                                            </div>
                                        }

                                    </div>
                                }

                            </div>
                        }
                        {/* END: Displays/renders the 'Hit' and 'Stand' buttons, if all global boolean variables are set to false (meaning the round is still in session*/}

                        {/* START: Renders if the user Lost the round */}
                        {
                            userLost &&
                            <div>
                                <br></br>
                                <h3><FontAwesomeIcon icon={faPoop} /> You Lose!</h3>
                                <br></br>
                                <Button onClick={this.tryAgain} variant='success'> <FontAwesomeIcon icon={faRedo} /> Try Again?</Button>
                            </div>
                        }
                        {/* END: Renders if the user Lost the round */}

                        {/* START: Renders if the user got a blackjack */}
                        {
                            userBlackjack &&
                            <div>
                                <br></br>
                                <h3> <FontAwesomeIcon icon={faGrinStars} /> Blackjack! You won big.</h3>
                                <br></br>
                                <Button onClick={this.tryAgain} variant='success'> <FontAwesomeIcon icon={faRedo} /> Try Again?</Button>
                            </div>
                        }
                        {/* END: Renders if the user got a blackjack */}

                        {/* START: Renders if the user won the round */}
                        {
                            userWon &&
                            <div>
                                <br></br>
                                <h3><FontAwesomeIcon icon={faSmile} /> You Win!</h3>
                                <br></br>
                                <Button onClick={this.tryAgain} variant='success'> <FontAwesomeIcon icon={faRedo} /> Try Again?</Button> 
                            </div>
                        }
                        {/* END: Renders if the user won the round */}

                        {/* START: Renders if the user break even with the dealer (tie) */}
                        {
                            breakEven &&
                            <div>
                                <br></br>
                                <h3> <FontAwesomeIcon icon={faMeh} /> Your broke even!</h3>
                                <br></br>
                                <Button onClick={this.tryAgain} variant='success'> <FontAwesomeIcon icon={faRedo} /> Try Again?</Button>
                            </div>
                        }
                        {/* END: Renders if the user break even with the dealer (tie) */}

                        <hr></hr>

                            {/* START: Renders the user's card and total of their hand (using array.map and with a list component) */}
                            <h4> <FontAwesomeIcon icon={faUser} /> Your Hand ({this.state.userTot}): </h4>
                            <br></br>
                            <ListGroup horizontal id='userCardLS'>
                                {this.state.renderUserHand}
                            </ListGroup>
                            {/* END: Renders the user's card and total of their hand (using array.map and with a list component) */}

                            <br></br>
                            <hr></hr>

                            {/* START: Renders the dealer's card and total of their hand (using array.map and with a list component) */}
                            <h4> <FontAwesomeIcon icon={faHome} /> Dealer's Hand ({this.state.dealerTot}): </h4>
                            <br></br>
                            <ListGroup horizontal id='dealerCardLS'>
                                    {this.state.renderDealerHand}
                            </ListGroup>
                            {/* END: Renders the dealer's card and total of their hand (using array.map and with a list component) */}

                            <br></br>
                            <hr></hr>

                    </div>
                }
                {/* END: Determines if the userLockedBet global boolean variable is true, and displays the users and dealers cards and total hand*/}
                {/* END: It also renders users Locked In Bet*/}

            </blackjack>
        );
    
    }

}

export default Blackjack;