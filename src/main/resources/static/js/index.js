ADVERBS = function () {
  let blank = "______";

  const URL = 'https://deutsch-lernen-api.herokuapp.com/myendpoint';

  let Question = function (prompt, answer) {
    this.prompt = prompt;
    this.answer = answer;
  };

  let apiResult = [];
  $.ajax({
    url: URL,
    async: false,
    dataType: 'json',
    success: function (json) {
      apiResult = json;
    }
  });

  function createQuestionFromApiResponse(result) {
    return new Question(result.prompt.replace(result.answer, `${blank}`)
        .replace(result.answer.charAt(0).toUpperCase() + result.answer.slice(1), `${blank}`)
        , result.answer);
  }

  let questions = apiResult.map(result => createQuestionFromApiResponse(result));
  let answers = questions.map(question => question.answer);

  $('button').click(function () {
    if ($(this).text() === questions[$(this).data("id")].answer) {
      $("#result").text('Korrekt');
      refreshStage();
      let $score = $("#score");
      let currentScore = $score.text();
      $score.text(Number(currentScore) + 10);
    } else {
      $("#result").text('Falsch')
    }
  });

  function getAdjustedIndex(value) {
    return answers.indexOf(value) + 1;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function refreshStage() {
    let question = questions[getRandomInt(questions.length)];

    //refresh the prompt
    $("#prompt").text(questions[questions.indexOf(question)].prompt);

    //fill up a random button with correct answer
    let answerButtonsAlreadyFilledUp = [];
    let answersUsedSoFar = [];
    let firstAnswerId = getRandomInt(3);

    answerButtonsAlreadyFilledUp.push(firstAnswerId + 1);
    answersUsedSoFar.push(answers.indexOf(question.answer));

    let adjustedFirstId = firstAnswerId + 1;
    let $firstAnswer = $("#answer" + adjustedFirstId);
    $firstAnswer.text(question.answer);
    $firstAnswer.data("id", questions.indexOf(question));

    //fill up two more buttons with fake answers
    while (answerButtonsAlreadyFilledUp.length !== 3) {
      let nextButtonAnswerId = getRandomInt(3) + 1;
      if (answerButtonsAlreadyFilledUp.indexOf(nextButtonAnswerId) === -1) {
        let nextAnswerId = getRandomInt(questions.length);
        if (answersUsedSoFar.indexOf(nextAnswerId) === -1) {
          answerButtonsAlreadyFilledUp.push(nextButtonAnswerId);
          answersUsedSoFar.push(nextAnswerId);
          let $nextAnswer = $("#answer" + nextButtonAnswerId);
          $nextAnswer.text(answers[nextAnswerId]);
          $nextAnswer.data("id", questions.indexOf(question));
        }
      }
    }
  }

  return {
    start: refreshStage
  }
}();

ADVERBS.start();
