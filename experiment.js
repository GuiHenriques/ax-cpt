/* ************************************ */
/* Define helper functions */
/* ************************************ */
function evalAttentionChecks() {
  var check_percent = 1;
  if (run_attention_checks) {
    var attention_check_trials =
      jsPsych.data.getTrialsOfType("attention-check");
    var checks_passed = 0;
    for (var i = 0; i < attention_check_trials.length; i++) {
      if (attention_check_trials[i].correct === true) {
        checks_passed += 1;
      }
    }
    check_percent = checks_passed / attention_check_trials.length;
  }
  return check_percent;
}

var getChar = function (isRed) {
  var textClass = isRed ? "AX_text red-text" : "AX_text";

  return (
    "<div class = centerbox><div class='" +
    textClass +
    "'>" +
    chars[Math.floor(Math.random() * 22)] +
    "</div></div>"
  );
};

var getInstructFeedback = function (text) {
  return (
    "<div class = centerbox><p class = center-block-text>" +
    text +
    "</p></div>"
  );
};
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0; //ms
var instructTimeThresh = 0; ///in seconds

// task specific variables
var possible_responses = [
  ["M", 77],
  ["Z", 90],
];
var chars = "BCDEFGHIJLMNOPQRSTUVWZ";
var trial_proportions = ["AX","AX","AX","AX","AX","AX","AX","BX", "AY","BY"];

var practice_list = jsPsych.randomization.repeat(trial_proportions, 1); 
 
var block1_list = jsPsych.randomization.repeat(trial_proportions, 4);
var block2_list = jsPsych.randomization.repeat(trial_proportions, 4);
var block3_list = jsPsych.randomization.repeat(trial_proportions, 4);

var blocks = [practice_list, block1_list, block2_list, block3_list];

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: "attention-check",
  data: {
    trial_id: "attention_check",
  },
  timing_response: 180000,
  response_ends_trial: true,
  timing_post_trial: 200,
};

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function () {
    return run_attention_checks;
  },
};

//Set up post task questionnaire
var post_task_block = {
  type: "survey-text",
  data: {
    trial_id: "post task questions",
  },
  questions: [
    '<p class = center-block-text style = "font-size: 20px">Por favor descreva com poucas palavras o que você fez durante a tarefa.</p>',
    '<p class = center-block-text style = "font-size: 20px">Você gostaria de fazer algum comentário sobre a tarefa?</p>',
  ],
  rows: [15, 15],
  columns: [60, 60],
};

// generic task variables
var run_attention_checks = false;
var attention_check_thresh = 0.65;

// task specific variables
/* define static blocks */
var end_block = {
  type: "poldrack-text",
  timing_response: 180000,
  data: {
    exp_id: "ax_cpt",
    trial_id: "end",
  },
  text: "<div class = centerbox><p class = center-block-text>Muito obrigada por completar essa tarefa!!</p><p class = center-block-text>Aperte <strong>enter</strong> para continuar.</p></div>",
  cont_key: [13],
  timing_post_trial: 0,
};

var feedback_instruct1_text =
  "Bem vinda (o) à tarefa de controle cognitivo. Aperte <strong>enter</strong> para começar.";

var feedback_instruct2_text = '<div class="block-text">Durante essa tarefa você verá uma série de cinco letras no centro da tela do computador.</p>\
 <div class="block-text">As letras aparecerão uma por vez. Você deve prestar muita atenção à primeira e a última letra que estarão escritas em vermelho.</p>\
 <div class="block-text">Quando a primeira letra for um "A" e a última for um "X" você deve apertar "M" após a última letra, o X.</p>\
 <div class="block-text">No caso de qualquer outra combinação de letras, você deve apertar "Z".'

var feedback_instruct3_text = 'Lembre-se, você deve apertar a tecla M depois de ver um "A" e um "X". Quando você vir qualquer outra combinação de letras, aperte Z.'

var feedback_instruct1_block = {
  type: "poldrack-text",
  cont_key: [13],
  text: getInstructFeedback(feedback_instruct1_text),
  data: {
    trial_id: "instruction",
  },
  timing_post_trial: 0,
  timing_response: 180000,
};

var feedback_instruct2_block = {
  type: "poldrack-text",
  cont_key: [13],
  text: getInstructFeedback(feedback_instruct2_text),
  data: {
    trial_id: "instruction",
  },
  timing_post_trial: 0,
  timing_response: 180000,
};

var feedback_instruct3_block = {
  type: "poldrack-text",
  cont_key: [13],
  text: getInstructFeedback(feedback_instruct3_text),
  data: {
    trial_id: "instruction",
  },
  timing_post_trial: 0,
  timing_response: 180000,
};


/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: "poldrack-instructions",
  pages: [
    '<div class = centerbox><p class = block-text>Durante essa tarefa você verá uma série de cinco letras no centro da tela do computador. As letras aparecerão uma por vez. Você deve prestar muita atenção à primeira e a última letra que estarão escritas em vermelho. Quando a primeira letra for um "A" e a última for um "X" você deve apertar ' +
      possible_responses[0][0] +
      " após a segunda letra, o X. No caso de qualquer outra combinação de letras, você deve apertar " +
      possible_responses[1][0] +
      ".</p></div>",
    '<div class = centerbox><p class = block-text>Lembre-se, você deve apertar a tecla M depois de ver um "A" e um "X". Quando você vir qualquer outra combinação de letras, aperte Z.</p></div>',
  ],
  allow_keys: false,
  data: {
    exp_id: "ax_cpt",
    trial_id: "instruction",
  },
  show_clickable_nav: true,
  timing_post_trial: 1000,
};

