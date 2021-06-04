const axios = require('axios');
const ical = require('ical-generator');
const fs = require('fs');

const EVENT = 35;
const EVENT_NAME = 'SGDQ2021';

async function genICal() {
    const schedule = await axios.get(`https://gamesdonequick.com/tracker/search/?type=run&event=${EVENT}`).then(res => res.data);
    const lang = await axios.get(`https://runtogether-tw.github.io/gdq/lang/${EVENT}.json`).then(res => res.data);
    const cal = ical({
        domain: 'runtogether-tw.github.io',
        prodId: {company: 'runtogether-tw.github.io/gdq/', product: EVENT_NAME, language: 'ZH_TW'},
        name: 'GDQ中文時程表',
    });
    schedule.forEach((element) => {
        const data = element.fields; // deprecated_runners
        cal.createEvent({
            uid: element.pk,
            start: new Date(data.starttime),
            end: new Date(data.endtime),
            summary: `${lang[element.pk] ? lang[element.pk].tw : data.display_name} - ${data.category}`,
            description: `跑者: ${data.deprecated_runners}\n預估時間: ${data.run_time}\n英文名稱:${data.display_name}`,
        });
    });
    fs.writeFile('dist/gdq-tw.ical', cal.toString(),(err)=>{
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}
if (!fs.existsSync('dist')){
    fs.mkdirSync('dist');
}

genICal();
