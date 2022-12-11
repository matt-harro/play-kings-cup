'use strict';

const root = document.querySelector('#root');
const btnNew = document.querySelector('.btn-new');
const btnYes = document.querySelector('age__btn--yes');

// Helper functions

const _timer = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

class App {
  gameData = {};

  constructor() {
    this.ageVerificaiton();
  }
  //////// CLASS METHODS ////////
  ageVerificaiton() {
    root.insertAdjacentHTML(
      'afterbegin',
      `<section class="header-section">
        <span class="logo">👑</span>
        <h1 class="header-logo">
          <span class="case-caps">K</span>ings
          <span class="case-caps">C</span>up
        </h1>
      </section>
      <section class="age-section">
        <div class="age__text-box animate__fade-in-top">
          <p class="age__text">
            Are you of legal age in your jurisdiction?
          </p>
        </div>
        <div class="age__row animate__fade-in">
          <button class="btn btn--slate age__btn--yes">Yes</button>
          <button class="btn btn--grey age__btn--no">No</button>
        </div>
      </section>`
    );

    const ageTextBoxEl = document.querySelector('.age__text-box');
    const ageTextEl = document.querySelector('.age__text');
    const ageRowEl = document.querySelector('.age__row');

    // EVENT age 'yes'
    document
      .querySelector('.age__btn--yes')
      .addEventListener('click', async () => {
        try {
          // Transition animations
          await this._ageBtnsOut(ageTextBoxEl, ageTextEl, ageRowEl);

          // TEST
          // await this._textFader(
          //   ageTextEl,
          //   `Drink responsibly, look after your mates...`
          // );

          ageTextBoxEl.classList.add('animate__fade-out');
          await _timer(1000);
          document.querySelector('.age-section').remove();

          // load home screenfunction
          this.loadPlaySection();
        } catch (err) {
          console.error(err);
        }
      });

    // EVENT age 'no'
    document
      .querySelector('.age__btn--no')
      .addEventListener('click', async () => {
        await this._ageBtnsOut(ageTextBoxEl, ageTextEl, ageRowEl);
        await _timer(1000);
        ageTextEl.textContent =
          'You need to be of legal drinking age to play this game!';
        ageTextEl.classList.add('animate__fade-in');
      });
  }

  async _ageBtnsOut(ageTextBoxEl, ageTextEl, ageRowEl) {
    document.querySelector('.age__row').classList.add('animate__fade-out');
    await _timer(1000);

    ageRowEl.remove();
    ageTextEl.classList.add('animate__fade-out');
    ageTextBoxEl.classList.add('h-100p');
    await _timer(1000);
  }

  async _textFader(element, str) {
    element.textContent = str;
    element.classList.add('animate__fade-in');
    await _timer(2500);
    element.classList.remove('animate__fade-in');
    element.classList.add('animate__fade-out');
    await _timer(1000);
  }

  async loadPlaySection() {
    try {
      // render startgame section
      const html = `
    <section class="play-section anitmate__fade-in">
      <button class="btn btn--slate btn--text-shadow play__btn--new animate__fade-in animate__glow">👑 New Game 🏆</button>
      ${
        (await this._gameDataValidator())
          ? '<button class="btn play__btn--load">💾 Load Game &rarr;</button>'
          : ''
      }
    </section>`;
      root.insertAdjacentHTML('beforeEnd', html);

      // EVENT play new game btn
      document
        .querySelector('.play__btn--new')
        .addEventListener('click', this.loadPlayerForm.bind(this));

      // EVENT load game btn
      if (document.querySelector('.play__btn--load'))
        document
          .querySelector('.play__btn--load')
          .addEventListener('click', this.init.bind(this));
    } catch (err) {
      console.error(err);
      // TODO handle err
    }
  }