var instruction_node = {
  timeline: [feedback_instruct1_block, feedback_instruct2_block, feedback_instruct3_block],
  /* This function defines stopping criteria */
  loop_function: function (data) {
    for (i = 0; i < data.length; i++) {
      if (data[i].trial_type == "poldrack-instructions" && data[i].rt != -1) {
        rt = data[i].rt;
        sumInstructTime = sumInstructTime + rt;
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
      "Você leu as instruções rápido demais.  Por favor, leia de novo para ter certeza que as entendeu. Aperte <strong>enter</strong> para continuar.";
      return false;
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        "As instruções foram lidas. Aperte <strong>enter</strong> para continuar.";
      return false;
    }
  },
};

var rest_block = {
  type: "poldrack-text",
  timing_response: 180000,
  data: {
    trial_id: "rest",
  },
  text: "<div class = centerbox><p class = block-text>Está na hora de descansar um pouco! Quando quiser voltar à tarefa aperte ENTER. <div class = centerbox><p class = block-text>",
};
var end_pratice_block = {
  type: "poldrack-text",
  timing_response: 180000,
  data: {
    trial_id: "end_practice",
  },
  text: "<div class = centerbox><p class = block-text>Você completou a prática. Agora vamos para a tarefa principal. Aperte ENTER para continuar.</p></div>",
}

var fixation = {
  type: "poldrack-single-stim",
  stimulus: "<div class = centerbox><div class ='fixation-cross AX_feedback'>+</div></div>",
  is_html: true,
  choices: "none",
  data: {
    trial_id: "fixation",
  },
  timing_post_trial: 1000,
  timing_stim: 1000,
  timing_response: 1000,
};

/* define test block cues and probes*/
var A_cue = {
  type: "poldrack-single-stim",
  stimulus:
    "<div class = centerbox><div class ='AX_text red-text'>A</div></div>",
  is_html: true,
  choices: "none",
  data: {
    trial_id: "cue",
    exp_stage: "test",
  },
  timing_stim: 300,
  timing_response: 1000,
  response_ends_trial: false,
  timing_post_trial: 0,
};

var other_cue = {
  type: "poldrack-single-stim",
  stimulus: getChar(true),
  is_html: true,
  choices: "none",
  data: {
    trial_id: "cue",
    exp_stage: "test",
  },
  timing_stim: 300,
  timing_response: 1000,
  response_ends_trial: false,
  timing_post_trial: 0,
};

var X_probe = {
  type: "poldrack-single-stim",
  stimulus:
    "<div class = centerbox><div class='AX_text red-text'>X</div></div>",
  is_html: true,
  choices: [possible_responses[0][1], possible_responses[1][1]],
  data: {
    trial_id: "probe",
    exp_stage: "test",
  },
  timing_stim: 300,
  timing_response: 5000,
  response_ends_trial: true,
  timing_post_trial: 0,
};

var other_probe = {
  type: "poldrack-single-stim",
  stimulus: getChar(true),
  is_html: true,
  choices: [possible_responses[0][1], possible_responses[1][1]],
  data: {
    trial_id: "probe",
    exp_stage: "test",
  },
  timing_stim: 5000,
  timing_response: 1000,
  response_ends_trial: true,
  timing_post_trial: 0,
};

/* ************************************ */
/* colocar distrator */
/* ************************************ */
var distractor = {
  type: "poldrack-single-stim",
  stimulus: getChar(false),
  is_html: true,
  choices: "none",
  data: {
    trial_id: "dis",
    exp_stage: "test",
  },
  timing_stim: 300,
  timing_response: 1000,
  response_ends_trial: false,
  timing_post_trial: 0,
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */

var ax_cpt_experiment = [];
ax_cpt_experiment.push(instruction_node);

for (b = 0; b < blocks.length; b++) {
  var block = blocks[b];
  for (i = 0; i < block.length; i++) {
    switch (block[i]) {
      case "AX":
        cue = jQuery.extend(true, {}, A_cue);
        probe = jQuery.extend(true, {}, X_probe);
        cue.data.condition = "AX";
        probe.data.condition = "AX";
        break;
      case "BX":
        cue = jQuery.extend(true, {}, other_cue);
        probe = jQuery.extend(true, {}, X_probe);
        cue.data.condition = "BX";
        probe.data.condition = "BX";
        break;
      case "AY":
        cue = jQuery.extend(true, {}, A_cue);
        probe = jQuery.extend(true, {}, other_probe);
        cue.data.condition = "AY";
        probe.data.condition = "AY";
        break;
      case "BY":
        cue = jQuery.extend(true, {}, other_cue);
        probe = jQuery.extend(true, {}, other_probe);
        cue.data.condition = "BY";
        probe.data.condition = "BY";
        break;
      /* ************************************ */
      /* colocar distrator */
      /* ************************************ */
      case "dis":
        distractor = jQuery.extend(true, {}, other_cue);
        cue.data.condition = "dis";
        probe.data.condition = "dis";
        break;
    }

    ax_cpt_experiment.push(fixation);
    ax_cpt_experiment.push(cue);
    ax_cpt_experiment.push(distractor);
    ax_cpt_experiment.push(distractor);
    ax_cpt_experiment.push(distractor);
    ax_cpt_experiment.push(probe);

    if (b == 0 && i == block.length - 1) {
      ax_cpt_experiment.push(end_pratice_block);
    }
  }
  ax_cpt_experiment.push(attention_node);
  ax_cpt_experiment.push(rest_block);
}
ax_cpt_experiment.push(post_task_block);
ax_cpt_experiment.push(end_block);
