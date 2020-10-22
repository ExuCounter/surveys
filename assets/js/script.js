import data from '../json/data.js';

const surveyQuestionsContainer = document.getElementById('survey-questions__container');
const surveySelect = document.getElementById('survey-select');

/* FILL SURVEY SELECT */
const fillSurveySelect = () => {
    const { success } = data;
    if (success == 1) {
        const { results } = data;
        results.map(survey => {
            const { title } = survey;
            surveySelect.insertAdjacentHTML('beforeend', `
                <option value='${title.toLowerCase()}'>${title}</option>
            `)
            return title;
        })
    }
}

/* EXTRACT QUESTIONS DATA */
const extractQuestionsData = (value) => {
    const { results } = data;
    const currentSurvey = results.filter(survey => survey.title.toLowerCase() == value);
    const { questions, count } = currentSurvey[0];
    let questionNumber = 0;
    questions.forEach(question => {
        const { answers, question: questionTitle } = question;
        const percents = [];
        const labels = [];
        const colors = [];
        const names = [];
        let charCode = 65;
        questionNumber++;
        answers.forEach(answer => {
            const { percent, name, color } = answer;
            percents.push(percent);
            names.push(name);
            labels.push(String.fromCharCode(charCode));
            colors.push(color);
            charCode++;
        })
        createQuestionBlock(percents, colors, labels, count, names, questionTitle, questionNumber);
    })
}

/* HTML */
const totalResponsesHTML = `
    <div class="survey-answers__total-responses">
        <span class='survey-answers__total-responses__span'>
            Total responses: <span>(placeholder)</span>
        </span>
    </div>
`;

const totalRespondentsHTML = `
    <div class="survey-answers__total-respondents">
        <span class='survey-answers__total-respondents__span'>
            Total respondents: <span>(placeholder)</span>
        </span>
    </div>
`;

const surveyAnswersHeading = `
    <div class="survey-answers__heading">
        <div class='survey-answer__heading-percents'>
            %
        </div>
        <div class='survey-answer__heading-choices'>
            Responses
        </div>
    </div>
`;

const questionTitleHTML = (title) => {
    return `
        <h2 class='survey-question__title'>${title}</h2>
    `
};

const surveyQuestionNumber = (number) => {
    return `
        <div class='survey-question__number'>Q${number}</div>
    `
}

const surveyAnswersRow = (label, name, percent) => {
    return `
    <div class='survey-answers__row'>
            <div class="survey-answers__row-percents">
                <span>${percent}</span>
            </div>
            <div class="survey-answers__row-choices">
                <b>(${label})</b> ${name}
            </div>
        </div>
    `;
}

/* HTML END */

/* CREATE CHART */
const createChart = (ctx, { labels, percents, colors }) => {
    const options = {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '',
                data: percents,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        callback: function(value) {
                            return value + "%"
                        }
                    }
                }],
                xAxes: [{
                    ticks: {
                        callback: function(value) {
                            return '(' + value + ')'
                        }
                    }
                }]
            }
        }
    }
    new Chart(ctx, options);
}

/* CHART DIMENSIONS MANIPULATIONS ( CONDITIONS ) */
const chartDimensionsManipulation = (canvas) => {
    if (document.documentElement.offsetWidth < 568) {
        canvas.height = 300;
    }
}

/* CREATE INDEPENDENT QUESTION BLOCK */
const createQuestionBlock = (percents, colors, labels, count, names, questionTitle, questionNumber) => {
    const surveyQuestionBlock = document.createElement('div');
    const surveyChartContainer = document.createElement('div');
    surveyChartContainer.classList.add('survey-chart__container');

    const surveyChartCanvas = document.createElement('canvas');
    const surveyChartCanvasCtx = surveyChartCanvas.getContext('2d');
    surveyQuestionBlock.classList.add('survey-question__block');
    surveyChartCanvas.classList.add('survey-chart');
    surveyChartCanvas.classList.add(`survey-chart-${questionNumber}`);

    chartDimensionsManipulation(surveyChartCanvas);
    createChart(surveyChartCanvasCtx, { labels, percents, colors });

    const surveyAnswersContainer = document.createElement('div');
    surveyAnswersContainer.classList.add('survey-answers');
    surveyAnswersContainer.insertAdjacentHTML('afterbegin', surveyAnswersHeading);
    names.forEach((name, index) => {
        let row = surveyAnswersRow(labels[index], names[index], percents[index]);
        surveyAnswersContainer.insertAdjacentHTML('beforeend', row);
    })

    surveyQuestionBlock.insertAdjacentHTML('afterbegin', questionTitleHTML(questionTitle) + totalResponsesHTML + surveyQuestionNumber(questionNumber));
    surveyChartContainer.append(surveyChartCanvas);
    surveyQuestionBlock.append(surveyChartContainer);
    surveyQuestionBlock.append(surveyAnswersContainer);
    surveyQuestionBlock.insertAdjacentHTML('beforeend', totalRespondentsHTML);
    surveyQuestionsContainer.append(surveyQuestionBlock);
}

surveySelect.addEventListener('input', (e) => {
    surveyQuestionsContainer.innerHTML = '';
    extractQuestionsData(e.target.value);
})

Chart.defaults.global.tooltips = function() {
    enabled = false;
}

// Call first item in surveys select
fillSurveySelect();
extractQuestionsData(surveySelect[0].value);