  async _gameDataValidator() {
    try {
      // check for saved kingsCupGameData
      let savedData = this._getStorage();

      // in none load defaults
      if (!savedData) {
        this._loadDefaultGameData();
        return false;
      }

      // validate deck
      const deckID = savedData.deckID;

      const res = await fetch(
        `https://www.deckofcardsapi.com/api/deck/${deckID}/`
      );

      let { success } = await res.json(); // returns boolean

      // load game data
      if (success) this.gameData = savedData;
      if (!success) this._loadDefaultGameData();

      // validate if previous game was over
      const gameOver = savedData.kingsDrawn === 4 ? true : false;
      if (gameOver && success) {
        success = false;
        this._loadDefaultGameData(true);
      }

      return success;
    } catch (err) {
      throw new Error(err);
    }
  }

  _loadDefaultGameData(keepDeck = false) {
    // let deckID;
    // if(keepDeck) deckID = this.gameData.deckID

    this.gameData = {
      deckID: `${keepDeck ? this.gameData.deckID : ''}`,
      turnCue: [],
      playingState: false,
      activePlayer: [],
      activeRuleset: 'OG',
      cardsDrawn: [],
      kingsDrawn: 0,
      rules: {
        SFB: {
          ACE: [
            '🚽 PISS CARD',
            "In the 'Kings Court, one must be worthy, to sit on the throne 💦 💩. <br /><span class='instructions'>You may use this card once, whenever, or trade it!</span",
          ],
          QUEEN: [
            '🙊 QUESTION MASTER',
            "The Queen has been scorned and she will use any information against you.<br />Answering her questions with questions is your only defence. <br /><span class='instructions'>Drink if you answer her questions.</span>",
          ],
          JACK: [
            '📦 BOX HEAD',
            "Every castle needs a Jester. Don your uniform you piss wreck. <br /><span class='instructions'>Find a box any box and make it fit on your head.<br/>Sip your drink when anyone else takes a penalty drink. You must wear it till the next Jack is drawn</span>",
          ],
          10: [
            '🎩 RULE CARD',
            "The Kings Coucil guide him in ruling his kingdom for better or worse. <br /><span class='instructions'>Introduce 1 rule to the game.<br/>This rule stands till the next 10 is drawn.</span>",
          ],
          9: [
            '🎻 RHYME 👩‍🎤',
            "Alas! The Bard has arrived, time for merry making. <br /><span class='instructions'>Sing or speak a sentence. The next player must continue with a sentence that rhymes, and so on.<br/>The one who ruins the rhyme drinks.</span>",
          ],
          8: [
            '👨‍❤️‍💋‍👨  MATES 👩‍❤️‍👩',
            "In many kingdoms it is a bad omen to drink alone. <br /><span class='instructions'>Pick a mate, whenever one of you recieves a penalty drink...<br/>You both must 🍻 cheers and drink together</span>",
          ],
          7: [
            '🕵️‍♂️ SNAKE EYES 🐍',
            "There is a tretcherous spy in our midst and they have dirt on everyone.<br /><span class='instructions'>If anyone makes eye contact with you...<br/>they get a penalty drink.</span>",
          ],
          6: [
            '💪 HEY YA 👩‍🌾',
            "The kingdoms farmers have arrived with the fruits of thier labour.<br/>Time for a hoe down. <br /><span class='instructions'>Play a game of 'hey ya'.</span>",
          ],
          5: [
            '🧐 CATEGORIES 🗃',
            "The Quartermaster is here to present the contents of the royal coffers. <br /><span class='instructions'>Announce a category of something, anything.<br/>Then state something that fits the category. The next person states something else for that category and so on.<br/>Whoever goes outside the category first takes a penalty drink.</span>",
          ],
          4: [
            '🥁 DRUM ROLL 🎭',
            "Everyone at the feast starts drumming the table. A merry challenge is about to go down. <br /><span class='instructions'>Stand up and do a 'move', then point to someone.<br/>They must immidiately stand repeat all the previous 'moves', in order, and point to someone else etc.. <br/>Whoever messes it up step, take a penalty drink.</span>",
          ],
          3: [
            '🙃 ME ',
            "Every kingdom has a drunk.<br /><span class='instructions'>Scull you drink while your friends cheer you on.<br/>Then go get a fresh one for yourself and whoever else needs a top up.</span>",
          ],
          2: [
            '🤘 VIKINGS ⛵️',
            "The Ragnar and his Viking hoarde has crashed the celebration.<br/>Luckily they brought ale!<br /><span class='instructions'>You are the Viking leader. Whenever you put your 🤘 horns on your head.<br/>The last one to make a 'rowing' motion and say 'row, row, row...' obnoxiously...<br/>takes a penalty drink.</span>",
          ],
        },
        OG: {
          ACE: [
            '💦 WATERFALL',
            "The kingdom celebrates the prosperity of the wet season 💦 💩. <br /><span class='instructions'>Everyone drinks starting with you.<br/>The next person can't stop until after you do</span",
          ],
          QUEEN: [
            '👸 QUESTION MASTER',
            "The Queen has been scorned and she will use any information against you.<br />Answering her questions with questions is your only defence. <br /><span class='instructions'>Drink if you answer her questions.</span>",
          ],
          JACK: [
            '🙊 NEVER HAVE I EVER',
            "Confessions outside of church frowned upon, sometimes it better to drink and mask your guilt <br /><span class='instructions'>Ask a question to the group.<br/>Everyone that has done it... Takes a drink</span>",
          ],
          10: [
            '🧐 CATEGORIES 🗃',
            "The Quartermaster is here to present the contents of the royal coffers. <br /><span class='instructions'>Announce a category of something, anything.<br/>Then state something that fits the category. The next person states something else for that category and so on.<br/>Whoever goes outside the category first takes a penalty drink.</span>",
          ],
          9: [
            '🎻 RHYME 👩‍🎤',
            "Alas! The Bard has arrived, time for merry making. <br /><span class='instructions'>Sing or speak a word/sentence. The next player must continue with a word/sentence that rhymes and so on.<br/>The one who ruins the rhyme drinks.</span>",
          ],
          8: [
            '👨‍❤️‍💋‍👨  MATES 👩‍❤️‍👩',
            "In many kingdoms it is a bad omen to drink alone. <br /><span class='instructions'>Pick a mate, whenever one of you recieves a penalty drink...<br/>You both must 🍻 cheers and drink together</span>",
          ],
          7: [
            '👼 HEAVEN ☝️',
            "The kings is a catholic and can call for a communion at any time<br /><span class='instructions'>Reach for the sky...<br/>last person takes a penalty drink.</span>",
          ],
          6: [
            '🍆 DICKS 🍾',
            "In the tavern one makes a toast before raising his glass and calling cheers.<br /><span class='instructions'>Those with dicks, drink.</span>",
          ],
          5: [
            '💃 JIVE 🕺',
            "Everyone at the feast starts drumming the table. A merry challenge is about to go down. <br /><span class='instructions'>Stand up and do a 'move', then point to someone.<br/>They must immidiately stand repeat all the previous 'moves', in order, and point to someone else etc.. <br/>Whoever messes it up step, take a penalty drink.</span>",
          ],
          4: [
            '🥁 WHORES 🎭',
            "In the tavern one makes a toast before raising his glass and calling cheers.<br /><span class='instructions'>Those with clits, drink.<br/>Even if he can't find it. You know its there</span>",
          ],
          3: [
            '🙃 ME ',
            "Every kingdom has a drunk.<br /><span class='instructions'>Take 2 drinks, maybe call AA after this game</span>",
          ],
          2: [
            '👈 YOU 🖕',
            "When the king tells you to drink, you drink twice!..<br /><span class='instructions'>Pick someone to drink. They will take 2 sips.</span>",
          ],
        },
        CUSTOM: {
          ACE: ['', ''],
          QUEEN: ['', ''],
          JACK: ['', ''],
          10: ['', ''],
          9: ['', ''],
          8: ['', ''],
          7: ['', ''],
          6: ['', ''],
          5: ['', ''],
          4: ['', ''],
          3: ['', ''],
          2: ['', ''],
        },
      },
    };
  }

