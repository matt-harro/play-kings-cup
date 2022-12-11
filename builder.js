'use strict';

const editBtn = document.querySelector('.rules__edit-btn');

const gameData = {
  deckID: '',
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
        "In the 'Kings Court, one must be worthy, to sit on the throne 💦 💩. <br /><span class='instructions'>You may use this card once, whenever, or trade it!</span>",
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
        "The kingdom celebrates the prosperity of the wet season 💦 💩. <br /><span class='instructions'>Everyone drinks starting with you.<br/>The next person can't stop until after you do</span>",
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

const _renderRulesText = function () {
  const titleInputArr = document.querySelectorAll('.rules__input-title');

  titleInputArr.forEach(input => {
    const ruleset = document.querySelector('#rules-select').value;
    const val = input.dataset.val;
    const i = input.dataset.arrindex;
    const dataTitle = gameData.rules[ruleset][val][i];

    input.value = dataTi;

    ruleset === 'CUSTOM' ? (input.readOnly = false) : (input.readOnly = true);
  });

  const instructionsArr = document.querySelectorAll(
    '.rules__input-instructions'
  );

  instructionsArr.forEach(instr => {
    const ruleset = document.querySelector('#rules-select').value;
    const val = instr.dataset.val;
    const i = instr.dataset.arrindex;

    const dataInstr = gameData.rules[ruleset][val][i];
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
};

// EVENT change rules select
document
  .querySelector('#rules-select')
  .addEventListener('change', _renderRulesText);
