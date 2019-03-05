import { STATUS_HIGH_LIST, STATUS_NAME, ATTR_LIST, ATTR_NCKU_FEW_LIST, ATTR_FEW_LIST, ATTR_NAME } from '../config';
import YearFind from './YearFind';

const SendPtcEmail = (props, state, getParticipantData) => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://stud.adm.ncku.edu.tw/act/chcwcup/register/mail.asp", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  let title = encodeURI(`[第${props.th}屆正興城灣盃]+${state.sportData.title}+報名資料`);

  let tableStyle = `'font-family:sans-serif,微軟正黑體;border-collapse:collapse;border:1px solid #aaa;'`;
  let trStyle = `'border:1px solid #aaa;'`;
  let thStyle = `'font-family:sans-serif,微軟正黑體;padding:5px;color:#fff;background-color:#00bcd4;font-weight:900'`;
  let tdStyle = `'font-family:sans-serif,微軟正黑體;padding:5px;'`;

  let university = props.university;
  const year = YearFind(state.yearData, props.th);
  let attrList = ATTR_LIST;
  if ('ncku' !== props.university) {
    attrList = ATTR_FEW_LIST;
  } else if (year.ncku_host) {
    attrList = ATTR_NCKU_FEW_LIST;
  }
  const mailAttrList = ['status'].concat(attrList);

  let body = `
  <div style="font-family:sans-serif,微軟正黑體;">
    ${state.contact.name} 您好：<br /><br />
    歡迎使用第${props.th}屆正興城灣盃報名系統，<br />
    您被設定為<span style="color:#2196f3">${university.toUpperCase()} ${state.sportData.title}</span>的聯絡人，<br />
    <span style="color:#2196f3">${state.sportData.title}</span>的報名資料如下：<br /><br />`;
  body += `
    <table style=${tableStyle}>
      <tr style=${trStyle}>
        <th style=${thStyle}></th>
        <th style=${thStyle}>姓名</th>
        <th style=${thStyle}>電話</th>
        <th style=${thStyle}>信箱</th>
      </tr>
      <tr style=${trStyle}>
        <td style=${tdStyle}>聯絡人</td>
        <td style=${tdStyle}>${state.contact.name}</td>
        <td style=${tdStyle}>${state.contact.phone}</td>
        <td style=${tdStyle}>${state.contact.email}</td>
      </tr>
    </table><br /><br />`;

    body += `
    <table style=${tableStyle}>
      <tr>
        <th style=${thStyle}>身分</th>
        <th style=${thStyle}>姓名</th>
      </tr>`;
    let isHighLevel = false;
    STATUS_HIGH_LIST.map(status => {
      if(status in state.participantsData) {
        isHighLevel = true;
        let uid = state.participantsData[status];
        if(uid in state.ptcsData) {
          let ptcInfo = getParticipantData(state.ptcsData[uid]);
          body += `<tr style=${trStyle}>
                    <td style=${tdStyle}>${STATUS_NAME[status]}</td>
                    <td style=${tdStyle}>${ptcInfo.name}</td>
                  </tr>`;
        } else {
          console.error(uid + " not in high ptcsData!!!");
        }
      }
      return 0;
    });
  body += `</table><br />`;

  body += `
    <table style=${tableStyle}>
      <tr style=${trStyle}>`;
  mailAttrList.map(attr => {
    body += `<th style=${thStyle}>${ATTR_NAME[attr]}</th>`;
    return 0;
  })
  body += `</tr>`;

  if ("leader" in state.participantsData && state.participantsData["leader"]) {
    let status = "leader"
    let uid = state.participantsData[status];
    if(uid in state.ptcsData) {
      let ptcInfo = getParticipantData(state.ptcsData[uid]);
      body += `<tr style=${trStyle}>
                <td style=${tdStyle}>${STATUS_NAME[status]}</td>`;
      attrList.map(attr => {
        if(attr !== "status") {
          body += `<td style=${tdStyle}>${ptcInfo[attr]}</td>`;
        }
        return 0;
      });
      body += `</tr>`;
    }
  }

  let memberName = isHighLevel ? "隊員" : "成員";
  let memberUids = 'member' in state.participantsData ?
                      Object.keys(state.participantsData["member"]) :
                      [];
  memberUids.map(uid => {
    if(uid in state.ptcsData) {
      let ptcInfo = getParticipantData(state.ptcsData[uid]);
      body += `<tr style=${trStyle}>
                <td style=${tdStyle}>${memberName}</td>`;
      attrList.map(attr => {
        if(attr !== "status") {
          body += `<td style=${tdStyle}>${ptcInfo[attr]}</td>`;
        }
        return 0;
      });
      body += `</tr>`;
    } else {
      console.error(uid + " not in member ptcsData!!!");
    }
    return 0;
  });

  body += `</table><br />`;

  body += `因資料已送出，無法再於系統修改，<br />
            如仍有需修改的資料或任何報名上的疑問，<br />
            煩請聯絡：<br />`;
  if ("contact" in year) {
    Object.values(year.contact).map(contactInfo => {
      body += `<br />
      <div style="color:#2196F3">
        ${contactInfo.title ? contactInfo.title : ""} ${contactInfo.name ? contactInfo.name : ""}<br />
        ${contactInfo.phone ? "電話: " + contactInfo.phone + "<br />" : ""}
        ${contactInfo.email ? "信箱: " + contactInfo.email + "<br />" : ""}
      </div>`
      return 0;
    });
  } else {
    body += `<div style="color:#2196F3">
      ${year.contact_name ? year.contact_name + "<br />" : ""}
      ${year.contact_phone ? year.contact_phone + "<br />" : ""}
      ${year.contact_email ? year.contact_email + "<br />" : ""}
    </div>`
  }
  body += `<br />
            感謝您的填寫<br />
            正興城灣盃籌備團隊 敬上<br />
            </div>
            `
  body = encodeURI(body);
  xhr.send(`uid=${props.user.uid}&email=${state.contact.email}&title=${title}&body=${body}`);
}

export default SendPtcEmail;