  // local storage methods
  _getStorage() {
    if (!localStorage.kingsCupGameData) return false;

    const data = JSON.parse(localStorage.kingsCupGameData);
    return data;
  }

  _setStorage() {
    const json = JSON.stringify(this.gameData);
    localStorage.setItem('kingsCupGameData', json);
  }

  loadPlayerForm() {
    // render form
    const html = `
      <section class="form-section overlay animate__fade-in">
        <form class="form">
          <div class="form__player-box">
            <input
              type="text"
              class="form__input w-100"
              data-playerID="1"
              placeholder="Player 1"
            />
            <button type="button" class="btn btn--grey btn--circle form__btn--removePlayer animate__fade-in">-</button>
          </div>
          <button type="button" class="btn btn--grey btn--circle form__btn--addPlayer">+</button>
          <button
            action="submit"
            type="submit"
            class="btn btn--slate btn--text-shadow form__btn--submit"
          >
            Players Ready!
          </button>
          <div action="submit" class="inline-btn-box form__btn--skip">
            <a href="#" class="inline-btn inline-btn--unskew"
              >skip it, play now <span>&rarr;</span></a
            >
          </div>
        </form>
      </section>`;
    root.insertAdjacentHTML('afterbegin', html);
    document.querySelector('.form__input').focus();

    const addPlayerBtn = document.querySelector('.form__btn--addPlayer');
    const formEl = document.querySelector('.form');

    // EVENT add player
    addPlayerBtn.addEventListener('click', () => {
      // hide btn
      addPlayerBtn.classList.add('hidden', 'animate__ghost-grow-fade-in');
      // inject now input element
      this._addInputField();
      //
      setTimeout(() => addPlayerBtn.classList.remove('hidden'), 0);
    });

    // EVENT remove player button

    document.querySelector('.form').addEventListener('click', e => {
      if (!e.target.classList.contains('form__btn--removePlayer')) return;
      const removeBtn = e.target;
      const playerBox = removeBtn.closest('.form__player-box');

      playerBox.classList.add('animate__fade-out');
      setTimeout(() => playerBox.remove(), 1000);
    });

    // EVENT Skip player rego link
    document.querySelector('.form__btn--skip').addEventListener('click', e => {
      e.preventDefault();
      formEl.requestSubmit();
    });

    // EVENT submit form
    formEl.addEventListener('submit', async e => {
      e.preventDefault();

      // reset defaults
      this._loadDefaultGameData(true);

      const inputArr = formEl.querySelectorAll('.form__input');

      // create our players for turnCue
      inputArr.forEach(inp => {
        if (!inp.value) inp.value = `Player ${inp.dataset.playerid}`;

        // create players
        new Player(inp.value);
      });

      // shuffle the deck
      await this._shuffleDeck();

      this.init();
      formEl.style.display = 'none';
    });
  }

  _addInputField() {
    const lastInput = this._getLastInputField();
    let lastPlayerBox;
    if (lastInput) lastPlayerBox = lastInput.closest('.form__player-box');

    const html = `
      <div class="form__player-box">
        <input
          type="text"
          class="form__input animate__width-spread"
          data-playerID="${lastInput ? +lastInput.dataset.playerid + 1 : 1}"
          placeholder="Player ${
            lastInput ? +lastInput.dataset.playerid + 1 : 1
          }"
          autofocus
        />
        <button type="button" class="btn btn--grey btn--circle    form__btn--removePlayer animate__fade-in--delay-1">-</button>
      </div>`;

    if (lastPlayerBox) {
      lastPlayerBox.insertAdjacentHTML('afterend', html);
      setTimeout(() => this._getLastInputField().focus(), 1000);
      return;
    }

    if (!lastPlayerBox) {
      document.querySelector('.form').insertAdjacentHTML('afterbegin', html);
      setTimeout(() => this._getLastInputField().focus(), 1000);
      return;
    }
  }

  _getLastInputField() {
    const inputArr = document.querySelectorAll('.form__input');

    return inputArr[inputArr.length - 1];
  }

  async init() {
    const sectionArr = document.querySelectorAll('section');
    try {
      this.gameData.playingState = true;

      // unmount header and play sections
      sectionArr.forEach(s => s.classList.add('animate__fade-out'));
      await _timer(1000);
      sectionArr.forEach(s => s.remove());

      // render card-section
      root.insertAdjacentHTML(
        'afterbegin',
        `<section class="card-section">
          
        </section>`
      );
      const cardSectionEl = document.querySelector('.card-section');

      // deal cards
      for (let i = 0; i < 52; i++) {
        await _timer(50);

        const cardHTML = `
        <div class="card rotate--${i} " data-cardnum='${i}'>
          <div class="card__side card__side--front"></div>
          <div class="card__side card__side--back"></div>
        </div>`;
        cardSectionEl.insertAdjacentHTML('afterbegin', cardHTML);

        const card = document.querySelector('.card');
        await _timer(20);
        card.classList.add(`card--${i}`);
        card.classList.remove(`rotate--${i}`);
      }

      // remove drawn cards
      await _timer(200);
      this.gameData.cardsDrawn.forEach(cardnum => {
        const oldCard = document.querySelector(`[data-cardnum="${cardnum}"`);
        oldCard.classList.remove(`card--${cardnum}`);
        this.discard(oldCard, 0);
      });

      // TODO intersection observer to monitor if circle is broken

      // start turn cue
      this._rotateTurn();

      // render players turn
      this._renderPlayersTurn();

      // render edit rules button
      root.insertAdjacentHTML(
        'beforeend',
        `<button class="btn btn--indigo btn--small rules__edit-btn">
          📝 Edit Rules
        </button>`
      );

      // TODO render add player button

      // EVENT picking a card
      cardSectionEl.addEventListener('click', e => {
        if (!e.target.closest('.card') || this.gameData.playingState === false)
          return;
        const card = e.target.closest('.card');
        // to stop double clicking
        if (card.classList.contains('clicked')) return;
        card.classList.add('clicked');
        this.playACard(e, card);
      });

      // EVENT clicking edit rules btn
      document
        .querySelector('.rules__edit-btn')
        .addEventListener('click', this._renderRulesForm.bind(this));
    } catch (err) {
      this._renderBanner(`💥  Something went wrong 💥 `, err.message, 'error');
      console.error(err);
    }
  }

  async _shuffleDeck() {
    try {
      const res = await fetch(
        `https://www.deckofcardsapi.com/api/deck/${
          this.gameData.deckID ? this.gameData.deckID : 'new'
        }/shuffle/?deck_count=1`
      );
      const { success, deck_id } = await res.json();
      if (!success) throw new Error(err);

      this.gameData.deckID = deck_id;
    } catch (err) {
      throw new Error(err);
    }
  }

  _rotateTurn() {
    // rotate turn cue
    if (
      this.gameData.activePlayer.length <= 1 &&
      this.gameData.turnCue.length === 0
    )
      return;

    // remove old player banner(s)
    if (document.querySelector('.player')) {
      const playerArr = document.querySelectorAll('.player');
      playerArr.forEach(banner => banner.remove());
    }

    const first = this.gameData.turnCue.shift();
    this.gameData.activePlayer.unshift(first);

    if (this.gameData.activePlayer.length > 1) {
      const last = this.gameData.activePlayer.splice(-1);
      this.gameData.turnCue.push(...last);
    }
  }

  _renderPlayersTurn(gameOver = false) {
    if (this.gameData.activePlayer.length === 0) return;

    const activePlayer = this.gameData.activePlayer[0].name;
    const html = `
    <div class="player animate__fade-in">${activePlayer}'s Turn</div>`;

    // TEST
    // if (gameOver)
    //   return (document.querySelector('.player').textContent =
    //     'GAME OVER! refresh page to start again!');

    root.insertAdjacentHTML('afterbegin', html);
  }

  async playACard(e, card) {
    const cardnum = card.dataset.cardnum;
    try {
      // draw card
      const {
        success,
        remaining,
        cards: [{ image, value }],
      } = await this._fetchCard();

      if (!success) throw new Error('fetch unsuccessful');
      // rotate turn
      this._rotateTurn();
      // remove last banner

      // add to cardsDrawn arr
      this.gameData.cardsDrawn.push(cardnum);

      // animate card
      card.classList.remove(`card--${cardnum}`);
      card.classList.add('scale-125');
      card.style.zIndex = 156 - remaining;

      //on image load: append and flip the card
      const cardImg = document.createElement('img');
      card.querySelector('.card__side--front').append(cardImg);
      cardImg.src = image;
      cardImg.addEventListener('load', () => {
        card.classList.add('turn-over');

        // render message bannders
        if (value !== 'KING')
          return this._renderBanner(
            // TODO
            this.gameData.rules[this.gameData.activeRuleset][value][0],
            this.gameData.rules[this.gameData.activeRuleset][value][1]
          );

        this._renderBannerKing();
      });

      // discard
      this.discard(card, 5000);

      // render players turn
      this._renderPlayersTurn();

      // save game
      this._setStorage();
    } catch (err) {
      console.error(err);
      this._renderBanner(`💥  Something went wrong 💥 `, err.message, 'error');
    }
  }

  async _fetchCard() {
    const res = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${this.gameData.deckID}/draw/?count=1`
    );
    const data = await res.json();
    return data;
  }

  _renderBanner(
    bannerTitle = 'No rule stated',
    bannerMsg = '',
    type = 'default'
  ) {
    // remove old banner if still there
    if (document.querySelector('.banner'))
      document.querySelector('.banner').remove();

    const html = `
      <div class="banner banner--${type} animate__fade-in-top">
      <span class="banner__close">Click banner to close [X]</span>
        <div class="banner__title-box">
          <h1 class="banner__title header__secondary">${bannerTitle}</h1>
        </div>
        <p class="banner__message">${bannerMsg}</p>
      </div>`;

    document
      .querySelector('.card-section')
      .insertAdjacentHTML('afterbegin', html);

    // remove banner
    const newBanner = document.querySelector('.banner');
    setTimeout(() => {
      newBanner.classList.add('animate__fade-out');
      setTimeout(() => newBanner.remove(), 1000);
    }, 20000);
    newBanner.addEventListener(
      'click',
      () => (newBanner.style.display = 'none')
    );
  }

  _renderBannerKing() {
    ++this.gameData.kingsDrawn;

    // end game on 4th king
    if (this.gameData.kingsDrawn === 4) this.gameData.playingState = false;

    const bannertitleHTML = `👑 KINGS CUP! ${this.gameData.kingsDrawn}/4 🍻`;

    const bannerMessageHTML = `${
      this.gameData.kingsDrawn < 4
        ? "When paying tribute to the King, one must bare a gift. <br /><span class='instructions'>Pour a generous glug into the King's Cup!</span>"
        : "The hall erupts with cheer! The king deems you worthy to drink from his cup!<br /><span class='instructions'>Pour your drink into the cup and skol it down! While your mates cheers you on!</span>"
    }`;

    this._renderBanner(bannertitleHTML, bannerMessageHTML, 'king');

    const gameOver = this.gameData.kingsDrawn === 4 ? true : false;

    if (gameOver)
      document.querySelector('.player').textContent =
        'GAME OVER! refresh page to start again!';

    this._setStorage();
  }

  discard(card, ms) {
    setTimeout(() => {
      card.classList.add('discard');
      card.classList.remove('scale-125');
      card.style.transform = `rotate(${
        Math.random() * 360 - 180
      }deg) translateY(${Math.random() * 40 - 20}px)`;
    }, ms);
  }

  _renderRulesForm() {
    // create array of 'options' for form 'select' element
    const rulesArr = this.gameData.rules;
    // <option value="OG">OG</option>
    const optionArr = [];
    for (let ruleSet in rulesArr) {
      optionArr.push(
        `<option data-rule="${ruleSet}" value="${ruleSet}">${ruleSet}</option>`
      );
    }

    const html = `
      <div class="rules-section overlay">
        <form action="submit" class="form rules__form">
          <div class="rules__close-btn">X</div>
          <div class="rules__select-box">
            <label class="rules__select-label" for="rules-select"
              >Select Rules</label
            >
            <select
              class="rules__select-input"
              name="rulesets"
              id="rules-select"
            >
            ${optionArr.join('\n')}
            </select>
          </div>

          <div class="rules__editor-box">
            <div class="rules__rule-box">
              <label class="rules__label" for="ACE">ACE: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="ACE"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="ACE"
                  class="rules__input-instructions"
                  data-val="ACE"
                  data-arrindex="1"
                  placeholder="enter a description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="TWO">TWO: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="2"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="TWO"
                  class="rules__input-instructions"
                  data-val="2"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="THREE">THREE: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="3"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="THREE"
                  class="rules__input-instructions"
                  data-val="3"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="FOUR">FOUR: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="4"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="FOUR"
                  class="rules__input-instructions"
                  data-val="4"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="FIVE">FIVE: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="5"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="FIVE"
                  class="rules__input-instructions"
                  data-val="5"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="SIX">SIX: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="6"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="SIX"
                  class="rules__input-instructions"
                  data-val="6"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="SEVEN">SEVEN: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="7"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="SEVEN"
                  class="rules__input-instructions"
                  data-val="7"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="EIGHT">EIGHT: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="8"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="EIGHT"
                  class="rules__input-instructions"
                  data-val="8"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="NINE">NINE: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="9"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="NINE"
                  class="rules__input-instructions"
                  data-val="9"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="TEN">TEN: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="10"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="TEN"
                  class="rules__input-instructions"
                  data-val="10"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="JACK">JACK: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="JACK"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="JACK"
                  class="rules__input-instructions"
                  data-val="JACK"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules__rule-box">
              <label class="rules__label" for="QUEEN">QUEEN: </label>
              <div class="rules__input-box">
                <input
                  class="rules__input-title"
                  type="text"
                  data-val="QUEEN"
                  data-arrindex="0"
                  placeholder="Rule name (required)"
                  required
                />
                <textarea
                  name="QUEEN"
                  class="rules__input-instructions"
                  data-val="QUEEN"
                  data-arrindex="1"
                  placeholder="description (optional)"
                ></textarea>
              </div>
            </div>
            <div class="rules_rule-box">
              <p>👑 KING: this rule won't change 💯</p>
            </div>
            <button type="submit" class="btn btn--slate">💾 Save    Rules</button>
            <p class="notice">
              Officially add your rule variations to the game - coming    soon
            </p>
          </div>
        </form>
      </div>`;

    root.insertAdjacentHTML('afterbegin', html);

    // TODO set OG to default ruleset
    const og = document.querySelector('[data-rule="OG"]');
    og.selected = true;

    // TODO render rules to inputs
    this._renderRulesText();

    // EVENT close form
    document.querySelector('.rules-section').addEventListener('click', e => {
      if (
        e.target.classList.contains('overlay') ||
        e.target.classList.contains('rules__close-btn')
      )
        // close rules
        document.querySelector('.rules-section').remove();
    });

    const rulesSelectEl = document.querySelector('#rules-select');

    // EVENT on option change
    rulesSelectEl.addEventListener('change', this._renderRulesText.bind(this));

    // TODO EVENT submit form
    document.querySelector('.rules__form').addEventListener('submit', e => {
      e.preventDefault();

      // save activeRuleset
      this.gameData.activeRuleset = rulesSelectEl.value;

      // update custom rules
      this._updateRules();

      // remove form
      document.querySelector('.rules-section').remove();
    });
  }

  _renderRulesText() {
    const titleInputArr = document.querySelectorAll('.rules__input-title');

    titleInputArr.forEach(input => {
      const ruleset = document.querySelector('#rules-select').value;
      const val = input.dataset.val;
      const i = input.dataset.arrindex;
      const dataTitle = this.gameData.rules[ruleset][val][i];

      input.value = dataTitle;

      ruleset === 'CUSTOM' ? (input.readOnly = false) : (input.readOnly = true);
    });

    const instructionsArr = document.querySelectorAll(
      '.rules__input-instructions'
    );

    instructionsArr.forEach(instr => {
      const ruleset = document.querySelector('#rules-select').value;
      const val = instr.dataset.val;
      const i = instr.dataset.arrindex;

      const dataInstr = this.gameData.rules[ruleset][val][i];
      // remove span elements and add new line breaks
      const spanRegex = /<\/*span.*?>/g;
      const brRegex = /<br\s*\/>/g;

      const str = dataInstr.split(spanRegex).join('').split(brRegex).join('\n');

      instr.value = str;

      // reset height => set height
      instr.style.height = 0;
      instr.style.height = (2 + instr.scrollHeight) / 10 + 'REM';

      ruleset === 'CUSTOM' ? (instr.readOnly = false) : (instr.readOnly = true);
    });
  }

  _updateRules() {
    const titlesArr = document.querySelectorAll('.rules__input-title');
    const explanationArr = document.querySelectorAll(
      '.rules__input-instructions'
    );

    const ruleSetVal = document.querySelector('#rules-select').value;

    // update titles
    titlesArr.forEach(title => {
      const titleVal = title.value;
      const cardVal = title.dataset.val;
      const ruleIndex = title.dataset.arrindex;

      this.gameData.rules[ruleSetVal][cardVal][ruleIndex] = titleVal;
    });

    explanationArr.forEach(explanation => {
      const explanationVal = explanation.value;
      const cardVal = explanation.dataset.val;
      const ruleIndex = explanation.dataset.arrindex;

      this.gameData.rules[ruleSetVal][cardVal][ruleIndex] = explanationVal;
    });
  }

  _removePlayerFromArr(ev) {
    // if player is in turn cue
    if (
      this.gameData.turnCue
        .map(player => {
          return player.name;
        })
        .contains(playerName)
    ) {
      const index = this.gameData.turnCue
        .map(player => {
          return player.name;
        })
        .indexOf(playerName);
    }

    // remove player from array
    this.gameData.turnCue.splice(index, 1);

    // if player is activePlayer
    if (this.gameData.activePlayer[0]['name'] === playerName) {
      this.gameData.activePlayer.splice(0);
      return;
    }
    console.log('player not found');
  }
}
const app = new App();

class Player {
  playerData = {
    name: '',
    titles: '',
  };

  constructor(name, titles = '') {
    this.playerData.name = name;
    this.playerData.titles = titles;
    this._pushPlayerArr();
  }
  _pushPlayerArr() {
    app.gameData.turnCue.push(this.playerData);
  }
}

// fetch('https://www.deckofcardsapi.com/api/deck/wwfcxorcoacs/shuffle/');
/*
 ** App User Flows
 **
 **  #1 AGE VERIFICATION
 **    click-ev: yes => #2 Game home screen
 **    click-ev: no => locked out
 **
 **  #2 GAME HOME SCREEN
 **    load-ev:  check storage ? show loadBtn : ""
 **    click-ev: newBtn
 **    click-ev: loadBtn
 **
 **
 **
 **
 */
